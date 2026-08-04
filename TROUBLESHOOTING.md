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

**Fix:** Made the page cross-origin isolated by sending the COOP/COEP headers on the
document response — same solution as #7. nginx (production) will need the same headers
later.

**Status:** Resolved.

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

**Fix:** Replaced `server.headers` with a small inline Vite plugin using
`configureServer` to register a middleware that sets both headers on _every_ response via
`res.setHeader(...)` before `next()`, so the document is covered too. Vim boots once the
document is cross-origin isolated (`crossOriginIsolated === true`).

**Status:** Resolved.

---

## 8. Two-pane grid collapsed instead of filling the screen

**Symptom:** The game-session grid (`grid-rows-[1fr_auto]`) shrank to its content height
instead of filling the viewport; the `1fr` pane row had no height to take and the status
bar rode up under the panes.

**Root cause:** A `1fr` track (and `h-full`) needs a **definite height to cascade from**,
and the chain has to be unbroken from the viewport down. Any missing link leaves `1fr`
with nothing to distribute, so the rows collapse to content height.

**Fix:** Made the height chain continuous: root shell `h-dvh` → the `<Outlet>` wrapper
`flex-1 flex flex-col min-h-0` → the page `<main>` `h-full`. With real vertical space, the
grid finally split into `1fr auto` as intended.

**Status:** Resolved (shell links in `113260e`, the `<main> h-full` in `fcafc14`).

---

## 9. vim-wasm rendered a tiny screen in the corner of the pane

**Symptom:** Vim booted but drew a small box in the top-left of the left pane ("it stops
in the middle") instead of filling it.

**Root cause:** Two things compound. A bare `<canvas>` defaults to **300×150 px**
regardless of its container, and vim-wasm **measures the canvas's DOM size at the moment
`new VimWasm(...)` is constructed** (its `ScreenCanvas`/`ResizeHandler`) and tells the
worker to draw exactly that many pixels. So Vim faithfully rendered a 300×150 screen.

**Fix:** Gave the canvas a real display size that fills the pane _before_ Vim starts —
made `TestPane` a flex column and let the canvas grow (`flex-1`) inside a definite-height
pane. Because the `useEffect` runs _after_ layout, the canvas is already full-size when
vim-wasm measures it. (vim-wasm's built-in `ResizeHandler` then keeps it in sync on later
resizes.)

**Status:** Resolved (commit `fcafc14`).

---

## 10. Hiding the Vim input with `display: none` killed all keystrokes

**Symptom:** Hiding vim-wasm's helper `<input>` so it wasn't visible in the pane made Vim
stop receiving any typing.

**Root cause:** vim-wasm routes every keystroke through that hidden `<input>`, so it must
stay **focusable and in the layout**. `display: none`, `hidden`, and `visibility: hidden`
all pull the element out of the focus/accessibility tree — it can no longer be focused or
receive `keydown`. `opacity: 0` alone keeps it focusable but still occupies layout space.

**Fix:** Used Tailwind's `sr-only` utility — the "visually hidden" recipe (1px, clipped,
absolutely positioned) that keeps the input in the DOM and focusable while giving it no
visual footprint. Vim keeps getting keys; clicking the canvas re-focuses the input via
vim-wasm's own `onClick` handler.

**Status:** Resolved (commit `fcafc14`).

---

## 11. Vite 504 "Outdated Optimize Dep" again — this time after `npm install`

**Symptom:** Right after `npm install react-icons`, the dev server screen went black and
the console showed `504 (Outdated Optimize Dep)`. Confusingly, the modules that 504'd
were `react-router` and `react_jsx-dev-runtime` — not react-icons — so I first went
looking for a problem in the icon import itself.

**Root cause:** Same mechanism as #6, but a trigger I hadn't generalized yet. Vite
pre-bundles dependencies into `node_modules/.vite/deps/` and serves them behind a version
hash. **Any** change to the dependency graph invalidates that cache, so a plain
`npm install` does it just as surely as editing `vite.config.ts`. The already-open tab
kept requesting the stale hash for the deps it had loaded earlier, which is why the
errors named unrelated packages. React never mounted, hence the black screen.

**Fix:** Same recipe as #6 — stop the dev server, `rm -rf node_modules/.vite`, restart
`npm run dev`, hard-reload (⌘⇧R).

**Status:** Resolved. The generalized rule I'm taking from this: **after any
`npm install`/`npm uninstall`, restart the dev server and hard-reload before believing
anything the console says.**

---

## 12. `npm audit fix --force` silently loosened the React Router version pins

**Symptom:** `npm install react-icons` reported 2 critical and several moderate
vulnerabilities, so I ran `npm audit fix --force` repeatedly until the count reached
zero. Afterwards, `package.json` no longer matched what the React Router starter had
shipped.

**Root cause:** Plain `npm audit fix` stays inside the semver ranges already declared.
The `--force` flag drops that guarantee: it is allowed to install **breaking major
upgrades and even downgrades** to make the advisory go away. It rewrote the starter's
deliberate exact pins (`"react-router": "8.0.0"`) into carets (`"^8.3.0"`) across
`react-router`, `@react-router/node`, `@react-router/serve`, and `@react-router/dev`.
Those four packages have to move as a set — the framework, its dev plugin, and its
runtime adapters are versioned together — so floating them independently is exactly the
thing the exact pins existed to prevent. I got lucky here: every bump happened to stay
inside major 8, so nothing broke.

**Fix:** Re-pinned the runtime packages to exact `8.3.0` and verified `npm audit` still
reported 0 vulnerabilities.

**Status:** Resolved (commits `1227e50`, `22eb619`). `@react-router/dev` is still on
`^8.3.0` — a leftover I should tighten for consistency. The habit to keep: run plain
`npm audit fix` first, and treat `--force` as a decision to review the resulting diff,
not a button to mash until the number hits zero.

---

## 13. A hyphen in a destructuring pattern produced six unrelated TypeScript errors

**Symptom:** While writing `NavIcon`, `nav-icon.tsx` lit up with six errors at once —
TS1005 ×3, TS1128 ×2, TS1109 — pointing at lines that looked fine.

**Root cause:** I had written `aria-lable` as a name inside the destructuring pattern.
Prop _names_ in JSX may contain hyphens, but a destructured **binding** is a JavaScript
identifier, and identifiers can't. The parser read the `-` as a minus operator, lost the
thread, and every error after that was fallout from the first one. (There was also a
`lable` → `label` typo riding along.)

**Fix:** Renamed the prop to `label`, a legal identifier, and applied it as
`aria-label={label}` on the inner `<NavLink>` — the hyphen belongs in the JSX attribute,
not in the binding.

**Status:** Resolved. Lesson: when a small file throws a cluster of syntax errors, fix
the **first** one and re-check before reading any of the others.

---

## 14. `<icon />` rendered nothing, with no error

**Symptom:** `NavIcon` received an icon component as a prop and rendered it, but no icon
appeared. No console error, no TypeScript complaint.

**Root cause:** JSX decides what a tag means by its **capitalization**. A lowercase tag
compiles to a literal HTML element string — React happily created an unknown `<icon>`
element, which renders nothing. Only an uppercase tag is treated as a component
reference. Because my prop was named `icon`, `<icon />` was never looking at my variable
at all.

**Fix:** Renamed the binding on the way in — `{ icon: Icon }` in the destructuring
pattern — and rendered `<Icon />`. (Worth noting: `{ icon: Icon }` here is a _rename_,
not a type annotation. The type goes after the closing brace: `}: NavIconProps`. Mixing
those two up cost me most of an afternoon.)

**Status:** Resolved (commit `2002a56`).

---

## 15. Tailwind classes that do nothing, silently

**Symptom:** Styles I had clearly written had no effect. Twice: `text-red` produced no
color, and a `jusitfy-center` typo left a flex container unaligned.

**Root cause:** Tailwind generates CSS only for class names it recognizes. Anything else
is passed through to the DOM untouched and simply never matches a rule — there is no
error, no warning, and the class is visible in DevTools looking perfectly plausible. Two
ways to land here: a typo, or a palette color written without a shade. Tailwind's palette
colors **require** a numeric shade (`text-red-500`); `text-white` and `text-black` are
the exceptions that made me think a bare color name was valid.

**Fix:** `text-red` → `text-red-500`, and corrected the typo. I also removed a few dead
classes I found while looking (`className="ml-0"`, an empty `className=""`).

**Status:** Resolved. Check the Elements panel for a class that's present-but-inert
before assuming the problem is elsewhere.

---

## 16. The centered icon row anchored to the viewport instead of the navbar

**Symptom:** I centered the navbar's icon row with `absolute left-1/2 -translate-x-1/2`.
It centered on the **page**, not the navbar, and drifted as the layout changed.

**Root cause:** `position: absolute` resolves against the nearest ancestor whose
`position` is something other than `static` — falling back to the viewport if there
isn't one. My `<nav>` was a flex container, and **`display: flex` does not change
`position`**; the nav was still `static`, so the icon row skipped straight past it.

**Fix:** Added `relative` to the `<nav>`, which makes it the positioning context the
absolute child resolves against.

Worth recording _why_ absolute positioning at all: in flexbox, a middle child centers
within the **leftover** space between its siblings, so both `justify-center` and
`mx-auto` put the icons midway between the logo and the profile icon — not at the true
center of the navbar. Leaving normal flow is what decouples the row from its siblings'
widths. `grid grid-cols-3` with `justify-self-start/center/end` is the other way to get
the same result.

**Status:** Resolved (commit `2002a56`).

---

## 17. A malformed rule in `eslint.config.js` disabled linting for the whole repo

**Symptom:** While adding a `parameter` selector to the
`@typescript-eslint/naming-convention` rule, eslint stopped reporting anything at all —
not just for the file I was editing, but everywhere.

**Root cause:** I wrote the format list as a single string containing a comma,
`format: ["camelCase, PascalCase"]`, instead of two strings,
`format: ["camelCase", "PascalCase"]`. That fails the rule's schema validation, and a
config that fails validation doesn't degrade gracefully — **eslint aborts entirely**. A
broken config is therefore strictly worse than the warning it was meant to add, because
it takes every other rule down with it and looks like "no problems found."

**Fix:** Split the value into two array entries.

**Status:** Resolved before committing; the corrected rule landed in `d5e7750`. New
habit: **re-run eslint immediately after editing its config**, and treat a sudden drop to
zero findings as a failure signal, not a success.

---
