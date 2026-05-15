const { retrieveKnowledge } = require("./lib/knowledge");

const DEFAULT_GPT_BASE = "https://api.openai.com/v1";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function parseApiErrorMessage(raw) {
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
    "Acoplamento propulsao: Schottel = pneumatico; Rolls Royce = hidraulico — use a marca informada no equipamento.",
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

function formatEquipmentBlock(equipment) {
  if (!equipment || typeof equipment !== "object") return "";
  const lines = [];
  if (equipment.mcp) lines.push(`MCP: ${equipment.mcp}`);
  if (equipment.propulsion) lines.push(`Propulsores: ${equipment.propulsion}`);
  if (equipment.generator) lines.push(`Geradores: ${equipment.generator}`);
  if (equipment.winch) lines.push(`Guinchos de manobra: ${equipment.winch}`);
  return lines.length ? lines.join("\n") : "";
}

function buildUserContent(sectionTitle, itemText, status, localExcerpts, equipment) {
  const equipmentBlock = formatEquipmentBlock(equipment);
  return [
    buildInstructions(),
    "",
    localExcerpts.length
      ? "CONTEXTO (glossario/persona/normas — nao invente alem disso):\n" + localExcerpts.join("\n\n")
      : "CONTEXTO: use conhecimento tecnico de rebocador; nao invente citacao legal.",
    "",
    equipmentBlock ? `Equipamento deste rebocador:\n${equipmentBlock}` : "",
    equipmentBlock ? "" : null,
    `Secao: ${sectionTitle || "(sem secao)"}`,
    `Item: ${itemText}`,
    `Status: ${status || "(nao marcado)"}`,
    "",
    "Tarefa: importancia deste item para a seguranca da viagem costeira/oceânica neste rebocador."
  ]
    .filter((line) => line !== null)
    .join("\n");
}

async function callOpenAiChat(messages, model, apiKey, apiBase) {
  const base = (apiBase || DEFAULT_GPT_BASE).replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  const res = await fetch(url, {
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

async function generateGuidance({ systemPrompt, userContent, model, apiKey, apiBase }) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  ];

  const chat = await callOpenAiChat(messages, model, apiKey, apiBase);
  const guidance = chat.res.ok ? extractResponseText(chat.data) : "";

  if (guidance) {
    return { guidance, mode: "openai-chat" };
  }

  if (!chat.res.ok) {
    console.error("OpenAI chat/completions", chat.res.status, chat.raw.slice(0, 600));
  } else {
    console.error("OpenAI empty output", JSON.stringify(chat.data).slice(0, 400));
  }

  const hint = parseApiErrorMessage(chat.raw);
  const status = chat.res.status;
  throw new Error(
    hint ||
      (status === 401 || status === 403
        ? "Chave GPT recusada. Confira GPT_API_KEY na Netlify."
        : `Servico GPT indisponivel (HTTP ${status || "?"}). Tente novamente.`)
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
    if (!process.env.GPT_API_KEY) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({
          error:
            "GPT_API_KEY nao configurada. Netlify: Environment variables > Production > novo deploy."
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
    const equipment = payload.equipment && typeof payload.equipment === "object" ? payload.equipment : {};
    const safeEquipment = {
      mcp: String(equipment.mcp || "").slice(0, 64),
      propulsion: String(equipment.propulsion || "").slice(0, 64),
      generator: String(equipment.generator || "").slice(0, 64),
      winch: String(equipment.winch || "").slice(0, 64)
    };

    if (!itemText.trim()) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Texto do item ausente" }) };
    }

    const model = process.env.GPT_MODEL || "gpt-4o-mini";
    const apiBase = process.env.GPT_API_BASE || DEFAULT_GPT_BASE;

    const query = [sectionTitle, itemText, formatEquipmentBlock(safeEquipment)].filter(Boolean).join(" ");
    const { excerpts } = retrieveKnowledge(query, { limit: 5, maxChars: 3500 });
    const userContent = buildUserContent(sectionTitle, itemText, status, excerpts, safeEquipment);

    const { guidance, mode } = await generateGuidance({
      systemPrompt: buildSystemPrompt(),
      userContent,
      model,
      apiKey: process.env.GPT_API_KEY,
      apiBase
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
