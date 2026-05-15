const { retrieveKnowledge } = require("./lib/knowledge");

const XAI_RESPONSES_URL = "https://api.x.ai/v1/responses";
const XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions";
const MAIB_URL = "https://www.gov.uk/government/organisations/marine-accident-investigation-branch";
const WEB_SEARCH_DOMAINS = ["gov.uk", "marinha.mil.br", "imo.org", "gov.br", "www6.mar.mil.br"];

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function parseXaiErrorMessage(raw) {
  if (!raw || typeof raw !== "string") return "";
  try {
    const j = JSON.parse(raw);
    const msg = j?.error?.message || j?.message;
    if (typeof msg !== "string") return "";
    return msg.replace(/\s+/g, " ").trim().slice(0, 280);
  } catch {
    return raw.replace(/\s+/g, " ").trim().slice(0, 280);
  }
}

function extractResponseText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = [];
  for (const item of data.output || []) {
    if (item.type === "message" && Array.isArray(item.content)) {
      for (const block of item.content) {
        if (block.type === "output_text" && block.text) parts.push(block.text);
        else if (typeof block.text === "string") parts.push(block.text);
      }
    } else if (item.type === "output_text" && item.text) {
      parts.push(item.text);
    }
  }
  if (parts.length) return parts.join("\n").trim();
  const chat = data.choices?.[0]?.message?.content;
  return typeof chat === "string" ? chat.trim() : "";
}

function buildSystemPrompt() {
  return [
    "Voce e KRATOS — chefe de maquinas experiente da Marinha Mercante, guardiao da Praca de Maquinas de um rebocador portuario em viagem costeira entre portos brasileiros (trechos oceanicos).",
    "Tom: firme, tecnico, disciplinado — respostas curtas em portugues do Brasil, sem alarmismo nem tom epico.",
    "Checklist PRE-VIAGEM: explique por que o item protege a viagem e a tripulacao.",
    "Nomenclatura: Praca de Maquinas (nao PM); Compartimento dos Azimutais (nao Schottel).",
    "Normas: SOLAS, NORMAM, MARPOL e licoes MAIB quando couber, sem inventar citacao.",
    "Use o glossario/persona nos trechos fornecidos; 'carga' conforme glossario."
  ].join(" ");
}

function buildInstructions() {
  return [
    "REGRAS: 2 a 4 frases; sem markdown; anti-alucinacao em citacoes normativas;",
    "bom senso em consumiveis (tubolit, calafetar, engates/Sand Piper, termometro infravermelho);",
    "apeacao e guarda no balanco; encerre com verificacao antes da saida."
  ].join(" ");
}

function buildUserContent(sectionTitle, itemText, status, localExcerpts) {
  return [
    buildInstructions(),
    "",
    localExcerpts.length
      ? "CONTEXTO (glossario/persona/normas — nao invente alem disso):\n" + localExcerpts.join("\n\n")
      : "CONTEXTO: use conhecimento tecnico de rebocador; nao invente citacao legal.",
    "",
    `Secao: ${sectionTitle || "(sem secao)"}`,
    `Item: ${itemText}`,
    `Status: ${status || "(nao marcado)"}`,
    "",
    "Tarefa: importancia deste item para a seguranca da viagem costeira/oceânica neste rebocador."
  ].join("\n");
}

async function callXaiResponses(body, apiKey) {
  const res = await fetch(XAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  const raw = await res.text().catch(() => "");
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  return { res, data, raw };
}

async function callXaiChat(messages, model, apiKey) {
  const res = await fetch(XAI_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.22,
      max_tokens: 520,
      messages
    })
  });
  const raw = await res.text().catch(() => "");
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  return { res, data, raw };
}

async function generateGuidance({ systemPrompt, userContent, model, apiKey, useWebSearch }) {
  const input = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  ];

  const responsesBody = {
    model,
    store: false,
    temperature: 0.22,
    max_output_tokens: 520,
    input
  };

  if (useWebSearch) {
    responsesBody.tools = [{ type: "web_search", filters: { allowed_domains: WEB_SEARCH_DOMAINS } }];
  }

  let { res, data, raw } = await callXaiResponses(responsesBody, apiKey);
  let guidance = res.ok ? extractResponseText(data) : "";

  if (guidance) {
    return { guidance, mode: useWebSearch ? "responses+web" : "responses" };
  }

  if (!res.ok) {
    console.error("xAI Responses", res.status, raw.slice(0, 600));
  } else {
    console.error("xAI Responses empty output", JSON.stringify(data).slice(0, 400));
  }

  const chat = await callXaiChat(input, model, apiKey);
  guidance = chat.res.ok ? extractResponseText(chat.data) : "";

  if (guidance) {
    return { guidance, mode: "chat-fallback" };
  }

  const hint = parseXaiErrorMessage(raw) || parseXaiErrorMessage(chat.raw);
  const status = res.status || chat.res.status;
  throw new Error(
    hint ||
      (status === 401 || status === 403
        ? "Chave xAI recusada. Confira XAI_API_KEY na Netlify."
        : `Servico xAI indisponivel (HTTP ${status || "?"}). Tente novamente.`)
  );
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Metodo nao permitido" }) };
  }

  try {
    if (!process.env.XAI_API_KEY) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({
          error:
            "XAI_API_KEY nao configurada. Netlify: Environment variables > Production > novo deploy."
        })
      };
    }

    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "JSON invalido" }) };
    }

    const sectionTitle = String(payload.sectionTitle || "").slice(0, 400);
    const itemText = String(payload.itemText || "").slice(0, 2200);
    const status = String(payload.status || "").slice(0, 32);

    if (!itemText.trim()) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Texto do item ausente" }) };
    }

    const model = process.env.XAI_MODEL || "grok-4.3";
    const useWebSearch = process.env.KRATOS_WEB_SEARCH === "true";

    const query = `${sectionTitle} ${itemText}`;
    const { excerpts } = retrieveKnowledge(query, { limit: 5, maxChars: 3500 });
    const userContent = buildUserContent(sectionTitle, itemText, status, excerpts);

    const { guidance, mode } = await generateGuidance({
      systemPrompt: buildSystemPrompt(),
      userContent,
      model,
      apiKey: process.env.XAI_API_KEY,
      useWebSearch
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ guidance, mode })
    };
  } catch (err) {
    console.error("kratos handler error", err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || "Erro interno no assistente KRATOS." })
    };
  }
};
