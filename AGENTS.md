# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Vite app, UI, and client logic. Static typing content lives in `frontend/static/`.
- `backend/`: Express/Node backend, APIs, migrations in `backend/__migration__/`, and infra scripts.
- `packages/`: Shared workspaces (contracts, schemas, util, release tooling).
- `docs/`: Contribution and operational documentation.
- Tests are colocated under `__tests__/` in each workspace.

## Build, Test, and Development Commands
- `pnpm i`: install all workspace dependencies (pnpm is required).
- `pnpm dev`: run frontend + backend dev servers via Turborepo.
- `pnpm dev-fe` / `pnpm dev-be`: run only frontend or backend.
- `pnpm build`: build all workspaces.
- `pnpm test`: run Vitest unit + integration tests across workspaces.
- `pnpm lint`: run lint checks across all packages.
- `pnpm format-check` / `pnpm format-fix`: verify or apply formatting via `oxfmt`.

## Coding Style & Naming Conventions
- Indentation is 2 spaces for `*.{html,js,css,scss,json,yml,yaml}` per `.editorconfig`.
- Use the existing file naming patterns and workspace scopes (e.g., `@monkeytype/*` packages).
- Prefer repository tooling for style: `oxfmt` for formatting, `oxlint`/`eslint` for linting.

## Testing Guidelines
- Tests use Vitest; config is centralized in `vitest.config.ts`.
- Place tests in `__tests__/` and prefer `*.spec.ts` naming (see `frontend/__tests__/`).
- Use `pnpm test` for full coverage and `pnpm test-fe` / `pnpm test-be` for focused runs.

## Commit & Pull Request Guidelines
- Commit messages and PR titles follow Conventional Commits with lowercase types:
  `feat`, `impr`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- PR titles should include the author in parentheses, e.g. `fix(ui): caret overlap (@username)`.
- Keep subject lines under 100 characters; avoid trailing periods.
- Include a clear description, link related issues, and add screenshots for UI changes.

## Configuration & Local Setup Notes
- Backend env vars start from `backend/example.env` → `backend/.env`.
- Firebase config for the frontend lives in `frontend/src/ts/constants/firebase-config.ts`.

## Vimtype-Specific Guidelines
- The Vim engine is intentionally scoped to “Level 2”: Normal/Insert/Visual (char/line) with real Vim keys.
- Scoring must match Monkeytype: only character insertions count as typed characters.
- Avoid features that insert multiple characters per key (macros, register paste) to preserve scoring integrity.
- Algorithm prompts must be original, public-domain solutions; no external IP or pseudocode.

## Project Plan
- The source of truth is `vimtype_project_plan.md`; keep changes aligned with its milestones and constraints.
- Milestones progress from “fork boots unchanged” through algorithms content, Vim modes, scoring parity, and production hardening.
