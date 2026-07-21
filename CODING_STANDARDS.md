# Coding Standards

These standards exist to keep the codebase consistent and easy to refactor, in
line with the project's Extreme Programming elements: small commits, continuous
refactoring, simple design (YAGNI), and automated tests. Every card in
[KANBAN.md](./KANBAN.md) must follow this document before reaching **Done**.

Prefer **automated enforcement** over discipline: formatters and linters run so
these rules don't have to be remembered. When a tool and this document disagree,
fix the tool config so they agree.

## 1. Guiding Principles

- **YAGNI.** Don't build for requirements that don't exist yet. Delete dead code
  rather than commenting it out — git is the history.
- **Refactor continuously.** Leave each file a little cleaner than you found it.
- **Clarity over cleverness.** Optimize for the next reader (usually future you).
- **Small, single-purpose changes.** One concern per commit, one concern per
  function.

## 2. Formatting (all languages)

- **Indentation: 2 spaces. Never tabs.** This applies to every language and
  config file in the repo, including JSON, YAML, and SQL.
- **Line length: 100 columns** as a soft target; let the formatter wrap.
- **One statement per line.** End files with a single trailing newline.
- **No trailing whitespace.**

These are enforced by `.editorconfig` at the repo root:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

## 3. TypeScript / React (frontend)

- **Formatter:** Prettier (the source of truth for formatting).
- **Linter:** ESLint with `@typescript-eslint`. Lint must pass clean before
  a card leaves Testing & Validation.
- **`strict` mode on** in `tsconfig.json`. No implicit `any`; prefer `unknown`
  and narrow.
- **No `any`** unless interfacing with an untyped library, and then localize and
  comment it.
- **Components:** function components with hooks only — no class components.
- **Identifier naming:**
  - `camelCase` — variables, functions, and hooks (`useGameTimer`).
  - `PascalCase` — components, types, interfaces, enums.
  - `UPPER_SNAKE_CASE` — module-level constants.
- **Filenames: `kebab-case`**, matching React Router's default idiom —
  `game-lobby.tsx` exports `GameLobby`; `use-game-timer.ts` exports
  `useGameTimer`. A filename is the kebab-case form of its primary export; the
  exported identifier keeps its own casing. This applies to route modules,
  components, hooks, and helpers alike.
- **Imports:** prefer named exports. The one sanctioned default export is a
  route module's route component (React Router requires it), plus `root.tsx`.
  Group external → internal → relative.
- **Import paths:** use the `~/*` alias (→ `./app/*`) for imports that cross an
  app-level boundary (reaching into `components/`, hooks, or another feature);
  use a relative path (`./`, `../`) only for **colocated siblings** in the same
  folder or right next door. Always extensionless — no `.ts`/`.tsx` in the
  specifier.
- Prefer `const`; use `let` only when reassigning. Never `var`.
- Keep components small; lift shared logic into hooks (`useFoo`) or plain modules.

### File layout (React Router framework mode)

Routes live under `app/routes/` and are named by their **URL segment**, not by a
component name. Route-private code — components, hooks, and helpers used by
exactly one route — is **colocated** next to that route. Only genuinely shared UI
belongs in `app/components/`.

```
app/
├── root.tsx                  # <html> shell, global error boundary, <Outlet/>
├── routes.ts                 # route config (URL → file mapping)
├── app.css                   # global styles / Tailwind entry
│
├── routes/
│   ├── home.tsx              # /              simple route → flat file
│   ├── about.tsx             # /about
│   │
│   ├── auth/
│   │   ├── layout.tsx        # pathless layout (shared shell / redirects)
│   │   ├── login.tsx         # /login
│   │   └── register.tsx      # /register
│   │
│   └── games/
│       ├── layout.tsx        # /games layout — sidebar, <Outlet/>
│       ├── games-home.tsx    # /games                        index
│       ├── game-detail.tsx   # /games/:gameId
│       ├── game-sessions.tsx # /games/:gameId/sessions
│       │
│       └── game-session/             # /games/:gameId/sessions/:sessionId
│           ├── game-session.tsx      # the route module (loader/action/default)
│           ├── game-session-card.tsx # route-private component (used only here)
│           ├── scoreboard.tsx        # more session-only components
│           ├── use-session-timer.ts  # route-private hook
│           └── session-status.ts     # route-private helpers / types
│
└── components/               # ONLY genuinely shared UI
    ├── button.tsx            # used across auth, games, everywhere
    ├── avatar.tsx
    └── page-header.tsx
```

- A simple route is a **flat file** (`home.tsx`); a route that owns child routes
  or private components becomes a **folder** (`game-session/`) whose route module
  keeps the folder's name (`game-session.tsx`).
- **Layouts** are `layout.tsx`: they render an `<Outlet/>` for nested routes and
  may be _pathless_ (grouping or redirect only, no URL segment).
- **Colocation rule (YAGNI):** keep a component beside the route that uses it
  until a _second_ consumer appears — only then promote it to `app/components/`.
  Don't pre-share.

## 4. C (low-level / WASM-adjacent and any native tooling)

- **Formatter:** clang-format. Add a `.clang-format` at the repo root derived from
  a known base style (e.g. `BasedOnStyle: LLVM`) with `IndentWidth: 2`,
  `UseTab: Never`, `ColumnLimit: 100`.
- **Standard:** compile with `-std=c11 -Wall -Wextra -Werror`. Warnings are errors.
- **Naming:** `snake_case` for functions and variables; `UPPER_SNAKE_CASE` for
  macros and constants; `typedef`'d structs in `snake_case_t`.
- **Memory:** every `malloc` has a matching `free`; document ownership at the
  function boundary. Check every allocation and system-call return.
- **Headers:** include guards (`#ifndef VIMTYPE_FOO_H`), declarations in `.h`,
  definitions in `.c`. Keep headers minimal.
- Prefer fixed-width types (`stdint.h`: `uint32_t`, `size_t`) over bare `int`
  where size matters.

## 5. SQL / PostgreSQL

- **Identifiers:** `snake_case`, lowercase. Tables plural (`users`,
  `game_sessions`), columns singular.
- **Keywords UPPERCASE** (`SELECT`, `WHERE`, `JOIN`).
- Every table has a primary key; use explicit `FOREIGN KEY` constraints.
- **Schema changes go through migrations** (forward-only, ordered, checked into
  the repo). Never edit a shipped migration; add a new one.
- Parameterize all queries — never build SQL by string concatenation.

## 6. Comments & Documentation

- Comments explain **why**, not **what**. The code already says what.
- Public functions/modules get a one-line summary when their purpose isn't
  obvious from the signature.
- Mark deferred work with `// TODO:` and a short reason. No orphaned commented-out
  code.

## 7. Testing

- New behavior ships with automated tests where tests apply (per the Definition
  of Done).
- Tests are deterministic and independent of run order.
- Frontend: colocate `*.test.ts(x)` with the unit under test (probable runner:
  Vitest). C: a small test harness per module.
- A card cannot reach **Done** with failing or skipped tests.

## 8. Error Handling

- Fail loud in development, degrade gracefully in production. No silently
  swallowed errors (`catch {}` with an empty body is forbidden).
- Validate input at trust boundaries: API requests, anything from the browser,
  anything from the vim.wasm layer.
- Never trust client-reported scores/timings — the scoring/anti-cheat checks live
  server-side (see Cheating section of [BRAINSTORM.md](./BRAINSTORM.md)).

## 9. File & Project Organization

- Group by feature/domain, not by file type, once structure emerges. For the
  frontend this means **colocation** — see §3's file-layout rules.
- One primary export per file; the filename is the `kebab-case` form of that
  export (§3).
- Keep config (`.editorconfig`, `.prettierrc`, `.clang-format`, lint configs) at
  the repo root and committed.

## 10. Commit Conventions

The source of truth is qoomon's **Conventional Commits Cheatsheet**:
<https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13>. The rules
below summarize it; the gist wins on any conflict.

### Structure

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

Sections are separated by blank lines. The first commit of the repo is
`chore: init`.

### Types

- **feat** — additions, adjustments, or removals of API or UI features.
- **fix** — corrections to API or UI bugs from preceding feature commits.
- **refactor** — code rewrites/restructuring without altering behavior.
- **perf** — a refactor specifically to improve performance.
- **style** — formatting only (whitespace, semicolons); no behavioral impact.
- **test** — adding or correcting tests.
- **docs** — documentation-only changes.
- **build** — build tooling, dependencies, or project version changes.
- **ops** — infrastructure, deployment, CI/CD, monitoring, recovery.
- **chore** — misc tasks like `init` or editing `.gitignore`.

### Scope (optional)

- Adds context, e.g. `feat(lobby):`. Keep to a small, project-defined set as
  areas emerge (e.g. `lobby`, `session`, `scoring`, `leaderboard`, `lsp`, `db`).
- Never use an issue identifier as a scope.

### Description (required)

- Imperative mood: "add", not "added"/"adds".
- Do not capitalize the first letter.
- No trailing period.

### Body & footer (optional)

- Body explains motivation and contrasts with previous behavior; imperative mood.
- Footer holds issue references (`Closes #123`) and breaking-change descriptions.

### Breaking changes

- Mark with `!` before the colon: `feat(api)!: remove status endpoint`.
- Describe in a footer line starting with `BREAKING CHANGE:`.

### Examples

```
feat: add email notifications on new direct messages
fix(scoring): prevent submission of an empty codeblock
perf: decrease leaderboard query cost with a covering index
build: update dependencies
```

One logical change per commit (small commits — XP).

## 11. Tooling Checklist (set up once, before serious coding starts)

- [ ] `.editorconfig` (section 2)
- [ ] Prettier + `.prettierrc`
- [ ] ESLint + `@typescript-eslint`
- [ ] `tsconfig.json` with `strict: true`
- [ ] `.clang-format`
- [ ] Test runner wired into the project
- [ ] pre-commit hook running format + lint
