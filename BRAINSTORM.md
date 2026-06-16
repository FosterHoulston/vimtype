## Entry point for the design process

### Decisions that need to be made (unordered)
- What design methodology will be used?
- Are there any products/apps that have similar parts to this app?
- What is the timeframe for the MVP?
- Am I implementing a real terminal in the browser, or am I creating an emulation?
- What will gameplay look like?
- What are the primary end-goals of the project?
- What languages and technologies are prefered for this project?
- What will the MVP look like?
- What is an estimate of the maximum number of active users at any given time?

### Decisions that need to be made (ordered and answered)
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


### Gameplay

##### Game Lobby
The game lobby

##### Game session
The game session will have 2 vertical panes that take up the entire width of
the screen. The left pane will contain the player's current game state, while
the right pane will contain the correct and complete code block that the player
is attempting to fill in in the left pane. The right pane will also contain a 
caret that indicates the player's current position, relative to the left pane's
caret position.

The styles, formats, spacing, fonts, and themes will match real, popular configs
from Iterm2 and Neovim.

There will be 2 primary game modes:
1. Fill-In Mode
2. Fix Mode

There will be a toggles for:
- Tabs/Spaces
- Line numbers
- Relative line numbers
- indnet-2/indent-4 (indentation width)

There will initially be 2 typing programming languages:
1. Javascript
2. Typescript

##### Cheating
To prevent cheating (if a real terminal is used), certain commands will need to
be blocked. All terminal commands other than :w should be blocked initially.
