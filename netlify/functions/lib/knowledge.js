const fs = require("fs");
const path = require("path");

let cachedIndex = null;

function loadIndex() {
  if (cachedIndex) return cachedIndex;
  const indexPath = path.join(__dirname, "..", "data", "knowledge-index.json");
  if (!fs.existsSync(indexPath)) {
    cachedIndex = { chunks: [], manifest: [] };
    return cachedIndex;
  }
  const raw = fs.readFileSync(indexPath, "utf8");
  cachedIndex = JSON.parse(raw);
  return cachedIndex;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

const STOP = new Set([
  "para",
  "com",
  "sem",
  "dos",
  "das",
  "que",
  "uma",
  "por",
  "nao",
  "ser",
  "est",
  "sao",
  "deve",
  "item",
  "checklist"
]);

/**
 * Recupera trechos dos PDFs base (SOLAS, MARPOL, NORMAM) por relevancia lexical.
 */
function retrieveKnowledge(query, { limit = 4, maxChars = 3200 } = {}) {
  const index = loadIndex();
  if (!index.chunks?.length) return { excerpts: [], manifest: index.manifest || [] };

  const tokens = [...new Set(tokenize(query))].filter((t) => !STOP.has(t));
  if (!tokens.length) return { excerpts: [], manifest: index.manifest || [] };

  const scored = index.chunks
    .map((chunk) => {
      let score = 0;
      const norm = chunk.norm || "";
      for (const t of tokens) {
        if (norm.includes(t)) score += t.length > 5 ? 3 : 1;
      }
      return { chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const excerpts = [];
  let total = 0;

  for (const { chunk } of scored) {
    if (excerpts.length >= limit) break;
    const line = `[${chunk.source}] ${chunk.text}`;
    if (total + line.length > maxChars) break;
    excerpts.push(line);
    total += line.length;
  }

  return { excerpts, manifest: index.manifest || [] };
}

module.exports = { loadIndex, retrieveKnowledge };
