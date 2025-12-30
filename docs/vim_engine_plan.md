# Vim Engine Plan

## Core state model
- `buffer: string`
- `cursor: { line, col }` with computed index
- `mode: normal | insert | visualChar | visualLine`
- `selectionAnchor` for visual modes
- `targetText: string` (immutable)
- `statsTracker` (records per-insert correctness + timing)

## Input handling
- Capture `keydown` and prevent default for owned keys.
- Use a keymap layer for multi-key sequences (`d`+`w`, `g`+`g`).
- Support sequence timeouts or cancellation to keep input predictable.
- Reserve `Esc` for Vim mode switching and avoid conflicts with Monkeytype shortcuts.

## Minimum supported keyset (MVP)
- Mode: `i a I A o O Esc v V`
- Motions: `h j k l w b e 0 ^ $ gg G go`
- Editing: `x`, `dw`, `dd`, `cw` (optional), `u`, `Ctrl-r`
- Visual: `d`

## Explicit MVP exclusions
- Paste (`p/P`), macros, registers, ex commands, search `/`, replace.

## Scoring constraints
- Only character insertions count as typed characters.
- Commands never increment typed character totals.
- Tests end when buffer exactly equals target.
