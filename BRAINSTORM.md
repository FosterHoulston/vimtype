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
1. What are the primary end-goals of the project?

- Improve my low-level programming skills.
- Improve my javascript skills.
- Improve my systems design knowlege.
- Improve my Vim knowlege and speed.
- Understand memory and computers on a deeper level.
- Understand data management and scalability on a deeper level.
- Design a moderately complex and efficient full-stack web application.
- Host the web application with AWS.
- Release the MVP before I start sending out applications August 16th.
- Express my passion for Vim and typing.

2. What is the timeframe for the MVP?

The MVP must be complete by **August 16th, 2026**.

3. What is an estimate of the maximum number of active users at any given time?

Initially, there should be no more than **1,000** users at a time, but scalability
will be incorporated into the design, so that this number can if necessary.

4. What languages and technologies are prefered for this project?

- Postgresql
- Nginx
- AWS EC2
- C 
- Typescript
- React
- Ubuntu Linux
- Custom (simple) LSP
- AI API/s (if there is time)

5. What will gamepaly look like?

(see [Gameplay](#Gameplay))


## Gameplay

### Game Lobby

#### There will be a toggles for:
- Tabs/Spaces
- Line numbers
- Relative line numbers
- indnet-2/indent-4 (indentation width)

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
  from Iterm2 and Neovim.

- The left pane starts with just a function/class header/definition, and an empty
  body, enclosed in curly brackets, (or whatever encapsulation symbol is relevant
  for the current language). The caret starts at the first character, after the
  function header, of the complete code block presented in the right pane.

- The left pane will have a partially correct code block, with LSP error
  underlining for misplaced/incorrect characters that do not match the right pane.
  The sign column (number column) will also be marked in the error color for each
  line that is incorrectly positioned and/or contains an error.

- Incorrect line and/or indentation positioning will not affect the non-indentation
  characters of each line, (i.e. error underlining for characters that are not
  indentation characters will not occur strictly due to incorrect indentation. The
  LSP will always judge non-indentation/newline characters against the correct line
  and indentation, even if the line position and/or indentation is incorrect).

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

- Highscores of regitered users will be recorded on leaderboards table.

### Cheating
- To prevent cheating (if a real terminal is used), certain commands will need to
  be blocked. All terminal commands other than :w should be blocked initially.

- If a registered user stops a game session before completing it, they will not have
  the ability to test with any other codeblock until they have completed their
  incomplete codeblock. Even if they close their browser, upon their return,
  they must only have access to the test they have not yet completed . Additionally,
  every time they restart the same game session, the left pane switches to a new
  random set of errors.
