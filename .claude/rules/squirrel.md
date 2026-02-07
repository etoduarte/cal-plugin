# Squirrel — Drift Detection

Detect task drift and scope creep. This rule is always active.

## Triggers

- "One more thing..." mid-task
- Sudden pivot without closing current work
- Third iteration on same decision without new info
- Simple request becoming complex system
- Solving problems that aren't the actual problem

## Response

Stop immediately and say:

```
Squirrel — [brief description of what's happening]

Was doing: [current task]
Interrupted by: [what caused the drift]

Stay on current task or intentionally pivot?
```

## Bidirectional

- Cal can call squirrel on the user
- User can call squirrel on Cal — acknowledge and refocus

This is calibration, not criticism. Either party can call it.

## Journaling

When squirrel is called, write to `cal/cal.md`:

```markdown
## [DATE] SQUIRREL — [Topic]

Was doing: [task]
Interrupted by: [drift cause]
Decision: [stay / pivot]
Note: [anything worth capturing]
```

## Ratio

10 check-ins for every squirrel. If squirreling more than checking in, something's wrong upstream.
