# Seoscout — SEO content pipeline for this wiki

This wiki is wired to the open-source CLI **[libin257/seoscout](https://github.com/libin257/seoscout)**  
(keywords → YouTube/Google search → collect → LLM MDX generate → translate).

Cursor Cloud Agents install it automatically via `.cursor/environment.json` → `scripts/install-cloud-deps.sh`.

## New game wiki repos

When you create a **new GitHub repo** for another game wiki from this template:

1. Keep `.cursor/environment.json` and `scripts/setup-seoscout.sh` / `install-cloud-deps.sh`.
2. Edit `seoscout/keywords.json` — set `topic_name`, categories, keywords, and `languages`.
3. Add API keys as [Cursor Cloud secrets](https://cursor.com/dashboard/cloud-agents) and/or fill `seoscout/.env` (from `.env.example`).
4. Link the repo to a Cursor Cloud Agent — on first boot, seoscout is installed with no extra steps.

## Prerequisites

| Key | Required | Get it |
|-----|:--------:|--------|
| `SERPER_API_KEY` | yes | [serper.dev](https://serper.dev/) |
| `JINA_API_KEY` | recommended | [jina.ai](https://jina.ai/) |
| `LLM_API_KEY` | for generate/translate | any OpenAI-compatible API |

## Manual / local setup

```bash
bash scripts/setup-seoscout.sh
# or
bun run seoscout:setup

cp seoscout/.env.example seoscout/.env   # if not already created
# edit seoscout/.env — add keys
```

## Pipeline

All seoscout commands run with cwd `seoscout/` so `.env` and `OUTPUT_DIR=./output` resolve correctly.

```bash
bun run seoscout:search      # YouTube + Google
bun run seoscout:collect     # transcripts + Jina pages
bun run seoscout:generate    # English MDX → output/<project>/articles/en/ (uses prompts/generate.md)
bun run seoscout:translate   # es, pt, id (from keywords.json)
bun run seoscout:run         # search + collect + generate (+ translate if languages set)
bun run seoscout:sync        # copy articles → content/
```

Or one-liners from `seoscout/`:

```bash
cd seoscout
export PATH="$HOME/.local/bin:$PATH"
seoscout search --keywords keywords.json
seoscout collect --keywords keywords.json
seoscout generate --keywords keywords.json
seoscout translate --keywords keywords.json   # uses languages in JSON
```

Review `output/<project>/out/search_results.json` after search and set `"selected": false` on junk before collect.

## Output layout

```
seoscout/output/finish_the_word/
  out/search_results.json
  out/collected/...
  articles/en/<category>/*.mdx
  articles/es|pt|id/<category>/*.mdx
```

`bun run seoscout:sync` copies `articles/**` into `content/`.

## Upstream

- Repo: https://github.com/libin257/seoscout  
- Installed under `~/.local/share/seoscout` (editable pip install) — not vendored into this wiki.
