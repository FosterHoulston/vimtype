# Vimtype Vision

## North-star product definition
Vimtype adds a new test mode, **Algorithms (Vim Mode)**, to a Monkeytype fork.

### MVP definition
- Users see a full algorithm solution and must finish with buffer == target solution.
- Editor behaves like Vim Level 2: Normal + Insert + Visual (char/line).
- Real Vim keys are supported (hjkl, i/a/o, dd/dw, etc.).
- Scoring/metrics are identical to Monkeytype (WPM/raw/accuracy/consistency/char stats).
- Anti-cheat philosophy stays aligned with Monkeytype (no command-error metrics).

### Non-goals (scope protection)
- Not a full Vim clone (no macros, registers, plugins, ex commands).
- No mechanics that insert multiple characters per keypress in MVP.
- No alternate scoring based on Vim command errors.

### Content constraints
- Algorithms are public-domain and fully authored (no external IP).
- Prompts are full solutions with no pseudocode or comments.
