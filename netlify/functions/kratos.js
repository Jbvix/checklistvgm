const XAI_URL = "https://api.x.ai/v1/chat/completions";

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
        error: "Configure a variavel XAI_API_KEY no painel da Netlify (Site > Environment variables)."
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

  const model = process.env.XAI_MODEL || "grok-2-latest";

  const system = [
    "Voce e KRATOS, chefe de maquinas de rebocador portuario com ampla experiencia em propulsao, auxiliares e seguranca de maquinas.",
    "Responda sempre em portugues do Brasil, em 2 a 4 frases curtas, sem listas numeradas nem markdown.",
    "Explique por que o item do checklist pre-viagem importa para a seguranca da viagem, continuidade operacional e integridade do navio e da tripulacao.",
    "Seja direto e tecnico; nao invente numeros de norma ou regulamento. Relacione a riscos reais (ex.: incendio, parada de maquina, poluicao, blackout) quando fizer sentido.",
    "Se o usuario ainda nao marcou status, oriente com base no item em si."
  ].join(" ");

  const userMsg = [
    `Secao: ${sectionTitle || "(sem secao)"}`,
    `Item do checklist: ${itemText}`,
    `Status assinalado pelo usuario (ok / pending / na ou vazio): ${status || "(nao marcado)"}`,
    "Explique a importancia deste item para a seguranca da viagem."
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
      max_tokens: 400,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("xAI HTTP", res.status, errText.slice(0, 500));
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Falha ao consultar o assistente. Tente novamente em instantes." })
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
