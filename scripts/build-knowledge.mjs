/**
 * Extrai texto dos PDFs em docs/ e gera indice para o KRATOS.
 * Execute: npm install && npm run build:knowledge
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const OUT_DIR = path.join(ROOT, "netlify", "functions", "data");
const OUT_FILE = path.join(OUT_DIR, "knowledge-index.json");
const CONTEXT_FILE = path.join(OUT_DIR, "kratos-context.json");
const PDF_IDS = new Set(["solas", "marpol-i", "normam-201"]);

const SOURCES = [
  {
    id: "solas",
    file: "SOLAS - Convenção Internacional para Salvaguarda da Vida Humana no Mar.pdf",
    label: "SOLAS"
  },
  { id: "marpol-i", file: "anexo_i_marpol.pdf", label: "MARPOL Anexo I" },
  { id: "normam-201", file: "normam-201.pdf", label: "NORMAM 201" }
];

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;
const MAX_CHUNKS_PER_DOC = 400;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text, meta) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const chunks = [];
  let start = 0;
  while (start < clean.length && chunks.length < MAX_CHUNKS_PER_DOC) {
    let end = Math.min(start + CHUNK_SIZE, clean.length);
    if (end < clean.length) {
      const slice = clean.slice(start, end);
      const lastSpace = slice.lastIndexOf(" ");
      if (lastSpace > CHUNK_SIZE * 0.55) end = start + lastSpace;
    }
    const piece = clean.slice(start, end).trim();
    if (piece.length > 80) {
      chunks.push({
        id: `${meta.sourceId}-${chunks.length}`,
        source: meta.label,
        sourceId: meta.sourceId,
        text: piece,
        norm: normalize(piece).slice(0, 1200)
      });
    }
    start = Math.max(end - CHUNK_OVERLAP, end);
  }
  return chunks;
}

function ingestMarkdownGlossary(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const sections = raw.split(/^## /m).filter(Boolean);
  const chunks = [];
  const baseName = path.basename(filePath);
  const sourceId = baseName.replace(/^kratos-/i, "").replace(/\.md$/i, "");
  const sourceLabel =
    sourceId === "persona" ? "Persona KRATOS" : sourceId === "glossario" ? "Glossario VGM (KRATOS)" : `KRATOS (${sourceId})`;

  for (let i = 0; i < sections.length; i += 1) {
    const block = sections[i].trim();
    if (block.length < 40) continue;
    const titleEnd = block.indexOf("\n");
    const title = titleEnd > 0 ? block.slice(0, titleEnd).trim() : `secao-${i}`;
    const body = block.slice(titleEnd + 1).replace(/\s+/g, " ").trim();
    if (body.length < 30) continue;
    const text = `${title}: ${body}`.slice(0, 2400);
    chunks.push({
      id: `${sourceId}-${i}`,
      source: sourceLabel,
      sourceId,
      text,
      norm: normalize(text).slice(0, 1200)
    });
  }

  return { file: baseName, chunks };
}

/** Base JSON de equipamentos/riscos (docs/equipamentos-riscos-kratos-*.json) — trechos para retrieveKnowledge. */
function ingestEquipamentosRiscosJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const chunks = [];
  const sourceId = "equip-riscos";
  const sourceLabel = "Equipamentos e riscos KRATOS (JSON)";

  const metaParts = [];
  if (data.purpose) metaParts.push(`Objetivo: ${data.purpose}`);
  if (Array.isArray(data.change_log) && data.change_log.length) {
    metaParts.push(`Historico: ${data.change_log.join("; ")}`);
  }
  if (data.response_format?.rules?.length) {
    metaParts.push(`Regras resposta: ${data.response_format.rules.join("; ")}`);
  }
  if (metaParts.length) {
    const text = metaParts.join(" ").slice(0, 2400);
    chunks.push({
      id: `${sourceId}-meta`,
      source: sourceLabel,
      sourceId,
      text,
      norm: normalize(text).slice(0, 1200)
    });
  }

  for (const item of data.knowledge || []) {
    const kw = Array.isArray(item.keywords) ? item.keywords.join(", ") : "";
    const risksArr = Array.isArray(item.risks) ? item.risks.join(" ") : "";
    const riskText = item.risk || risksArr;
    const parts = [
      `Secao checklist: ${item.section || item.id}`,
      item.system ? `Sistema: ${item.system}` : null,
      kw ? `Palavras-chave: ${kw}` : null,
      item.verify ? `Verificacao sugerida: ${item.verify}` : null,
      riskText ? `Riscos operacionais: ${riskText}` : null,
      item.action ? `Acao sugerida: ${item.action}` : null,
      item.normative_hint ? `Base: ${item.normative_hint}` : null,
      item.short_response
        ? `Exemplo resposta: ${String(item.short_response).replace(/\s+/g, " ").trim()}`
        : null
    ].filter(Boolean);
    const text = parts.join(". ").slice(0, 2400);
    const kid = String(item.id || item.section || "item").replace(/\s+/g, "-");
    chunks.push({
      id: `${sourceId}-${kid}`,
      source: sourceLabel,
      sourceId,
      text,
      norm: normalize(text).slice(0, 1200)
    });
  }

  return { file: path.basename(filePath), chunks };
}

async function extractPdf(filePath, meta) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const pageChunks = [];

  if (Array.isArray(data.text) || typeof data.text !== "string") {
    const full = String(data.text || "");
    pageChunks.push(...chunkText(full, meta));
  } else {
    pageChunks.push(...chunkText(data.text, meta));
  }

  return { pages: data.numpages || 0, chunks: pageChunks };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!fs.existsSync(DOCS_DIR)) {
    console.warn("Pasta docs/ nao encontrada; gerando indice vazio.");
    fs.writeFileSync(
      OUT_FILE,
      JSON.stringify({ version: 1, builtAt: new Date().toISOString(), manifest: [], chunks: [] })
    );
    return;
  }

  const allChunks = [];
  const manifest = [];

  for (const src of SOURCES) {
    const filePath = path.join(DOCS_DIR, src.file);
    if (!fs.existsSync(filePath)) {
      const alt = fs.readdirSync(DOCS_DIR).find((f) => f.toLowerCase().includes(src.id.split("-")[0]));
      if (!alt) {
        console.warn("Arquivo nao encontrado:", src.file);
        continue;
      }
      console.warn("Usando arquivo alternativo:", alt, "para", src.id);
      src._resolved = path.join(DOCS_DIR, alt);
    } else {
      src._resolved = filePath;
    }

    console.log("Processando:", src.label, "...");
    const { pages, chunks } = await extractPdf(src._resolved, {
      sourceId: src.id,
      label: src.label
    });
    allChunks.push(...chunks);
    manifest.push({ id: src.id, label: src.label, file: path.basename(src._resolved), pages, chunks: chunks.length });
    console.log(`  ${pages} paginas, ${chunks.length} trechos`);
  }

  const kratosMd = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => /^kratos-.*\.md$/i.test(f))
    .sort();

  for (const file of kratosMd) {
    const mdPath = path.join(DOCS_DIR, file);
    console.log("Processando MD KRATOS:", file, "...");
    const { chunks } = ingestMarkdownGlossary(mdPath);
    const id = file.replace(/\.md$/i, "");
    allChunks.push(...chunks);
    manifest.push({ id, label: `KRATOS (${file})`, file, pages: 0, chunks: chunks.length });
    console.log(`  ${chunks.length} trechos`);
  }

  const equipJson = path.join(DOCS_DIR, "equipamentos-riscos-kratos-v1_1.json");
  if (fs.existsSync(equipJson)) {
    console.log("Processando JSON KRATOS:", path.basename(equipJson), "...");
    const { file: equipFile, chunks: equipChunks } = ingestEquipamentosRiscosJson(equipJson);
    allChunks.push(...equipChunks);
    manifest.push({
      id: "equip-riscos",
      label: "Equipamentos e riscos (KRATOS JSON)",
      file: equipFile,
      pages: 0,
      chunks: equipChunks.length
    });
    console.log(`  ${equipChunks.length} trechos`);
  }

  const index = {
    version: 2,
    builtAt: new Date().toISOString(),
    manifest,
    chunks: allChunks
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(index));

  const contextChunks = allChunks.filter((c) => !PDF_IDS.has(c.sourceId));
  const contextIndex = {
    version: 2,
    builtAt: new Date().toISOString(),
    manifest: manifest.filter((m) => !PDF_IDS.has(m.id)),
    chunks: contextChunks
  };
  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(contextIndex));

  const mb = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2);
  const ctxKb = (fs.statSync(CONTEXT_FILE).size / 1024).toFixed(0);
  console.log(`\nIndice completo: ${OUT_FILE} (${mb} MB, ${allChunks.length} trechos)`);
  console.log(`Indice leve KRATOS: ${CONTEXT_FILE} (${ctxKb} KB, ${contextChunks.length} trechos)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
