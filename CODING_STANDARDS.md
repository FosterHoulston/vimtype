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

- **Formatter:** Prettier (the source of truth for formatting.
- **Linter:** ESLint with `@typescript-eslint`. Lint must pass clean before
  a card leaves Testing & Validation.
- **`strict` mode on** in `tsconfig.json`. No implicit `any`; prefer `unknown`
  and narrow.
- **No `any`** unless interfacing with an untyped library, and then localize and
  comment it.
- **Components:** function components with hooks only — no class components.
- **Naming:**
  - `camelCase` — variables, functions.
  - `PascalCase` — components, types, interfaces, enums.
  - `UPPER_SNAKE_CASE` — module-level constants.
  - Component files match the component name: `GameLobby.tsx`.
- **Imports:** prefer named exports; avoid default exports except for React
  components/pages. Group external → internal → relative.
- Prefer `const`; use `let` only when reassigning. Never `var`.
- Keep components small; lift shared logic into hooks (`useFoo`) or plain modules.


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

- Group by feature/domain, not by file type, once structure emerges.
- One primary export per file; filename matches that export.
- Keep config (`.editorconfig`, `.prettierrc`, `.clang-format`, lint configs) at
  the repo root and committed.


## 10. Commit Conventions

Follows the existing project history. Format:

```
<type>: <short imperative summary>
```

- **Types in use:** `add`, `update`, `fix`, `refactor`, `docs`, `test`, `chore`.
- Summary lowercase, no trailing period preferred; ~50 chars.
- One logical change per commit (small commits — XP).
- Multiple related changes may share a message with several `type:` clauses, as
  in existing history, but prefer separate commits when they're truly separate.


## 11. Tooling Checklist (set up once, before serious coding starts)

- [ ] `.editorconfig` (section 2)
- [ ] Prettier + `.prettierrc`
- [ ] ESLint + `@typescript-eslint`
- [ ] `tsconfig.json` with `strict: true`
- [ ] `.clang-format`
- [ ] Test runner wired into the project
- [ ] pre-commit hook running format + lint
