# remio-home

Personal homepage built with Next.js 14 (App Router), TailwindCSS, NextUI.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (`output: "standalone"` for Docker) |
| `pnpm start` | Start production server |
| `pnpm lint` | `next lint` |
| `pnpm lint-staged` | Runs `eslint --fix` on staged `*.{js,jsx,ts,tsx}` |

## Structure

```
src/
  app/           - Next.js App Router (pages + API routes)
    api/
      config/    - GET/POST config (auth required)
      verify/    - POST password auth, sets accessToken cookie
      file/      - GET config as downloadable JSON (auth required)
      manifest/  - Dynamic PWA manifest
      weather/   - Proxy to AMap weather API
    config/      - Online config editor page (password-protected)
  components/    - UI components
  config/        - Default config.json + TypeScript types
  constants/     - API endpoint constants
  lib/           - Core logic: config.ts, db.ts (pg), service.ts, fetch.ts, motion.ts, rules.ts, utils.ts
  providers/     - ThemeProvider + NextUIProvider
  styles/        - CSS files
  middleware.ts  - Protects /config route with cookie-based auth
```

## Config

Config source is auto-detected: if `PG_DATABASE_URL` env is set → PostgreSQL, else file-based.

- File config path: `$CONFIG_DIR/config.json` (default: `src/config/` or `/remio-home/config/` in Docker)
- Config page: `/config` (password-protected via `PASSWORD` env var)
- API: `GET /api/config`, `POST /api/config`
- Auth uses AES encryption (`CryptoJS`) for cookie-based `accessToken` (14-day expiry)

## Environmental Variables

| Variable | Purpose |
|---|---|
| `PASSWORD` | Config editor password (required) |
| `GTMID` | Google Tag Manager |
| `GTAGID` | Google Analytics |
| `BAIDUID` | Baidu Analytics |
| `BaiduSiteVerify` | Baidu site verification |
| `AMAP_KEY` | AMap (高德地图) API key for weather |
| `PG_DATABASE_URL` | PostgreSQL connection for config storage |
| `CONFIG_DIR` | Override config file directory |
| `IS_DOCKER` | Set to `1` in Docker |
| `VERSION` | Build version |

## Build & Docker

- `next.config.mjs`: `output: "standalone"`, eslint ignored during build, PWA via `next-pwa` (disabled in dev)
- Docker: `node:22-alpine` base, multi-stage build, user `nextjs:nodejs`
- Volumes: `/remio-home/config`, `/remio-home/public/icons`, `/remio-home/public/fonts`
- CI: GitHub Actions builds multi-arch Docker images on version tags (`v*`), pushes to Docker Hub + Ali registry

## Conventions

- **Path alias**: `@/*` → `./src/*`
- **Husky**: `pre-commit` runs `pnpm lint-staged`; `commit-msg` runs `pnpm commitlint --edit`
- **Commitlint**: conventional commits with custom types (`init`, `ci`, `wip`, `feat`, `fix`, ...)
- **Prettier**: `@kasuie/prettier` factory, singleQuote: false, tailwindcss sorting enabled
- **Dark mode**: CSS class + `[data-theme="dark"]` attribute via `next-themes`
- **CSS**: TailwindCSS with `mio-` prefixed custom keyframes/colors (`mio-main`, `mio-bg`, etc.)
- **No tests** are configured in this project
- PWA auto-generated files (`sw.*`, `workbox-*`) are gitignored
