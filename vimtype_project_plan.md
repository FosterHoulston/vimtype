# Vimtype Project Plan (Monkeytype Fork)

This is a production-oriented project plan for **Vimtype** (a Monkeytype fork) based on the constraints:

- **Minimum Vim surface area: Level 2**, including **Visual modes**
- **Real Vim keys**
- Tests are still **“type what you see”**
- **Scoring/metrics identical to Monkeytype** (no command-error metrics)
- Users type **full algorithm solutions** (no pseudocode/comments)
- Content starts with **public-domain algorithms**
- Keep **Monkeytype’s minimal UI** + translatable features/options/themes/layouts
- Keep **backend and production strategy consistent with Monkeytype**
- Keep **same license** and **same revenue strategy** as Monkeytype

---

## 0) Repo + identity setup (clean start)

**Goal:** end up with exactly one repo called `vimtype` that is your Monkeytype fork.

1. **Free the `vimtype` name**
   - Rename your existing non-fork repo `vimtype` → `vimtype-archive` (or delete it if you truly want zero retention).
2. **Rename your existing Monkeytype fork to `vimtype`**
   - GitHub won’t let you have *two forks* of the same upstream on the same account, so the optimized move is renaming the fork you already have.
3. **Reset project branding**
   - Update name/branding assets, docs, and user-facing “monkeytype” references.
4. **Set `upstream` remote**
   - Keep `upstream` pointing at `monkeytypegame/monkeytype` so you can cherry-pick/rebase updates cleanly.

---

## 1) North-star product definition (what “done” means)

### MVP definition
- New test mode: **Algorithms (Vim Mode)**.
- User sees a **full algorithm solution** and must finish with **buffer == target solution** (**type what you see**).
- Editor behaves like Vim **Level 2**:
  - **Normal + Insert + Visual** (char/line at minimum)
  - **Real Vim keys** (hjkl, i/a/o, dd/dw, etc.)
- Scoring is **exactly Monkeytype’s**: WPM/raw/accuracy/consistency/char stats.
- Anti-cheat philosophy stays aligned with Monkeytype (no new “vim errors” tracking).

### Non-goals (to protect scope)
- Not a full Vim clone (no macros, registers, plugins, ex commands, etc.).
- No “paste-to-insert-many-characters” mechanics in MVP.

---

## 2) Architecture plan (keep Monkeytype’s stack, add the minimum new surfaces)

### Keep unchanged
- Monorepo tooling (pnpm + turbo)
- Self-hosting approach (Docker path with backend + DB + cache)
- Accounts/auth approach (if used) consistent with Monkeytype
- Revenue strategy patterns consistent with Monkeytype
- Telemetry approach consistent with Monkeytype

### Add (new modules)
1. **Vim Engine (frontend, pure TS)**
2. **Algorithm dataset + loader (frontend static data)**
3. **New test mode wiring** (frontend + minimal backend validation updates if required)

---

## 3) Workstreams + milestones

### Milestone A — “Fork boots, unchanged”
**Deliverable:** Vimtype runs locally and via Docker with stock Monkeytype behavior.
- Confirm dev scripts work (pnpm/turbo)
- Confirm Docker self-host boots and frontend reaches backend

**Exit criteria:** baseline app works before modifications.

---

### Milestone B — “Algorithms mode without Vim” (content pipeline first)
**Why:** proves your dataset + scoring integration before editor complexity.
- Add **Algorithms** content type (static dataset + loader)
- Render algorithms as a test prompt (linear typing like Monkeytype)
- Store results through the existing results pipeline

**Exit criteria:** you can complete an algorithm test and see a normal results screen.

---

### Milestone C — “Vim Insert Mode only” (editor skeleton)
- Introduce a new editor surface that can:
  - Maintain a buffer of characters
  - Maintain cursor index
  - Insert at cursor
  - Backspace behavior
- Gate behind a flag:
  - `testMode = algorithms`
  - `inputMode = vim`

**Exit criteria:** Insert-only Vim test is playable end-to-end and results match Monkeytype.

---

### Milestone D — “Normal mode + core motions”
Implement enough to feel like Vim while staying testable:
- Modes: Normal/Insert + Escape transitions
- Motions: `h j k l`, `w b e`, `0 ^ $`, `gg G`
- Insert variants: `i a I A o O`
- Edits (subset): `x`, `dw`, `dd`, `cw`, `cc` (optional early)
- Undo/redo: `u`, `Ctrl-r` (recommended)

**Exit criteria:** users can navigate and correct mistakes in Vim style.

---

### Milestone E — “Visual mode” (Level 2 requirement)
- Visual char: `v`
- Visual line: `V`
- Operations: `d` (delete selection)
- Optional later: `y` (yank) but **avoid paste** in MVP

**Exit criteria:** visual selection works and tests remain completable normally.

---

### Milestone F — “Scoring correctness parity”
This is the hardest part.

**Rule to preserve Monkeytype metrics:**
- Only **character insertions** count as “typed characters”.
- Navigation/edit commands (`hjkl`, `w`, `dd`, etc.) do **not** add to typed char totals.
- Each inserted character is judged against the target at the insertion position/time and increments correctness counters the same way Monkeytype does.
- Test ends when buffer exactly equals the target solution.

**Cheat-safe restriction (recommended):**
- Disallow operations that insert **more than 1 character per keypress**.
  - That implies **no paste (`p`, `P`)**, no macros, no registers.

**Exit criteria:** results are stable, comparable, and not trivially gameable.

---

### Milestone G — “Backend compatibility + leaderboards”
- If backend validates modes/languages tightly, add “algorithms/vim” as a valid mode.
- Ensure daily leaderboard rules can include the new mode if desired.

**Exit criteria:** server accepts result submissions; leaderboards behave consistently.

---

### Milestone H — “Production hardening”
- Error/perf monitoring
- Analytics + privacy disclosures
- Ads/support links consistent with Monkeytype approach
- Security: rate limits, abuse prevention, Recaptcha if accounts enabled
- CI: lint/build/test

**Exit criteria:** deployable, monitorable, maintainable.

---

## 4) Algorithm content plan (public domain, no LeetCode IP risk)

**Safe strategy:**
1. Write your own solutions and dedicate them to the public domain (CC0-equivalent).
2. Dataset format per prompt:
   - `id`, `title`, `language`, `difficulty`, `topicTags`
   - `solutionText` (exact code to type)
   - `license` and `authorship`
3. Start small: ~25–50 solutions, high quality.

**Formatting rules:**
- One language at first (Python or TypeScript recommended)
- Deterministic formatting (spaces, indentation, newline at EOF)
- No comments/pseudocode (per constraint)
- Prefer shorter canonical solutions initially

---

## 5) Vim engine implementation plan (Level 2, testable)

### Core data model
- `buffer: string` (optimize later)
- `cursor: { line, col }` + computed index
- `mode: normal | insert | visualChar | visualLine`
- `selectionAnchor` for visual modes
- `targetText: string` (immutable)
- `statsTracker` (records per-insert correctness + timing)

### Input handling
- Capture `keydown` and prevent default for keys you own
- Keymap layer for:
  - Multi-key sequences (`d` + `w`, `g` + `g`)
  - Timeouts / cancellation
- Avoid conflicts with Monkeytype shortcuts in Vim mode (reserve `Esc` for Vim)

### Minimum supported keyset (recommended)
- Mode: `i a I A o O Esc v V`
- Motions: `h j k l w b e 0 ^ $ gg G`
- Editing: `x`, `dw`, `dd`, `cw` (optional), `u`, `Ctrl-r`
- Visual: `d`

### Explicitly exclude in MVP
- Paste (`p/P`), macros, registers, `:` commands, search `/`, replace commands, clipboard integration

---

## 6) Testing strategy

### Unit tests
- Vim engine transitions:
  - given `(buffer, cursor, mode) + keys[] => newState`
- Edge cases:
  - start/end of line, empty selection, unicode, tabs vs spaces
- Stats tracking:
  - insertion correctness counting
  - timing boundaries

### Integration tests
- Golden prompts: known algorithm prompts with known keystroke scripts
- Validate WPM/raw/accuracy computations match Monkeytype’s definitions

### Anti-cheat tests
- Ensure disallowed operations cannot insert >1 character per keystroke

---

## 7) Production deployment plan (consistent with Monkeytype)

- Docker-first production path initially:
  - Frontend + backend + database + cache
- If enabling accounts:
  - Configure auth provider + optional Recaptcha
- Add monitoring + analytics consistent with Monkeytype disclosures
- Revenue:
  - Optional ads + support links consistent with Monkeytype

---

## 8) Licensing/compliance checklist

- Keep the same GPL-3.0 licensing as Monkeytype
- Ensure deployed site offers corresponding source code (GPL compliance)
- Do not import LeetCode prompt/solution text
- Ensure algorithms are authored by you (or clearly public domain/permissively licensed)

---

## 9) Suggested first 10 GitHub issues (backlog)

1. Rename fork repo to `vimtype` + update branding strings/icons
2. Add `docs/vision.md` capturing Level 2 Vim scope + excluded features
3. Add `algorithms/` dataset format + loader
4. Add Algorithms mode (non-vim) wired into existing test pipeline
5. Create `vim-engine/` module with state model + key parser
6. Implement Insert mode + cursor + rendering
7. Implement Normal mode motions + insert variants
8. Implement Visual mode + delete selection
9. Implement scoring adapter: “only inserted chars count” + parity tests
10. Add cheat-safe restrictions + tests (block paste/macros)
