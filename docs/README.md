# Base de conhecimento KRATOS

PDFs de referencia para o assistente:

| Arquivo | Norma |
| --- | --- |
| `SOLAS - Convenção Internacional...pdf` | SOLAS |
| `normam-201.pdf` | NORMAM 201 (Marinha do Brasil) |
| `anexo_i_marpol.pdf` | MARPOL Anexo I |
| `kratos-glossario.md` | Glossário operacional (cargas, materiais, nomenclatura) |
| `kratos-persona.md` | Persona do KRATOS — chefe de máquinas de viagem |

## Gerar indice

Na raiz do projeto:

```bash
npm install
npm run build:knowledge
```

Isso cria `netlify/functions/data/knowledge-index.json`, usado pela funcao `kratos` em cada consulta.

Na Netlify, o comando de build (`npm ci && npm run build:knowledge`) roda isso automaticamente se os PDFs estiverem nesta pasta no repositorio.
