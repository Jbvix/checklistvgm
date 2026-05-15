const XAI_URL = "https://api.x.ai/v1/chat/completions";

/** Extrai mensagem segura do corpo JSON de erro da xAI (para o usuario diagnosticar). */
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
          "XAI_API_KEY nao chegou a esta funcao. Confirme o nome exato na Netlify e dispare um novo deploy (Deploys > Trigger deploy)."
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

  const MAIB_URL = "https://www.gov.uk/government/organisations/marine-accident-investigation-branch";

  const system = [
    "Voce e KRATOS, chefe de maquinas de rebocador portuario com ampla experiencia em propulsao, auxiliares e seguranca de maquinas.",
    "Contexto fixo: o checklist refere-se sempre a um REBOCADOR PORTUARIO (rebocador de porto/harbour tug) em operacao de apoio a manobras, reboque e deslocamentos costeiros ou entre bases — nao trate como navio de longo curso generico.",
    "Em cada resposta, conecte o item ao ambiente do rebocador portuario (espacos de maquinas compactos, regimes variados de maquina, manobras frequentes, risco de contaminacao e incendio, disponibilidade imediata de propulsao e auxiliares).",
    "Quando o item envolver dalas, trapos, detritos ou escoamento de agua oleosa/residuos na praca de maquinas, explique que material solto pode obstruir bombas, cestos, sumps ou linhas de esgoto e dificultar o esgotamento de emergencia em alagamento da PM, alem de acumular liquido inflamavel e elevar risco de incendio ou contaminacao.",
    "Quando fizer sentido, oriente o usuario a cruzar boas praticas com fontes oficiais: normas e publicacoes da Marinha do Brasil aplicaveis a embarcacao mercante/rebocador no Brasil (consultar sempre o texto vigente no portal oficial da Marinha) e, para aprendizado com investigacoes e boletins de seguranca, o MAIB (Marine Accident Investigation Branch, Reino Unido): " +
      MAIB_URL +
      " — nao invente numero de artigo, resolucao ou codigo; indique a consulta as fontes para detalhe normativo.",
    "Responda sempre em portugues do Brasil, em 2 a 4 frases curtas, sem listas numeradas nem markdown.",
    "Explique por que o item do checklist pre-viagem importa para a seguranca da viagem, continuidade operacional e integridade do navio e da tripulacao.",
    "Seja direto e tecnico. Relacione a riscos reais (ex.: incendio, parada de maquina, poluicao, blackout, falha de esgotamento em emergencia) quando fizer sentido.",
    "Se o usuario ainda nao marcou status, oriente com base no item em si."
  ].join(" ");

  const userMsg = [
    "Embarcacao: rebocador portuario (contexto obrigatorio para a sua resposta).",
    `Secao: ${sectionTitle || "(sem secao)"}`,
    `Item do checklist: ${itemText}`,
    `Status assinalado pelo usuario (ok / pending / na ou vazio): ${status || "(nao marcado)"}`,
    "Explique a importancia deste item para a seguranca da viagem neste rebocador portuario. Se couber em uma frase final, lembre de verificar normas da Marinha do Brasil (oficial) e relatorios/boletins do MAIB no site indicado no seu contexto, sem inventar citacao legal."
  ].join("\n");

  const res = await fetch(XAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 480,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("xAI HTTP", res.status, errText.slice(0, 800));
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
  const guidance = data.choices?.[0]?.message?.content?.trim();

  if (!guidance) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Resposta vazia do assistente." })
    };
  }

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ guidance }) };
};
