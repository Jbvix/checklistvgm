const WHATSAPP_NUMBER = "5585997737230";
const STORAGE_KEY = "rebocador-vgm-checklist-v1";
const KRATOS_FN = "/.netlify/functions/kratos";
const KRATOS_PROMPT_VERSION = 3;

const checklist = [
  {
    title: "Residuos",
    items: [
      "Residuos dos dalas, tanques de aguas oleosas e oleo sujo devidamente esgotados.",
      "Remover trapos das dalas e qualquer material que possa dificultar o esgoto."
    ]
  },
  {
    title: "Ventilacoes",
    items: [
      "Ventilacoes da PM em funcionamento.",
      "Ventilacao do sistema Schottel operacional.",
      "Exaustores das acomodacoes e cozinha operacionais."
    ]
  },
  {
    title: "Seguranca",
    items: [
      "Estanqueidade das saidas de emergencia aprovada, recomendado teste com giz.",
      "Bombas de incendio e esgoto operacionais.",
      "Bomba Sand Piper pneumatica com mangueiras conectadas e mangueira de ar completa.",
      "Boias de alarme dos dalas operacionais.",
      "Painel de alarme funcionando, verificar e corrigir alarmes falsos ou ativos.",
      "Extintores revisados, lacrados, integros e abastecidos.",
      "Caixas de incendio com mangueiras, chaves e esguichos integros.",
      "KIT SOPEP revisado, completo e integro.",
      "Comunicacao PM, Schottel e passadico testada, headsets integros e telefone autoexcitado operacional.",
      "Alarme visual e sonoro PM e Schottel operacional.",
      "Botoeira de parada de bombas e ventilacao testada e operacional.",
      "Limpadores de parabrisa e esguichos do passadico operacionais e integros."
    ]
  },
  {
    title: "Sistema Eletrico e Baterias",
    items: [
      "Carregadores de baterias sem alarme, funcionamento OK.",
      "Baterias da PM e Tijupa dentro da validade aceitavel, bornes integros.",
      "Luzes de emergencia operacionais, com lampadas de reserva."
    ]
  },
  {
    title: "Sistema de Oleo Diesel",
    items: [
      "Purificador limpo e operacional, com correia reserva e chaves especiais para desmontagem e limpeza.",
      "Alarme e parada de quebra de selo do purificador testado e operacional.",
      "Bombas de transferencia de oleo diesel operacionais e testadas.",
      "Valvulas de corte de oleo e tanques de oleo diesel de servico comunicados.",
      "Trenas de sondagem integras.",
      "Visores de nivel dos tanques funcionais e integros, sem vazamentos.",
      "Inspecao dos tanques com pasta rosa.",
      "Suspiros e valvulas de dreno dos tanques de contencao no conves sem obstrucoes.",
      "Tanque Overflow vazio.",
      "Alarmes de baixo nivel dos tanques de servico e alto nivel Overflow operacionais."
    ]
  },
  {
    title: "Compressores de Ar",
    items: [
      "Compressores em status operacional.",
      "02 correias reserva disponiveis.",
      "Oleo lubrificante reserva disponivel.",
      "Purgadores automaticos, drenos de descompressao e reguladores de pressao operacionais, sem vazamentos."
    ]
  },
  {
    title: "MCAs",
    items: [
      "Protecao de baixa pressao de oleo lubrificante testada e aprovada.",
      "Protecao de alta temperatura do liquido de arrefecimento testada e aprovada.",
      "Protecao de overspeed testada e aprovada.",
      "Troca de oleo e filtros realizada.",
      "Substituicao dos elementos Racor: 04 unidades.",
      "Inspecao visual de vazamentos de oleo lubrificante e oleo diesel realizada.",
      "Isolamento termico nas turbinas e partes aquecidas completo e em bom estado.",
      "Displays com visualizacao correta de parametros de operacao.",
      "QEP com instrumentos de medicao operacionais.",
      "Sobressalente: 01 BBA de agua.",
      "Sobressalente: 01 kit de mangotes para redes de arrefecimento.",
      "Sobressalente: 02 switches da bomba injetora.",
      "Sobressalente: 02 sensores de pressao."
    ]
  },
  {
    title: "MCPs",
    items: [
      "Teste de parada de emergencia realizado.",
      "Parada por alta temperatura do fluido de arrefecimento testada.",
      "Parada por baixa pressao de oleo lubrificante testada.",
      "Parada por overspeed testada.",
      "Vazamentos consideraveis de oleo lubrificante, oleo diesel e liquido de arrefecimento identificados e corrigidos.",
      "Mangueiras de oleo diesel inspecionadas e substituidas se ressecadas.",
      "Aquecedores de fluido de arrefecimento desligados e isolados.",
      "Bombas do guincho de manobra operacionais e desacopladas para viagem.",
      "Nivel do carter inspecionado e ultima troca de oleo lubrificante identificada."
    ]
  },
  {
    title: "Ar Condicionado",
    items: [
      "Sistema operacional.",
      "Bombas de agua gelada e condensador sem ruidos.",
      "Bombas de agua gelada e condensador com pressao normal.",
      "Ralo de AS limpo recentemente.",
      "Evaporadores limpos.",
      "Drenos desobstruidos."
    ]
  },
  {
    title: "Propulsores",
    items: [
      "Oleo lubrificante e hidraulico em niveis normais, com vazamentos identificados e corrigidos.",
      "Bombas de refrigeracao operacionais no automatico.",
      "Sistema de governo testado na emergencia e NFU.",
      "Valvulas reguladoras de pressao OK.",
      "Filtros de oleo lubrificante e hidraulico trocados.",
      "Temperatura da caixa de engrenagens e mancais verificada.",
      "Temperatura do resfriador de oleo hidraulico do sistema de governo e caixa de engrenagens verificada, resfriadores limpos."
    ]
  },
  {
    title: "Filtros e Fluidos Reserva",
    items: [
      "Filtros de oleo diesel reserva: 3 cargas de Racor e 2 cargas de filtros diferenciais de oleo combustivel dos MCPs, nao inclui a carga de substituicao antes da saida.",
      "Filtros de oleo diesel reserva: 3 cargas de Racor e 3 cargas de filtros diferenciais de oleo combustivel dos MCPs.",
      "Trocas de oleo: 06 cargas para cada MCA.",
      "Oleo lubrificante dos MCPs e MCAs: 1 carga MCPs e tanque reserva cheio com 400 litros.",
      "Oleo hidraulico do sistema de governo: 10 baldes de 20 litros, total 200 litros.",
      "Oleo lubrificante do sistema de propulsao: 20 baldes de 20 litros, total 400 litros.",
      "Liquido de arrefecimento ELC: 10 baldes de 20 litros, total 200 litros.",
      "Filtros de oleo lubrificante dos propulsores: 02 cargas.",
      "Filtros de oleo hidraulico do governo dos propulsores: 06 cargas.",
      "Tanques de oleo lubrificante e hidraulico em nivel normal."
    ]
  },
  {
    title: "Material de Consumo",
    items: [
      "04 fardos de trapo.",
      "05 folhas de lixa para metal 100 e 320 cada.",
      "03 silvertapes.",
      "02 kg de tubolit.",
      "01 pacote de cada abracadeira Hellerman: pequenas, medias e grandes.",
      "05 latas de WD40.",
      "03 limpa contato.",
      "01 papelao guarnital para junta.",
      "02 tubos de cola veda junta.",
      "04 tubos de cola silicone.",
      "03 tubos de espuma expansiva.",
      "03 caixas de massa de calafetar, 24 filetes de 350g.",
      "01 lencol de borracha 02 mm para junta.",
      "04 super bonder.",
      "04 fitas de catraca para peacao 1,5 ton.",
      "01 bisnaga trava rosca.",
      "10 abracadeiras de cada: 8 x 13mm, 8 x 10mm, 10 x 13mm, 13 x 19mm, 16 x 19mm e 19 x 25mm.",
      "Conectores eletricos de fio isolado, garfo, anel, pa e desconexao rapida: 20 de cada ou caixa com kit.",
      "50 conectores de torcao.",
      "50 conectores sindal preto.",
      "05 fitas isolantes.",
      "05 fitas veda rosca.",
      "03 fitas alta fusao.",
      "Kit fusivel: 10x 0.2A, 0.4A, 0.6A, 0.8A, 1A, 2A e 3A.",
      "01 arco de serra.",
      "05 laminas de serra.",
      "03 niples de reducao macho e femea cada: 1/2 x 3/4, 3/8 x 1/4 e 1/2 x 1/4.",
      "05 niples macho e femea: 1/2, 3/4 e 1 pol.",
      "05 espigoes cada: 1/8, 1/4, 1/2 e 3/4.",
      "03 engates rapidos ar de 1/4 e 1/2.",
      "02 kits conjunto de Orings POL caixa vermelha e MM caixa azul."
    ]
  },
  {
    title: "Ferramentas",
    items: [
      "Chaves combinadas: 6, 7, 8, 10, 12, 13, 14, 15, 17, 19, 24, 27, 28, 30, 32 e 36.",
      "Jogo de chaves de grifo pequena, media e grande.",
      "Alicate de pressao.",
      "Chaves de fenda pequena, media e grande.",
      "Chave phillips pequena e media.",
      "Kit de chave Allen em mm.",
      "Chave inglesa pequena e media.",
      "Chave saca filtro.",
      "Infrared.",
      "Multimetro.",
      "03 lanternas recarregaveis.",
      "04 pilhas AA, 04 pilhas AAA e 02 baterias 12V reserva.",
      "01 pe de cabra.",
      "01 marreta oitavada de 1 kg.",
      "01 martelo bola de 0,5 kg.",
      "01 tesoura de junta.",
      "Alicates universal, bico e corte.",
      "01 parafusadeira a bateria com ponteiras.",
      "01 furadeira completa.",
      "Ferramentas para manutencao geral disponiveis em bom estado.",
      "Inspecao double check final pela equipe de viagem."
    ]
  }
];

const state = loadState();
let activeSection = "Todas";

const els = {
  checklist: document.querySelector("#checklist"),
  tabs: document.querySelector("#section-tabs"),
  search: document.querySelector("#search"),
  origin: document.querySelector("#origin"),
  destination: document.querySelector("#destination"),
  vessel: document.querySelector("#vessel"),
  responsible: document.querySelector("#responsible"),
  date: document.querySelector("#date"),
  time: document.querySelector("#time"),
  notes: document.querySelector("#notes"),
  percent: document.querySelector("#progress-percent"),
  progressBar: document.querySelector("#progress-bar"),
  progressBarSticky: document.querySelector("#progress-bar-sticky"),
  ok: document.querySelector("#count-ok"),
  pending: document.querySelector("#count-pending"),
  total: document.querySelector("#count-total"),
  whatsapp: document.querySelector("#whatsapp"),
  copy: document.querySelector("#copy"),
  clear: document.querySelector("#clear"),
  expandAll: document.querySelector("#expand-all"),
  themeToggle: document.querySelector("#theme-toggle"),
  openSignature: document.querySelector("#open-signature"),
  closeSignature: document.querySelector("#close-signature"),
  signatureModal: document.querySelector("#signature-modal"),
  signaturePad: document.querySelector("#signature-pad"),
  signaturePreview: document.querySelector("#signature-preview"),
  signatureStatus: document.querySelector("#signature-status"),
  clearSignature: document.querySelector("#clear-signature"),
  saveSignature: document.querySelector("#save-signature"),
  backToTop: document.querySelector("#back-to-top"),
  toast: document.querySelector("#toast")
};

init();

function init() {
  applyTheme();
  hydrateForm();
  renderTabs();
  renderChecklist();
  updateSummary();
  updateSignaturePreview();
  initWaveCanvas();
  initSignaturePad();

  [els.origin, els.destination, els.vessel, els.responsible, els.date, els.time, els.notes].forEach((input) => {
    input.addEventListener("input", () => {
      state.meta[input.id] = input.value;
      persist();
      updateSummary();
    });
  });

  els.search.addEventListener("input", renderChecklist);
  els.copy.addEventListener("click", copyMessage);
  els.whatsapp.addEventListener("click", shareWhatsAppPdf);
  els.clear.addEventListener("click", clearChecklist);
  els.expandAll.addEventListener("click", toggleAllSections);
  els.themeToggle.addEventListener("click", toggleTheme);
  els.openSignature.addEventListener("click", openSignatureModal);
  els.closeSignature.addEventListener("click", () => els.signatureModal.close());
  els.clearSignature.addEventListener("click", clearSignaturePad);
  els.saveSignature.addEventListener("click", saveSignature);
  els.backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", toggleBackToTop);
}

function hydrateForm() {
  const now = new Date();
  state.meta.date ||= now.toISOString().slice(0, 10);
  state.meta.time ||= now.toTimeString().slice(0, 5);

  els.vessel.value = state.meta.vessel || "";
  els.origin.value = state.meta.origin || "";
  els.destination.value = state.meta.destination || "";
  els.responsible.value = state.meta.responsible || "";
  els.date.value = state.meta.date || "";
  els.time.value = state.meta.time || "";
  els.notes.value = state.meta.notes || "";
}

function renderTabs() {
  const tabs = ["Todas", ...checklist.map((section) => section.title)];
  els.tabs.innerHTML = tabs
    .map((tab) => {
      const active = tab === activeSection;
      return `<button class="tab shrink-0 rounded-md border px-3 py-2 text-sm font-semibold ${
        active ? "border-sea bg-sea text-white" : "border-slate-300 bg-white text-slate-700"
      }" data-section="${escapeHtml(tab)}">${escapeHtml(tab)}</button>`;
    })
    .join("");

  els.tabs.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeSection = button.dataset.section;
      renderTabs();
      renderChecklist();
    });
  });
}

function renderChecklist() {
  const query = normalize(els.search.value);
  const sections = checklist.filter((section) => {
    const inActiveSection = activeSection === "Todas" || activeSection === section.title;
    const inSearch =
      !query ||
      normalize(section.title).includes(query) ||
      section.items.some((item) => normalize(item).includes(query));
    return inActiveSection && inSearch;
  });

  els.checklist.innerHTML = sections.map(renderSection).join("");

  els.checklist.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.key;
      const value = button.dataset.status;
      state.items[key] = state.items[key] === value ? "" : value;
      persist();
      renderChecklist();
      updateSummary();
    });
  });

  els.checklist.querySelectorAll("[data-note]").forEach((input) => {
    input.addEventListener("input", () => {
      state.notes[input.dataset.note] = input.value;
      persist();
      updateSummary();
    });
  });

  els.checklist.querySelectorAll(".kratos-btn").forEach((button) => {
    button.addEventListener("click", () => onKratosToggle(button));
  });
}

function renderSection(section, sectionIndex) {
  const realSectionIndex = checklist.findIndex((entry) => entry.title === section.title);
  const done = section.items.filter((_, itemIndex) => state.items[itemKey(realSectionIndex, itemIndex)]).length;

  return `
    <details class="rounded-md border border-slate-200 bg-white shadow-sm" open>
      <summary class="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
        <span>
          <span class="block text-base font-bold text-slate-950">${escapeHtml(section.title)}</span>
          <span class="text-sm text-slate-500">${done}/${section.items.length} verificados</span>
        </span>
        <span class="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">
          ${iconSvg("section")}
          ${realSectionIndex + 1}
        </span>
      </summary>
      <div class="grid gap-3 border-t border-slate-100 p-3">
        ${section.items.map((item, itemIndex) => renderItem(item, realSectionIndex, itemIndex)).join("")}
      </div>
    </details>
  `;
}

function renderItem(item, sectionIndex, itemIndex) {
  const key = itemKey(sectionIndex, itemIndex);
  const current = state.items[key] || "";
  const note = state.notes[key] || "";

  return `
    <article class="rounded-md border border-slate-200 p-3">
      <p class="text-sm font-medium leading-relaxed text-slate-800">${escapeHtml(item)}</p>
      <div class="mt-3 grid grid-cols-3 gap-2">
        ${statusButton(key, "ok", "OK", current)}
        ${statusButton(key, "pending", "Pendente", current)}
        ${statusButton(key, "na", "N/A", current)}
      </div>
      <div class="mt-3 rounded-md border border-slate-200 bg-slate-50/90 p-2">
        <button
          type="button"
          class="kratos-btn inline-flex w-full items-start gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-800 shadow-sm"
          data-kratos-key="${key}"
        >
          ${kratosGlyph()}
          <span><span class="font-bold text-hull">KRATOS</span> — orientacao de seguranca (SOLAS / NORMAM / MARPOL / MAIB): importancia deste item na viagem costeira.</span>
        </button>
        <div
          class="kratos-panel mt-2 hidden rounded-md border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 shadow-inner"
          data-kratos-panel="${key}"
          role="region"
          aria-live="polite"
        ></div>
      </div>
      <input data-note="${key}" value="${escapeHtml(note)}" class="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sea focus:ring-2 focus:ring-sea/20" placeholder="Observacao do item" />
    </article>
  `;
}

function statusButton(key, status, label, current) {
  const className = {
    ok: "status-ok",
    pending: "status-pending",
    na: "status-na"
  }[status];

  return `
    <button class="status-btn ${className} inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 px-2 py-3 text-sm font-bold text-slate-700"
      data-key="${key}"
      data-status="${status}"
      aria-pressed="${current === status}">
      ${iconSvg(status)}
      <span>${label}</span>
    </button>
  `;
}

function iconSvg(name) {
  const icons = {
    ok: '<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pending: '<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v5M12 17h.01M10.3 4.6 2.9 18a2 2 0 0 0 1.8 3h14.6a2 2 0 0 0 1.8-3L13.7 4.6a2 2 0 0 0-3.4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    na: '<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    section: '<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  return icons[name] || "";
}

function updateSummary() {
  const keys = allKeys();
  const ok = keys.filter((key) => state.items[key] === "ok").length;
  const pending = keys.filter((key) => state.items[key] === "pending").length;
  const checked = keys.filter((key) => state.items[key]).length;
  const percent = Math.round((checked / keys.length) * 100);

  els.percent.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
  els.progressBar.parentElement.setAttribute("aria-valuenow", String(percent));
  els.progressBarSticky.style.width = `${percent}%`;
  els.progressBarSticky.parentElement.setAttribute("aria-valuenow", String(percent));
  els.ok.textContent = ok;
  els.pending.textContent = pending;
  els.total.textContent = keys.length;
}

function buildMessage() {
  const keys = allKeys();
  const checked = keys.filter((key) => state.items[key]).length;
  const ok = keys.filter((key) => state.items[key] === "ok").length;
  const pending = keys.filter((key) => state.items[key] === "pending").length;
  const na = keys.filter((key) => state.items[key] === "na").length;
  const lines = [
    "*Checklist Rebocador Antes da Viagem - VGM*",
    `Origem: ${state.meta.origin || "Nao informado"}`,
    `Destino: ${state.meta.destination || "Nao informado"}`,
    `Rebocador: ${state.meta.vessel || "Nao informado"}`,
    `Responsavel: ${state.meta.responsible || "Nao informado"}`,
    `Data/Hora: ${state.meta.date || "--"} ${state.meta.time || "--"}`,
    `Resumo: ${checked}/${keys.length} verificados | OK: ${ok} | Pendentes: ${pending} | N/A: ${na}`,
    `Assinatura digital: ${state.meta.signature ? "Registrada" : "Nao registrada"}`
  ];

  const pendingLines = collectStatusLines("pending");
  if (pendingLines.length) {
    lines.push("", "*Pendencias:*", ...pendingLines);
  }

  const noteLines = Object.entries(state.notes)
    .filter(([, note]) => note.trim())
    .map(([key, note]) => `- ${itemLabelFromKey(key)}: ${note.trim()}`);
  if (noteLines.length) {
    lines.push("", "*Observacoes por item:*", ...noteLines);
  }

  if (state.meta.notes?.trim()) {
    lines.push("", "*Observacoes gerais:*", state.meta.notes.trim());
  }

  lines.push("", "Checklist gerado para envio online.");
  return lines.join("\n");
}

function collectStatusLines(status) {
  return allKeys()
    .filter((key) => state.items[key] === status)
    .map((key) => `- ${itemLabelFromKey(key)}`);
}

function itemLabelFromKey(key) {
  const [sectionIndex, itemIndex] = key.split("-").map(Number);
  return `${checklist[sectionIndex].title}: ${checklist[sectionIndex].items[itemIndex]}`;
}

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(buildMessage());
    showToast("Mensagem copiada");
  } catch {
    showToast("Nao foi possivel copiar");
  }
}

function kratosGlyph() {
  return `<svg class="mt-0.5 h-4 w-4 shrink-0 text-sea" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
  </svg>`;
}

function onKratosToggle(button) {
  const key = button.dataset.kratosKey;
  const panel = button.nextElementSibling;
  if (!panel || !panel.classList.contains("kratos-panel")) return;

  const isOpen = !panel.classList.contains("hidden");
  if (isOpen) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");
  if (state.kratos[key]) {
    panel.textContent = state.kratos[key];
    panel.classList.remove("italic", "text-slate-500");
    return;
  }

  panel.textContent = "Consultando KRATOS...";
  panel.classList.add("italic", "text-slate-500");
  fetchKratosGuidance(key, panel);
}

async function fetchKratosGuidance(key, panel) {
  const [si, ii] = key.split("-").map(Number);
  const sectionTitle = checklist[si]?.title || "";
  const itemText = checklist[si]?.items[ii] || "";
  const status = state.items[key] || "";

  try {
    const res = await fetch(KRATOS_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionTitle, itemText, status })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Nao foi possivel obter a orientacao.");
    }
    state.kratos[key] = data.guidance;
    persist();
    panel.textContent = data.guidance;
    panel.classList.remove("italic", "text-slate-500");
  } catch (err) {
    panel.textContent = err.message || "Falha na consulta ao KRATOS.";
    panel.classList.remove("italic", "text-slate-500");
  }
}

function buildWhatsAppCaptionShort() {
  const vessel = state.meta.vessel || "Rebocador";
  const orig = state.meta.origin || "?";
  const dest = state.meta.destination || "?";
  const when = `${state.meta.date || ""} ${state.meta.time || ""}`.trim();
  return `Checklist pre-viagem (PDF anexo): ${vessel} | ${orig} -> ${dest}${when ? ` | ${when}` : ""}`;
}

function statusLabelForPdf(key) {
  const v = state.items[key];
  if (v === "ok") return "OK";
  if (v === "pending") return "PEND";
  if (v === "na") return "N/A";
  return "--";
}

function loadImageNaturalSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("Assinatura invalida"));
    img.src = dataUrl;
  });
}

async function buildChecklistPdfBlob() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    throw new Error("Biblioteca PDF indisponivel.");
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeBlock = (text, fontSize = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(String(text), pageW - margin * 2);
    const lineHeight = fontSize * 1.28;
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 6;
  };

  writeBlock("Checklist Rebocador Antes da Viagem - VGM", 14, true);
  writeBlock(
    [
      `Origem: ${state.meta.origin || "Nao informado"}`,
      `Destino: ${state.meta.destination || "Nao informado"}`,
      `Rebocador: ${state.meta.vessel || "Nao informado"}`,
      `Responsavel: ${state.meta.responsible || "Nao informado"}`,
      `Data e hora: ${state.meta.date || "--"} ${state.meta.time || "--"}`
    ].join("\n"),
    10
  );

  const keys = allKeys();
  const checked = keys.filter((k) => state.items[k]).length;
  const ok = keys.filter((k) => state.items[k] === "ok").length;
  const pending = keys.filter((k) => state.items[k] === "pending").length;
  const na = keys.filter((k) => state.items[k] === "na").length;
  writeBlock(`Resumo: ${checked}/${keys.length} verificados | OK: ${ok} | Pendentes: ${pending} | N/A: ${na}`, 10, true);

  checklist.forEach((section, si) => {
    writeBlock(section.title, 11, true);
    section.items.forEach((item, ii) => {
      const k = itemKey(si, ii);
      const st = statusLabelForPdf(k);
      writeBlock(`- (${st}) ${item}`, 9);
      const note = (state.notes[k] || "").trim();
      if (note) {
        writeBlock(`  Obs.: ${note}`, 8);
      }
    });
  });

  if (state.meta.notes?.trim()) {
    writeBlock("Observacoes gerais:", 11, true);
    writeBlock(state.meta.notes.trim(), 9);
  }

  writeBlock("Assinatura digital do responsavel:", 11, true);
  const sig = state.meta.signature;
  if (sig) {
    const dims = await loadImageNaturalSize(sig);
    const maxW = pageW - margin * 2;
    const maxH = 150;
    const scale = Math.min(maxW / dims.w, maxH / dims.h, 1);
    const drawW = dims.w * scale;
    const drawH = dims.h * scale;
    ensureSpace(drawH + 20);
    doc.addImage(sig, "PNG", margin, y, drawW, drawH);
    y += drawH + 18;
  } else {
    writeBlock("(Sem assinatura registrada.)", 9);
  }

  writeBlock("Documento gerado eletronicamente para registro do checklist pre-viagem.", 8);

  return doc.output("blob");
}

async function shareWhatsAppPdf(event) {
  event?.preventDefault();
  if (!state.meta.signature) {
    showToast("Assine o checklist digitalmente antes de enviar o PDF pelo WhatsApp.", 4200);
    return;
  }
  if (!window.jspdf?.jsPDF) {
    showToast("Gerador de PDF indisponivel. Recarregue a pagina.", 3200);
    return;
  }

  try {
    const blob = await buildChecklistPdfBlob();
    const safeDate = (state.meta.date || "sem-data").replace(/[^\d-]/g, "") || "sem-data";
    const name = `checklist-rebocador-${safeDate}.pdf`;
    const file = new File([blob], name, { type: "application/pdf" });
    const caption = buildWhatsAppCaptionShort();

    if (typeof navigator.share === "function") {
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "Checklist rebocador", text: caption });
          showToast("PDF compartilhado.", 2400);
          return;
        }
      } catch (shareErr) {
        if (shareErr?.name === "AbortError") return;
        console.warn(shareErr);
      }
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);

    const text = `${caption}\n\nInstrucoes: anexe o arquivo PDF que acabou de ser baixado a esta conversa.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    showToast("PDF baixado. Anexe o arquivo na conversa do WhatsApp.", 4500);
  } catch (err) {
    console.error(err);
    showToast(err?.message || "Nao foi possivel gerar o PDF.", 3600);
  }
}

function clearChecklist() {
  const confirmed = window.confirm("Limpar checklist salvo neste aparelho?");
  if (!confirmed) return;

  state.items = {};
  state.notes = {};
  state.kratos = {};
  state.meta.notes = "";
  state.meta.signature = "";
  els.notes.value = "";
  persist();
  renderChecklist();
  updateSignaturePreview();
  updateSummary();
  showToast("Checklist limpo");
}

function toggleAllSections() {
  const details = [...els.checklist.querySelectorAll("details")];
  const shouldOpen = details.some((detail) => !detail.open);
  details.forEach((detail) => {
    detail.open = shouldOpen;
  });
  els.expandAll.querySelector("span").textContent = shouldOpen ? "Fechar" : "Abrir";
}

function showToast(message, durationMs = 1800) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => els.toast.classList.add("hidden"), durationMs);
}

function toggleBackToTop() {
  els.backToTop.classList.toggle("hidden", window.scrollY < 420);
}

function persist() {
  state.kratosVersion = KRATOS_PROMPT_VERSION;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      const kratosStale = saved.kratosVersion !== KRATOS_PROMPT_VERSION;
      return {
        meta: saved.meta || {},
        items: saved.items || {},
        notes: saved.notes || {},
        kratos: kratosStale ? {} : saved.kratos || {}
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { meta: {}, items: {}, notes: {}, kratos: {} };
}

function applyTheme() {
  const isDark = state.meta.theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  document.querySelector(".theme-sun")?.classList.toggle("hidden", isDark);
  document.querySelector(".theme-moon")?.classList.toggle("hidden", !isDark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0b1720" : "#0f766e");
}

function toggleTheme() {
  state.meta.theme = state.meta.theme === "dark" ? "light" : "dark";
  persist();
  applyTheme();
}

function updateSignaturePreview() {
  if (!state.meta.signature) {
    els.signatureStatus.textContent = "Nenhuma assinatura registrada.";
    els.signaturePreview.classList.add("hidden");
    els.signaturePreview.removeAttribute("src");
    return;
  }

  els.signatureStatus.textContent = "Assinatura registrada e salva neste aparelho.";
  els.signaturePreview.src = state.meta.signature;
  els.signaturePreview.classList.remove("hidden");
}

function openSignatureModal() {
  els.signatureModal.showModal();
  window.setTimeout(() => {
    resizeSignatureCanvas();
    if (state.meta.signature) {
      const image = new Image();
      image.onload = () => {
        const rect = els.signaturePad.getBoundingClientRect();
        signatureContext().drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = state.meta.signature;
    }
  }, 50);
}

function initSignaturePad() {
  if (!els.signaturePad) return;

  let drawing = false;
  let last = null;

  const start = (event) => {
    drawing = true;
    last = pointerPosition(event);
  };

  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const point = pointerPosition(event);
    const ctx = signatureContext();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last = point;
  };

  const stop = () => {
    drawing = false;
    last = null;
  };

  els.signaturePad.addEventListener("pointerdown", start);
  els.signaturePad.addEventListener("pointermove", move);
  els.signaturePad.addEventListener("pointerup", stop);
  els.signaturePad.addEventListener("pointerleave", stop);
  window.addEventListener("resize", () => {
    if (els.signatureModal.open) resizeSignatureCanvas();
  });
}

function resizeSignatureCanvas() {
  const canvas = els.signaturePad;
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = signatureContext();
  ctx.scale(ratio, ratio);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function signatureContext() {
  return els.signaturePad.getContext("2d");
}

function pointerPosition(event) {
  const rect = els.signaturePad.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function clearSignaturePad() {
  const canvas = els.signaturePad;
  const rect = canvas.getBoundingClientRect();
  const ctx = signatureContext();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function saveSignature() {
  const dataUrl = els.signaturePad.toDataURL("image/png");
  state.meta.signature = isSignatureCanvasBlank() ? "" : dataUrl;
  persist();
  updateSignaturePreview();
  updateSummary();
  els.signatureModal.close();
  showToast(state.meta.signature ? "Assinatura salva" : "Assinatura vazia");
}

function isSignatureCanvasBlank() {
  const canvas = els.signaturePad;
  const ctx = canvas.getContext("2d");
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    if (a > 0 && (r < 245 || g < 245 || b < 245)) return false;
  }
  return true;
}

function allKeys() {
  return checklist.flatMap((section, sectionIndex) => section.items.map((_, itemIndex) => itemKey(sectionIndex, itemIndex)));
}

function itemKey(sectionIndex, itemIndex) {
  return `${sectionIndex}-${itemIndex}`;
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initWaveCanvas() {
  const holder = document.querySelector("#wave-canvas");
  if (!holder || !window.PIXI) return;

  const app = new PIXI.Application();
  app.init({ resizeTo: holder, backgroundAlpha: 0, antialias: true }).then(() => {
    holder.appendChild(app.canvas);
    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);

    app.ticker.add((ticker) => {
      const width = app.renderer.width;
      const height = app.renderer.height;
      const time = ticker.lastTime / 800;

      graphics.clear();
      graphics.rect(0, 0, width, height).fill(0x12313f);

      for (let layer = 0; layer < 3; layer += 1) {
        const yBase = height * (0.5 + layer * 0.16);
        const amplitude = 10 + layer * 7;
        const color = [0x0f766e, 0x14b8a6, 0x5eead4][layer];
        graphics.moveTo(0, height);
        graphics.lineTo(0, yBase);
        for (let x = 0; x <= width + 8; x += 8) {
          const y = yBase + Math.sin(x / (42 + layer * 15) + time + layer) * amplitude;
          graphics.lineTo(x, y);
        }
        graphics.lineTo(width, height);
        graphics.lineTo(0, height);
        graphics.fill({ color, alpha: 0.22 + layer * 0.08 });
      }
    });
  });
}
