## Step 1. Define workflow stages

1. Backlog
2. In Progress
3. Testing & Validation
4. Done


## Step 2. Set WIP limit

WIP = **1**


## Step 3. Create a card for each task


## Step 4. Move work through each stage

Each transition has **exit criteria**: a card may only move right when it
satisfies the checklist for the stage it is entering. Treat these as a
yes/no gate, not a judgment call.

### Definition of Done (applies to every card)

These must hold before any card reaches **Done**, in addition to the
stage-specific criteria below:

- Follows [Coding Standards](./CODING_STANDARDS.md)
- Committed using the project's commit message conventions
- Tests pass; new behavior is covered where tests apply

### Enter In Progress

- Broken down into a small, concrete task (not a broad idea or epic)
- It is the highest-priority item in the Backlog
- "Finished" is clearly understood before starting
- The WIP slot is free (the previous card has left In Progress)

### Enter Testing & Validation

- Code is written and compiles/runs
- Changes are committed
- Self-reviewed — the diff is in a state you'd be comfortable sharing

### Enter Done

- Behavior verified against what the card asked for
- No known regressions introduced -- No prior features have broken 
  due to the new changes
- Definition of Done (above) is satisfied
- Merged to `main`; nothing left to "clean up later"


## Step 5. Use the board to spot bottlenecks and improve over time

- If cards pile up *before* a column, that column's entry bar — or the
  work feeding it — is the bottleneck. Investigate there first.

## Additional Notes

- The project can start right away and does not need any requirments
  to start. Just add ideas to the backlog and then break down the
  backlog ideas into small, prioritized, In Progress tasks.
- 
