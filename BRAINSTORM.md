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
     is displayed, aswell as a tracking caret.
  3. game results
  4. leaderboards
  7. rules

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
  6. A scoring algorithm shall score each game session based on the codeblock's
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

### Cheating
- To prevent cheating (if a real terminal is used), certain commands will need to
  be blocked. All terminal commands other than :w should be blocked initially.

- If a registered user stops a game session before completing it, they will not have
  the ability to test with any other codeblock until they have completed their
  incomplete codeblock. Even if they close their browser, upon their return,
  they must only have access to the test they have not yet completed. Additionally,
  every time they restart the same game session, the left pane switches to a new
  random set of errors.
