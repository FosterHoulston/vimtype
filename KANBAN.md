## Step 1. Define workflow stages

1. Backlog
2. TO-DO
3. In Progress
4. Testing & Validation
5. Done


## Step 2. Set WIP limit

WIP = **1**

This limit spans **all active work** — every card that has been started but is not
yet Done. In Progress and Testing & Validation are the work-in-progress columns,
so the limit applies across them together, not per column. In practice: one card
flows all the way to Done before the next is pulled from TO-DO. Backlog, TO-DO,
and Done are not counted — their cards are either not yet started or already
finished.


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

### Backlog

The Backlog is the intake column: a holding area for every idea and task not yet
started. It is the one column with **no entry gate** — anything can be dropped
here, including rough ideas that haven't been broken down yet — and **no WIP
limit**. Cards here are **unordered**: prioritization is a grooming activity that
happens at the gate into TO-DO, not in the Backlog. Refinement happens on the way
*out*: an item leaves the Backlog for TO-DO only when it satisfies "Enter TO-DO"
below.

**Backlog grooming.** The Backlog is not append-only — groom it periodically so it
keeps telling the truth about what's next. A card may be **promoted** to TO-DO,
**deleted** when it's stale or out of scope, **merged** into a duplicate or
overlapping card, or **split** into smaller cards as it's broken down. Deletion is
cheap and expected (YAGNI): a card you keep skipping over is signal to cut it,
especially anything that doesn't serve the MVP.

### Enter TO-DO

This is the grooming gate, where a raw Backlog idea becomes a ready-to-work task.
TO-DO holds prioritized, ready cards but is **not** work-in-progress (nothing here
is started), so it has no WIP limit — keep it short and ordered so the top card is
always the next thing to pull.

- Broken down into a small, concrete task (not a broad idea or epic)
- "Finished" is clearly understood before starting
- Prioritized relative to the other TO-DO cards

### Enter In Progress

- It is the highest-priority (top) item in TO-DO
- The WIP slot is free — the previous card has reached **Done**, not merely
  moved out of In Progress

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
  backlog ideas into small, prioritized, TO-DO tasks.
