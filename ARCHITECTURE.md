# Architecture

This document records the system architecture patterns chosen for vimtype and why.
It complements [BRAINSTORM.md](./BRAINSTORM.md) (product/design rationale) and
[CODING_STANDARDS.md](./CODING_STANDARDS.md) (code-level rules).

## Context

Vimtype is not one app but a small distributed system with distinct subsystems:

- **Interactive WASM editor client** — vim.wasm running in a Web Worker with a canvas
  renderer, modal (Normal/Insert) gameplay, two-pane game session.
- **Stateless API server** — Fastify + `pg` + `zod`.
- **Server-authoritative scoring + custom LSP core** — security-critical.
- **PostgreSQL** — users, sessions, codeblocks, leaderboards.

No single pattern fits all of it well, so the architecture is a small stack of
patterns, each owning the seam it is best at.

Two constraints dominate every choice below:

- **Solo developer, ~2-month MVP** (deadline **August 16th, 2026**).
- **YAGNI** is a first-class coding standard (see CODING_STANDARDS §1).

Together these penalize heavyweight/enterprise patterns and reward patterns the stack
already nudges us toward. When in doubt, choose the lighter option and refactor later.

## The pattern stack (most- to least-central)

### 1. Layered (N-tier) architecture as a modular monolith — the backbone

Presentation/API → application/services → domain → persistence, all in **one**
deployable server, organized into modules (`auth`, `session`, `scoring`, `leaderboard`,
`codeblocks`).

**Why:** lowest-risk skeleton for a solo, time-boxed full-stack app. Clean seams and
testability without distributed-systems tax. Still meets the 1,000-concurrent target by
running **stateless** instances behind Nginx. This is the frame the other patterns plug
into. Classic MVC's "controller + model" lives here.

**Explicitly not microservices** — that is over-engineering for a solo MVP (YAGNI). A
modular monolith keeps module boundaries clean so it _could_ be split later if real
scale ever demands it.

### 2. Component-based UI + unidirectional data flow — the client

React's Flux/MVVM idiom: views are components, hooks act as view-models, state flows
down and events flow up.

**Why:** React 19 + React Router already impose this, so we get it for free by working
_with_ the framework instead of bolting classic server-side MVC onto it. Fits the lobby,
session, results, and leaderboard pages naturally.

### 3. State machine / statechart — the game session (+ Vim modes)

Model gameplay as an explicit finite state machine:
`lobby → ready → active → results`, plus modal Normal/Insert behavior.

**Why:** gameplay is inherently stateful, and several requirements are illegal-state
problems in disguise. A state machine makes transitions explicit, blocks illegal states,
and is trivially unit-testable, which lines up with the XP "automated tests" element.
Prefer a reducer or a small statechart; do not over-reach.

Two transitions carry real rules (BRAINSTORM §15): the clock starts on the **first
keypress**, so `ready → active` is keystroke-triggered rather than load-triggered; and a
suspended session **restarts** rather than resuming, so there is no `incomplete` state
and no partial-progress persistence. That absence is a deliberate simplification — it
removes resumable-state storage, the "must finish before starting another" rule, and an
entire class of tamperable client state.

### 4. Event-driven / message-passing + Observer — the worker & LSP seams

The client↔editor boundary is inherently async message-passing (vim.wasm lives in a Web
Worker). The LSP/diff loop is observer-shaped: buffer change → diff the left pane against
the target → emit errors → repaint sign column / underlines.

**Why:** essential at these two seams, but _not_ a whole-system organizing principle.
Apply it locally, not everywhere.

#### The vim.wasm bridge (verified against vim-wasm, Vim 8.2.0055)

The editor seam is narrow, and every game-session feature has to be expressed through
it. What the build actually provides:

| Direction                  | Mechanism                                  | Status                                      |
| -------------------------- | ------------------------------------------ | ------------------------------------------- |
| JS → Vim                   | `vim.cmdline(string)`                      | Public, documented                          |
| Vim → JS (file contents)   | `:export` → `onFileExport(path, contents)` | Public                                      |
| Vim → JS (arbitrary calls) | `jsevalfunc()` in Vim script               | Present in the WASM build, **undocumented** |

Notes that constrain the design:

- `VimWasm.readFile` is **private**, so `:export` is the supported path for getting
  buffer contents out.
- The canvas renderer's `drawText` accepts `underline`, `undercurl`, and `strike`,
  so Vim-native error highlighting renders correctly (BRAINSTORM §10).
- The system clipboard is bridged **only** if `VimWasm.readClipboard` is assigned;
  leaving it unset disables it while Vim's internal registers keep working
  (BRAINSTORM §12).

**Open risk.** The live-feedback loop — buffer change → read buffer → diff → push
highlights — depends on the Vim → JS direction, which is the least documented part of
the bridge. BRAINSTORM §10, §11, and §13 all assume this loop is fast enough to feel
live. **This should be spiked before building on it:** a throwaway branch that logs
the buffer to the console on every `TextChanged`, and confirms the exact `:export`
command spelling and `jsevalfunc()` semantics. If the loop is too slow, the error
display model needs rethinking — and that is much cheaper to learn early.

### 5. Hexagonal (Ports & Adapters) — scoped to scoring + anti-cheat + LSP only

Isolate the pure, server-authoritative scoring/validation domain behind ports, with
adapters for Postgres, the LSP implementation (native C vs. a wasm build), and transport.

**Why:** protects the most security-sensitive, most-likely-to-be-swapped code and keeps
it testable in isolation. Ranked last because full hexagonal _everywhere_ would fight
YAGNI on a 2-month solo build — the value is real only if confined to the scoring/LSP
core.

**The LSP runs on both sides, with different jobs** (BRAINSTORM §13): a client-side
WASM build drives live error feedback, where latency forbids a round trip and the
result is therefore untrusted; a server-side native C build performs authoritative
final validation and scoring. This is precisely the adapter swap the port exists for.

The two sides must share **one comparison implementation**, not two that agree by
convention — otherwise the client can call a codeblock complete while the server
rejects it. The same applies to the target renderer that materializes a codeblock in
the player's tabs/indent settings (BRAINSTORM §14): byte-exact comparison is only
meaningful if both sides produce identical bytes.

## How the patterns compose

- **#1 + #2** are the foundation used everywhere (server backbone + client).
- **#3** governs the game session specifically.
- **#4** applies at the Web Worker and LSP seams.
- **#5** is reserved for the scoring/anti-cheat/LSP core.

Each piece is independently justifiable — which matters when a reviewer (or future you)
asks "why is this here?"

## Implied module layout (indicative, not prescriptive)

Group by feature/domain, not by file type (CODING_STANDARDS §9). Structure emerges as
needed; the sketch below is a starting point, not a required scaffold.

```
client/app/
  routes/            # lobby, session, results, leaderboard, rules (React Router)
  features/
    session/         # state machine (#3), two-pane game view (#2)
    lobby/           # toggles + persisted preferences
    leaderboard/
  editor/            # vim.wasm Web Worker bridge (#4), canvas glue
  lib/               # shared hooks/utilities

server/src/
  modules/           # layered modules (#1)
    auth/
    session/
    scoring/         # hexagonal core (#5): domain + ports
    leaderboard/
    codeblocks/
  adapters/          # pg, LSP (C/wasm), transport (#5)
  app.ts             # Fastify wiring
```

## Status

Decided during initial project setup. Revisit if scale requirements change materially
(e.g. concurrent users well beyond the initial 1,000 target) or if the scoring/LSP core
needs to move out of the monolith.
