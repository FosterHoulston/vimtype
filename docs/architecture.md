# Vimtype Architecture

## Goals
- Preserve Monkeytype’s existing stack and production strategy.
- Add only the minimum new surfaces required for Algorithms (Vim Mode).

## Keep unchanged
- Monorepo tooling (pnpm + turbo)
- Frontend app and backend services layout
- Self-hosting/Docker path
- Accounts/auth approach (if enabled)
- Revenue and telemetry strategy (per Monkeytype)

## New modules
1. **Vim engine (frontend, pure TypeScript)**
   - Owns buffer, cursor, mode, selection, and key parsing.
2. **Algorithms dataset + loader (frontend static data)**
   - Public-domain solutions stored under `frontend/static/`.
3. **New test mode wiring**
   - Hooks into existing test pipeline and results storage.

## Data flow (high level)
1. Algorithm prompt loads from static dataset.
2. Vim engine renders buffer and processes key input.
3. Inserted characters are validated against target text and routed into existing stats tracking.
4. Results are submitted through the existing backend pipeline (with new mode validation if needed).

## Constraints
- Only character insertions count as typed characters.
- No multi-character inserts per keypress (no paste/macros/registers).
