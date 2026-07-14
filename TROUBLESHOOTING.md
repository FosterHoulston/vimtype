# Troubleshooting Log

A running log of problems I hit while building vimtype and how I solved them.
Newest entries at the bottom. Each entry follows: **Symptom → Root cause → Fix → Status**.

---

## 1. `/game-session` rendered a blank page, but no 404

**Symptom:** Visiting `/game-session` in the dev server showed an empty screen. No
404 was thrown, so routing appeared to be "working."

**Root cause:** A name collision in `client/app/routes/GameSession.tsx`. The route
module imported `{ GameSession }` from the component file _and_ declared its default
export as `function GameSession()`. The default component's `<GameSession />` resolved
to itself instead of the imported component, so nothing meaningful rendered. (The empty
HTML from `curl` was a red herring — the app runs in SPA mode, so the server always
returns an empty shell and React renders client-side.) The route path in `routes.ts`
had also pointed at the wrong file.

**Fix:** Renamed the default export to `GameSessionRoute` so `<GameSession />`
unambiguously refers to the imported component, and pointed the route at
`routes/GameSession.tsx`.

**Status:** Resolved (commit `e4130e6`).

---

## 2. Lint/format pre-commit hooks failed on the vendored vim-wasm assets

**Symptom:** Committing the copied `client/public/vim-wasm/` files triggered eslint and
prettier errors on `vim.js`.

**Root cause:** `vim.js` is machine-generated Emscripten output (and `vim.wasm` /
`vim.data` are binary). It should never be linted or reformatted — prettier's `--write`
would have mangled the generated worker.

**Fix:** Told each tool to ignore the vendored folder:

- `eslint.config.js` → added `client/public/vim-wasm/**` to the global `ignores`.
- `.prettierignore` → added `client/public/vim-wasm`.

**Status:** Resolved.

---

## 3. eslint pre-commit hook still failed with `--max-warnings=0`

**Symptom:** Even after ignoring the folder in `eslint.config.js`, the eslint hook
failed with `File ignored because of a matching ignore pattern` → "too many warnings
(maximum: 0)."

**Root cause:** The pre-commit hook passes staged file paths to eslint _explicitly_.
When you explicitly name a file eslint is configured to ignore, it emits a _warning_
rather than silently skipping — and `--max-warnings=0` turns that one warning into a
failure. A tool-level ignore stops linting; it doesn't stop the hook from _handing_ the
file to eslint.

**Fix:** Added `client/public/vim-wasm/` to the eslint hook's own `exclude:` regex in
`.pre-commit-config.yaml`, mirroring the existing `client/\.react-router/` entry.

**Status:** Resolved.

---

## 4. prettier pre-commit hook: "files were modified by this hook"

**Symptom:** The prettier hook aborted the commit, reporting it had modified
`eslint.config.js`.

**Root cause:** Not an error — prettier auto-formatted `eslint.config.js` (wrapping the
now-long `ignores` array). Pre-commit fails whenever a hook changes a file, so the change
can be reviewed and re-staged.

**Fix:** Re-staged the reformatted file (`git add`) and re-committed. Normal auto-fix
flow.

**Status:** Resolved (assets + config landed in commit
`chore: add vendored vim-wasm runtime assets`).

---

## 5. `SharedArrayBuffer is not defined` when starting Vim

**Symptom:** Booting the `GameSession` component threw "Can't find variable:
SharedArrayBuffer" in the browser console; nothing rendered.

**Root cause:** vim-wasm's Web Worker needs `SharedArrayBuffer`, which browsers disable
by default (post-Spectre). It is only re-enabled when the page is **cross-origin
isolated**, which requires the _document_ response to send two headers:
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`.

**Fix (in progress):** Adding the COOP/COEP headers to the dev server — see #7 for the
wrinkle. nginx (production) will need the same headers later.

**Status:** In progress.

---

## 6. Vite 504 "Outdated Optimize Dep" after editing `vite.config.ts`

**Symptom:** After editing `vite.config.ts`, the browser showed two `504 (Outdated
Optimize Dep)` errors and the page was blank.

**Root cause:** Vite pre-bundles dependencies into `node_modules/.vite/deps/` and serves
them with a version hash. Editing `vite.config.ts` invalidates that cache and changes the
hash; the already-open tab kept requesting the old hash → 504.

**Fix:** Stop the dev server, `rm -rf node_modules/.vite`, restart `npm run dev`, then
hard-reload the browser (⌘⇧R).

**Status:** Resolved (operational quirk; recurs whenever the dep cache is invalidated).

---

## 7. COOP/COEP headers not applied to the HTML document (`server.headers` insufficient)

**Symptom:** After adding `server.headers` to `vite.config.ts` and restarting,
`SharedArrayBuffer` was still undefined and the `game-session` document showed no
cross-origin headers in the Network tab.

**Root cause:** Vite's `server.headers` only decorates responses served by Vite's own
middleware (JS/CSS assets got the headers). The **HTML document** in React Router
framework mode is written by the React Router dev plugin's own request handler, which
ignores `server.headers`. Cross-origin isolation is decided by the _document_ response —
the one response that was missing the headers.

**Fix (in progress):** Replace `server.headers` with a small inline Vite plugin using
`configureServer` to register a middleware that sets both headers on _every_ response via
`res.setHeader(...)` before `next()`, so the document is covered too.

**Status:** In progress.

---
