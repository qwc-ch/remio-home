# remio-home

Personal homepage built with React 19 + Vite 8 + TailwindCSS + TypeScript.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server (port 5173) |
| `pnpm build` | Typecheck (`tsc --noEmit`) + production build to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm lint` | `eslint .` (flat config) |

## Structure

```
src/
  App.tsx        - Entry component (assembles config + renders layout/effects)
  main.tsx       - React root entry
  components/    - UI components
  config/        - Split TypeScript config files (see below)
  lib/           - Core logic: config.ts (transform), motion.ts, theme.ts
  providers/     - AppProviders + ConfigContext
  styles/        - CSS files
```

## Config

纯前端静态配置，无后台。配置按模块拆分为多个 TS 文件，由 `src/config/index.ts` 合并为 `AppConfig`：

| File | Contents |
|---|---|
| `site.ts` | name / favicon / keywords / description / domain |
| `profile.ts` | avatarConfig / subTitle / subTitleConfig |
| `appearance.ts` | globalStyle / bgConfig / layoutConfig |
| `social.ts` | links / socialConfig |
| `sites.ts` | sites / sitesConfig |
| `skills.ts` | sliders (技能加点) |
| `music.ts` | music (播放器) |
| `footer.ts` | footer / resources |

修改配置后重新 `pnpm build` 或直接 `pnpm dev` 即可生效。

## Environmental Variables

Vite 变量需以 `VITE_` 前缀，放入 `.env.local`：

| Variable | Purpose |
|---|---|
| `VITE_GTMID` | Google Tag Manager |
| `VITE_GTAGID` | Google Analytics |
| `VITE_BAIDUID` | Baidu Analytics |
| `VITE_BAIDU_SITE_VERIFY` | Baidu site verification |
| `VITE_VERSION` | Build version (console logo) |

## 无后端说明

- 天气直接调用公开 API（uapis.cn）
- 音乐播放器直接请求 meting API；若目标 API 存在 CORS 限制，
  可在 `src/config/music.ts` 的 `music.meting.proxy` 配置公共 CORS 代理模板
  （`:url` 为占位符，如 `https://corsproxy.io/?url=:url`）

## Build & Docker

- `vite.config.ts`: `@/*` alias → `./src/*`
- Docker: node:22-alpine 构建静态产物 → nginx:alpine 托管
- 可选挂载 `/opt/icons` 到容器内自定义站点图标
- CI: GitHub Actions builds multi-arch Docker images on version tags (`v*`)

## Conventions

- **Path alias**: `@/*` → `./src/*`
- **Husky**: `pre-commit` runs `pnpm lint-staged`; `commit-msg` runs `pnpm commitlint --edit`
- **Commitlint**: conventional commits with custom types (`init`, `ci`, `wip`, `feat`, `fix`, ...)
- **Prettier**: `@kasuie/prettier` factory, singleQuote: false, tailwindcss sorting enabled
- **Dark mode**: CSS class + `[data-theme="dark"]` attribute, handled by `src/lib/theme.ts`
- **CSS**: TailwindCSS with `mio-` prefixed custom keyframes/colors (`mio-main`, `mio-bg`, etc.)
- **No tests** are configured in this project
