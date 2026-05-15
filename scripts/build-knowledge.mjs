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

  const index = {
    version: 1,
    builtAt: new Date().toISOString(),
    manifest,
    chunks: allChunks
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(index));
  const mb = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2);
  console.log(`\nIndice gerado: ${OUT_FILE} (${mb} MB, ${allChunks.length} trechos)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
