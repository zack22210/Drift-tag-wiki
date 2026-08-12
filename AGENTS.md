# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single self-contained **Next.js 15 (App Router) static content wiki** for the Roblox game "Universal Tower Defense Z". There is **no backend, database, or external service** — the one service to run is the Next.js app. Content lives as MDX under `content/en/`; other locales (es, id, pt) are generated/translated. i18n uses `next-intl` (default locale `en` served at root, other locales under `/es`, `/id`, `/pt`).

- **Package manager: Bun.** `bun.lock` is the source of truth and the `lint`/`format` scripts call `bunx`. The update script installs Bun (to `~/.bun/bin`) if missing and runs `bun install`. `npm install --legacy-peer-deps` also works (used by the `Dockerfile`) but prefer Bun for consistency with the lockfile.
- **Run/dev/build/lint** commands are defined in `package.json` `scripts` — use those (`bun run dev`, `bun run build`, `bun run lint`). `bun run lint` runs `tsc --noEmit && next lint`.
- **Dev server** listens on `0.0.0.0:3000` (`next dev -H 0.0.0.0`). Open `http://localhost:3000`.
- All `NEXT_PUBLIC_*` env vars (analytics, AdSense, `NEXT_PUBLIC_SITE_URL`) are **optional**; the app runs fine without any of them. `NEXT_PUBLIC_SITE_URL` falls back to a hardcoded production URL for sitemap/metadata.
- The production build prints benign warnings: `themeColor ... in metadata export` and a `next-intl` webpack `import(t)` cache warning. These are not errors and the build completes successfully (~98 static pages).
- `bun install` may rewrite `bun.lock`; if you didn't intend to change dependencies, `git checkout -- bun.lock` to keep the tree clean.
- **Seoscout** ([libin257/seoscout](https://github.com/libin257/seoscout)) is installed automatically for Cursor Cloud Agents via `.cursor/environment.json` → `scripts/install-cloud-deps.sh`. Config lives in `seoscout/` (`.env`, `keywords.json`). Pipeline: `bun run seoscout:search|collect|generate|translate|run`, then `bun run seoscout:sync` to copy MDX into `content/`. See `seoscout/README.md`.
- **New game wiki repos:** keep `.cursor/environment.json` + `scripts/*seoscout*` when templating a new GitHub repo, update `seoscout/keywords.json` for the new game, and set `SERPER_API_KEY` / `JINA_API_KEY` / `LLM_API_KEY` as Cursor secrets or in `seoscout/.env`. Linking the repo to a Cloud Agent will re-install seoscout on boot.
