# Entry point for the design process

## Decisions that need to be made (unordered)

- What design methodology will be used?
- Are there any products/apps that have similar parts to this app?
- What is the timeframe for the MVP?
- Am I implementing a real terminal in the browser, or am I creating an emulation?
- What will gameplay look like?
- What are the primary end-goals of the project?
- What languages and technologies are prefered for this project?
- What will the MVP look like?
- What is an estimate of the maximum number of active users at any given time?
- How will errors be displayed during a typing test?
- How will the right pane track the caret position of the left pane?
- How will terminal commands be restricted?
- Where does the diff/LSP run — client, server, or both?
- What counts as a "complete" codeblock?
- How is elapsed time measured, and what happens when a session is suspended?
- How are themes defined across two different rendering systems?
- What does the status bar display?
- Which platforms are supported?

## Decisions that need to be made (ordered and answered)

### 1. What are the primary end-goals of the project?

- Improve my low-level programming skills.
- Improve my javascript skills.
- Improve my systems design knowledge.
- Improve my Vim knowledge and speed.
- Understand memory and computers on a deeper level.
- Understand data management and scalability on a deeper level.
- Design a moderately complex and efficient full-stack web application.
- Host the web application with AWS.
- Release the MVP before I start sending out applications August 16th.
- Express my passion for Vim and typing.

### 2. What is the timeframe for the MVP?

- The MVP must be complete by **August 16th, 2026**.

### 3. What is an estimate of the maximum number of active users at any given time?

- Initially, there should be no more than **1,000** users at a time, but scalability
  will be incorporated into the design, so that this number can grow if necessary.

### 4. What languages and technologies are preferred for this project?

- Postgresql
- Nginx
- AWS EC2
- C
- Typescript
- React
- Ubuntu Linux
- Custom (simple) LSP
- AI API/s (if there is time)

### 5. What will gameplay look like?

- (see [Gameplay](#Gameplay))

### 6. Am I implementing a real terminal in the browser, or am I creating an emulation?

- Neither. I will use Rhysd's vim.wasm project that compiles Vim (not Neovim) to WASM,
  with a canvas renderer. Also use Rhysd's react-vim-wasm component.

### 7. What will the MVP look like?

- The MVP will have the following pages:
  1. The **game lobby** displays the "Start Game" button, as well as all
     customizable feature options.
  2. The **game session** displays two vertical panes that display the 1. test canvas
     (left pane) where the player modifies the character elements within the canvas
     and sees all the test errors and current test state, and the test caret, and 2.
     the model canvas (right pane) where the desired completed test state
     is displayed, as well as a tracking caret.
  3. game results
  4. leaderboards
  5. rules

- The MVP will have the following features:
  1. Javascript and Typescript test language options shall be available for all
     test codeblocks and selectable from the game lobby and will persist for
     all future game sessions until the other language is selected again.
  2. 20 unique test codeblocks shall be integrated into and available for all
     game sessions.
  3. A relative line number toggle shall be present in the game lobby that can
     toggle relative line numbers on and off in the number column that will
     persist for all future game sessions until the toggle is selected again.
  4. 10 color theme options shall be available for selection within the game
     lobby that offer different text/background/highlight/status bar colors
     from common Vim configs.
  5. A scoring algorithm shall score each game session based on the codeblock's
     total character count, the number of starting errors, and the player's
     completion time, flagging impossibly fast completions as cheating.

- The MVP shall also be hosted with its own domain on an AWS EC2 instance.

### 8. Are there any products/apps that have similar parts to this app?

- Vim-racer.com
  - Only uses vim motions
  - does not appear to be using the real vim engine
  - it is not a typing speed test. The player only navigates to designated
    cursor positions. There is no typing involved.

- vimonlineeditor.com
  - Closest product to vimtype
  - Uses vim-wasm
  - Contains a functioning vim editor in the browser
  - Is not typing speed test. It is only a proof of concept.
  - It contains a changelog of updates that were necessary to get vim-wasm running.

### 9. What design methodology will be used?

- Agile is a common choice in the industry.
- From page 28 diagram from 648 notes, Evolutionary looks like the best fit to what
  I already had in mind (mostly due to the fact that specifications can be re-written
  with development and validation).
- Incremental seems to be a better compromise. Perhaps I should use Incremental with
  Evolutionary and Extreme SE (see p. 41)
- Some form of eXtreme Programming seems to offer the most flexibility and consistency
  which will be needed, as the exact requirements and specifications may not be known
  until after implementation and design starts.
- Kanban offers simple workflows and flexibility that should be easier and more
  efficient for a solo project. If paired with any of the other methodologies
  it can make for a realistic option within the project's two-month timeframe.

**Final Decision:**

- Kanban with the following Extreme Programming elements:
  1. Small commits
  2. Continuous refactoring
  3. Simple design (YAGNI)
  4. Automated tests
  5. Consistent coding standards

### 10. How will errors be displayed during a typing test?

**Vim renders the errors itself.** The left pane is real Vim painting pixels onto a
canvas — there is no DOM to style. Overlaying HTML on the canvas would mean
replicating Vim's glyph grid, font metrics, and scroll offset exactly, and would
break on every scroll. Instead the diff is computed in JS and pushed into Vim as Ex
commands via `vim.cmdline()`; Vim draws the result natively, so highlighting matches
the active theme and scrolls correctly for free. The vim-wasm renderer's `drawText`
already supports `underline`, `undercurl`, and `strike`, so this renders correctly.

- **Sign column** — `:sign place`, marking every line that is misplaced or contains
  an error.
- **Character-level underlining** — `matchaddpos()` with an undercurl highlight
  group. Matches are window-local and do **not** follow edits, so the loop is
  `clearmatches()` then re-add on every buffer change. Acceptable because the diff is
  recomputed on every change anyway.
- **Deferred:** text properties (`prop_add`) attach to the text and move with edits,
  which is more correct but more complex. Reach for them only if the
  clear-and-recompute loop shows visible latency.

**Errors are of two different kinds and must not contaminate each other:**

| Kind             | Examples                            | Rendering                        |
| ---------------- | ----------------------------------- | -------------------------------- |
| Content error    | misspellings, wrong characters      | per-character undercurl          |
| Whitespace error | wrong indent width, tabs vs. spaces | sign column + leading whitespace |

This follows from the existing rule that non-indentation characters are judged
against the correct line and indentation even when the line's position is wrong. It
implies the diff model compares each line as **two separate values: `(indent,
content)`**. The two error kinds should use **different colors** — they are different
mistakes requiring different fixes.

### 11. How will the right pane track the caret position of the left pane?

**The right pane is plain DOM, not a second Vim instance.** A second vim.wasm
instance would mean a second Web Worker, a second WASM module, and double the
memory, with no straightforward way to draw a tracking caret. As read-only display,
DOM gives syntax highlighting, selection control, and an absolutely-positioned caret
element for free.

**Caret tracking and error mapping are the same problem.** Both require a **line
alignment** between the player's buffer and the target: if the player has typed 7 of
15 lines, their line 5 may correspond to target line 6. The diff already produces
that alignment, so the caret reuses it — one source of truth, not two.

- The left-pane cursor is read via the `CursorMoved` / `CursorMovedI` autocmds
  reporting `line('.')` and `col('.')`.
- Line position maps through the diff's alignment; column maps by matched prefix
  length within the aligned line.
- **When the cursor sits on a line with no target counterpart** (a line the player
  invented), the caret **holds at the last aligned position and changes appearance**
  (hollow/dimmed). Rationale: advancing the caret to the "next" target line would
  imply the player should type that line, when in fact they need to fix or delete
  what they are on. Holding is honest — but a caret that merely stops moving reads as
  broken, so the visual state change is what makes it feel deliberate.

**Scrolling.** Because both panes must look and behave identically (see §17), a
codeblock taller than the pane creates a divergence risk: Vim scrolls the left pane
by its own rules (`zz`, `Ctrl-D`, `scrolloff`) while the DOM right pane does not
follow. The right pane must mirror Vim's top visible line (`line('w0')`) mapped
through the same alignment. **MVP simplification:** cap codeblock length so every
block fits the pane without scrolling, and defer this entirely.

### 12. How will terminal commands be restricted?

**This is a UX guardrail, not a security boundary.** The client is fully
attacker-controlled — dev tools can call `vim.cmdline()` directly. Command blocking
prevents accidents and casual cheating only. The real defense is server-authoritative
scoring (see [ARCHITECTURE.md](./ARCHITECTURE.md) §5).

- All Ex commands other than the write that ends the game are blocked.
- **Interception happens at the keystroke boundary, not inside Vim.** The hidden
  `<input>` that feeds vim-wasm is ours, so `:` is caught in JS before it reaches
  Vim, and a project-rendered command line is displayed in the status bar (see
  [Status bar](#status-bar)). This gives full control over what is accepted and
  allows the command line to be themed to match, rather than fighting Vim's own.
- **The target codeblock is never written into Vim's in-memory filesystem.** If it is
  not there, `:e`, `:r`, and similar have nothing to leak — an entire class of
  cheating is removed by construction rather than by blocklist.
- `:!cmd` is already inert: there is no shell in the browser build.

**Clipboard and registers.** Yanking and pasting must work _within_ the left pane
while the system clipboard stays unavailable. vim-wasm reads the system clipboard
only when `VimWasm.readClipboard` is assigned — leaving it (and `onWriteClipboard`)
unset disables the bridge while Vim's internal registers continue to work normally.
The `+` and `*` registers are then unavailable. The hidden `<input>` must also
`preventDefault()` on the DOM `paste` event so a browser-level paste cannot inject
text.

### 13. Where does the diff/LSP run — client, server, or both?

**Both, with different jobs.**

- **Client (WASM)** — live error feedback while typing. Latency requires it to be
  local; it is therefore untrusted.
- **Server (native C)** — authoritative final validation and scoring.

This split is the reason the scoring/LSP core is isolated behind ports
([ARCHITECTURE.md](./ARCHITECTURE.md) §5), with adapters for the native and WASM
builds. Both sides must run the **same comparison logic**, or a codeblock the client
calls complete will be rejected by the server.

### 14. What counts as a "complete" codeblock?

**Byte-exact match against the target.** The target is materialized per session
according to the player's lobby settings (tabs vs. spaces, indent-2 vs. indent-4),
and the right pane displays exactly the bytes being tested against — the format the
player configured, not a canonical form.

**Implication:** the stored codeblock is kept in one canonical form and _rendered_ to
the player's settings when the session starts. Client and server must use the
identical renderer, or byte-exact comparison will disagree between them.

### 15. How is time measured, and what happens when a session is suspended?

- **The clock starts on the player's first keypress** in the game session, not on
  page load.
- **A suspended session restarts.** There is no resumable state, no partial-progress
  persistence, and no rule preventing a player from starting a different codeblock.
- Because a restart is always available, the anti-cheat surface shrinks to timing
  analysis alone.

**Still to pin down:** what exactly counts as "suspended." A page reload clearly
restarts. Tab blur alone probably should not — that would be punishing during normal
use. This needs a precise definition before implementation.

### 16. How are themes defined across two rendering systems?

A theme must style **both** Vim's colorscheme (canvas, left pane) and the DOM right
pane. Defining them separately means maintaining twenty artifacts instead of ten and
guarantees drift.

**Each theme is defined once as data**, and both targets are generated from it: a Vim
colorscheme pushed in via `cmdline()`, and CSS custom properties for the right pane,
status bar, and navbar.

**Next step:** define the first theme and the template that future themes fill in.
The remaining nine are mechanical once the template exists.

### 17. What does the status bar display?

See [Status bar](#status-bar) under Gameplay.

Both panes must look and behave identically **except for error highlighting**, which
appears only in the left pane. Font, spacing, theme, line numbers, and indentation
rendering all match.

### 18. Which platforms are supported?

**Desktop only.** This is enforced with an explicit "desktop required" message rather
than allowing a mysterious failure.

The blocker is soft keyboards, not Vim. vim-wasm feeds Vim through
`notifyKeyEvent(key, keyCode, ...)` derived from DOM `keydown` events; mobile soft
keyboards route through the IME composition path and report `keyCode: 229` for
essentially every key, so Vim receives unusable input. Additionally there is no
`Esc` or `Ctrl` key, opening the keyboard resizes the viewport and churns vim-wasm's
`ResizeHandler`, and the two-pane layout does not fit a phone. Even if all of that
were solved, a soft keyboard makes a typing-speed score meaningless.

## Gameplay

### Game Lobby

#### There will be a toggles for:

- Tabs/Spaces
- Line numbers
- Relative line numbers
- indent-2/indent-4 (indentation width)

#### There will initially be 2 typing test programming languages available:

1. Javascript
2. Typescript

### Game session

- The game session will have 2 vertical panes that take up the entire width of
  the screen. The left pane will contain the player's current game state, while
  the right pane will contain the correct and complete code block that the player
  is attempting to fill in on the left pane. The right pane will also contain a
  caret that indicates the player's current position, relative to the left pane's
  caret position.

- The styles, formats, spacing, fonts, and themes will match real, popular configs
  from iTerm2 and Neovim.

- The left pane starts with just a function/class header/definition, and an empty
  body, enclosed in curly brackets (or whatever encapsulation symbol is relevant
  for the current language). The caret starts at the first character, after the
  function header, of the complete code block presented in the right pane.

- The left pane will have a partially correct code block, with LSP error
  underlining for misplaced/incorrect characters that do not match the right pane.
  The sign column (number column) will also be marked in the error color for each
  line that is incorrectly positioned and/or contains an error.

- Incorrect line and/or indentation positioning will not affect the non-indentation
  characters of each line (i.e. error underlining for characters that are not
  indentation characters will not occur strictly due to incorrect indentation). The
  LSP will always judge non-indentation/newline characters against the correct line
  and indentation, even if the line position and/or indentation is incorrect.

- The object of the game is for the player to make the left pane completely
  match the right pane, in as short of a time as possible. The game ends when
  the player has completely matched the left pane to the right pane and then
  has typed `:w` from **Normal Mode**.

- The code blocks will be different algorithms and data structure implementations,
  as well as common web dev boilerplate code. Each code block will be randomly
  selected before each game.

- Scoring will be determined based on the number of errors corrected within the
  session, as well as the total number of characters in the completed code block.
  Longer codeblocks will result in a higher score curve.

- Highscores of registered users will be recorded on a leaderboards table.

- Both panes look and behave identically, with one exception: error highlighting
  appears only in the left pane.

### Status bar

The status bar spans the full width beneath both panes and is divided into three
regions:

| Region | Contents                                             |
| ------ | ---------------------------------------------------- |
| Left   | Current Vim mode                                     |
| Center | Command-line input (e.g. `:write`, `:w`)             |
| Right  | Elapsed time · tabs or spaces · indent-2 or indent-4 |

The center region is rendered by the project, not by Vim. This pairs with the
decision in §12 to intercept `:` at the keystroke boundary: the same interception
that restricts commands also supplies the text this region displays, so a themeable
command line comes out of the restriction work rather than being extra effort.

### Cheating

**The answer is on screen by design.** The right pane displays the complete target,
so the player can always read — and select and copy — the solution. "Cheating"
therefore cannot mean _knowing_ the answer; it can only mean **producing input no
human could produce**. This reframes anti-cheat as timing and keystroke-rate
analysis.

- Text selection on the right pane is **not** blocked. A paste of the full solution
  produces an impossible keystroke interval and is trivially detectable at scoring
  time, so it is cheaper to catch than to prevent.
- All Ex commands other than the terminating write are blocked, and the system
  clipboard is disabled (see §12). These are guardrails against accidents and casual
  cheating, not a security boundary.
- The target codeblock is never placed in Vim's in-memory filesystem, removing an
  entire class of extraction.
- Scoring is **server-authoritative** and flags impossibly fast completions. This is
  the only defense that actually holds against a determined attacker, because the
  client is fully attacker-controlled.
