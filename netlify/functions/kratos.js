const { retrieveKnowledge } = require("./lib/knowledge");

const XAI_RESPONSES_URL = "https://api.x.ai/v1/responses";

const MAIB_URL = "https://www.gov.uk/government/organisations/marine-accident-investigation-branch";

/** Dominios prioritarios para busca (max 5 na API xAI). */
const WEB_SEARCH_DOMAINS = ["gov.uk", "marinha.mil.br", "imo.org", "gov.br", "www6.mar.mil.br"];

function parseXaiErrorMessage(raw) {
  if (!raw || typeof raw !== "string") return "";
  try {
    const j = JSON.parse(raw);
    const msg = j?.error?.message || j?.message;
    if (typeof msg !== "string") return "";
    return msg.replace(/\s+/g, " ").trim().slice(0, 220);
  } catch {
    return "";
  }
}

function extractResponseText(data) {
  const parts = [];
  for (const item of data?.output || []) {
    if (item.type !== "message" || !Array.isArray(item.content)) continue;
    for (const block of item.content) {
      if (block.type === "output_text" && block.text) {
        parts.push(block.text);
      }
    }
  }
  return parts.join("\n").trim();
}

function buildSystemPrompt() {
  return [
    "Voce e KRATOS — chefe de maquinas experiente da Marinha Mercante, guardiao da Praca de Maquinas de um rebocador portuario em viagem costeira entre portos brasileiros (trechos oceanicos).",
    "",
    "PERSONA (como voce pensa, nao como voce escreve em excesso):",
    "- Responsavel por propulsao (MCP, propulsores azimutais), energia (MCA/geradores), combustivel, lubrificacao, arrefecimento, hidraulica, alarmes e seguranca da PM.",
    "- Ambiente severo: calor, ruido, balanco, vibracao, fadiga, recursos limitados; decisoes com o que ha a bordo.",
    "- Metodico e preventivo: cada item do checklist pre-viagem evita falha que voce teria de enfrentar em mar; percebe risco por parametro, vazamento, temperatura, organizacao e apeacao.",
    "- Comunica com o passadico sobre limitacoes de maquina; no checklist, orienta o executor da verificacao antes da saida.",
    "- Tom: firme, tecnico, disciplinado — NUNCA melodramatico nem alarmista nas respostas curtas ao usuario.",
    "",
    "CONTEXTO DESTA FERRAMENTA:",
    "- Checklist PRE-VIAGEM (nao substitui diario de maquinas em tempo real).",
    "- Explique por que o item protege a viagem, a tripulacao e a continuidade operacional.",
    "",
    "REFERENCIAS NORMATIVAS:",
    "- PDFs locais: SOLAS, NORMAM 201, MARPOL Anexo I + glossario/persona KRATOS nos trechos fornecidos.",
    "- MAIB (licoes aprendidas): " + MAIB_URL + " e busca na web quando necessario.",
  ].join("\n");
}

function buildInstructions() {
  return [
    "REGRAS DE RESPOSTA (obrigatorias):",
    "1. Portugues do Brasil; 2 a 4 frases curtas; sem markdown, sem listas numeradas.",
    "2. Fale como chefe de maquinas em viagem: foco em seguranca, continuidade operacional e protecao da tripulacao — 2 a 4 frases objetivas, sem tom epico nem alarmismo.",
    "3. ANTI-ALUCINACAO: nunca invente numero de artigo, capitulo, resolucao, data de norma ou citacao de relatorio MAIB. Se nao tiver certeza apos busca, diga para conferir o texto oficial (SOLAS/NORMAM/MARPOL) ou o relatorio MAIB correspondente, sem citar numero falso.",
    "4. Referencie normas pelo NOME (SOLAS, NORMAM, MARPOL) e pelo TEMA; cite artigo ou item SOMENTE se constar explicitamente nos trechos da base local fornecidos abaixo.",
    "5. Quando couber, mencione licoes do MAIB de forma generica, sem inventar nome de navio ou data de acidente.",
    "6. Use trechos da base local como fonte principal; use busca na web para MAIB ou atualizacoes oficiais quando os trechos locais forem insuficientes.",
    "7. Itens sobre dalas/trapos/agua oleosa na Praca de Maquinas: material solto pode obstruir esgotamento e agravar alagamento e risco de incendio — explique de forma proporcional ao risco, sem exageros.",
    "8. Nomenclatura: Praça de Máquinas (nao PM); Compartimento dos Azimutais (nao Schottel).",
    "9. No checklist, 'carga' de oleo lubrificante = volume para encher um carter (MCP em geral 600 ou 800 L por motor); use o glossario operacional se fornecido no contexto.",
    "10. Material de consumo e ferramentas: use bom senso e o glossario. Ex.: engates rapidos de ar = montagem da bomba Sand Piper e mangueiras de ar (nao priorizar 'ferramenta pneumatica generica' se o glossario indicar Sand Piper); tubolit = tubulacao; massa de calafetar = vigias/parabrisas, nao pressurizado.",
    "11. Se o glossario nao cobrir o item, use busca na web para uso tecnico do produto e adapte ao rebocador; nao invente norma nem marca.",
    "12. Frise apeacao e guarda: no balanco, material solto obstrui esgotamento e agrava alagamento/incendio na Praca de Maquinas; citar acondicionamento das caixas/filetes quando for massa de calafetar ou consumivel volumoso.",
    "13. Encerre com acao pratica ligada ao item do checklist (verificar quantidade, acondicionamento e fixacao antes da saida).",
  ].join("\n");
}

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Metodo nao permitido" })
    };
  }

  if (!process.env.XAI_API_KEY) {
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({
        error:
          "XAI_API_KEY nao chegou a esta funcao. Confirme o nome na Netlify e dispare um novo deploy."
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
  const webSearchEnabled = process.env.KRATOS_WEB_SEARCH !== "false";

  const query = `${sectionTitle} ${itemText}`;
  const { excerpts: localExcerpts } = retrieveKnowledge(query, { limit: 4, maxChars: 3000 });

  const userContent = [
    buildInstructions(),
    "",
    localExcerpts.length
      ? "TRECHOS DA BASE LOCAL (SOLAS / NORMAM / MARPOL — use como referencia; nao invente alem disso):\n" +
        localExcerpts.join("\n\n")
      : "TRECHOS DA BASE LOCAL: indice ainda nao gerado ou sem correspondencia para este item; use busca na web com cautela.",
    "",
    "Dados do item:",
    "- Embarcacao: rebocador portuario em viagem costeira entre portos (navegacao oceanica nos trechos de deslocamento).",
    `- Secao: ${sectionTitle || "(sem secao)"}`,
    `- Item do checklist: ${itemText}`,
    `- Status do usuario (ok / pending / na ou vazio): ${status || "(nao marcado)"}`,
    "",
    "Tarefa: explique por que este item importa para a seguranca desta viagem. Use busca na web se precisar de apoio em MAIB, SOLAS, NORMAM ou MARPOL; nao invente citacoes."
  ].join("\n");

  const body = {
    model,
    store: false,
    temperature: 0.22,
    max_output_tokens: 520,
    input: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userContent }
    ]
  };

  if (webSearchEnabled) {
    body.tools = [
      {
        type: "web_search",
        filters: { allowed_domains: WEB_SEARCH_DOMAINS }
      }
    ];
  }

  const res = await fetch(XAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("xAI Responses HTTP", res.status, errText.slice(0, 800));
    const apiHint = parseXaiErrorMessage(errText);
    const fallback =
      res.status === 401 || res.status === 403
        ? "Chave da API xAI recusada (401/403). Confira XAI_API_KEY na Netlify."
        : `A API xAI respondeu HTTP ${res.status}. Verifique creditos, modelo (XAI_MODEL) e um novo deploy.`;
    const error = apiHint ? `xAI: ${apiHint}` : fallback;
    return {
      statusCode: res.status >= 500 ? 502 : 400,
      headers: corsHeaders,
      body: JSON.stringify({ error })
    };
  }

  const data = await res.json();
  const guidance = extractResponseText(data);

  if (!guidance) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Resposta vazia do assistente." })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ guidance, webSearch: webSearchEnabled })
  };
};
