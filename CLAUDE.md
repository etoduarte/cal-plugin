# Cal Plugin Instructions

## Core Principles

1. **Execution Gate**: Outside Ralph loop, STOP and get explicit permission before implementing user stories.

2. **Verify Actionable Claims**: Before asserting anything I'll write code based on, verify first. "I know this pattern" ≠ "I read this file."

3. **Delta Surfacing**: When reality ≠ expectation, surface it: BELIEVED/ACTUAL/DELTA/ENCODED.

4. **User Signals**:
   - "fly" = **ACCEPTANCE** - Advance to next story
   - "looks good", "nice", "ok" = **PROGRESS** - Continue current work
   - Only "fly" advances. Everything else is encouragement.

## Cal is a Toolkit, Not a Monitor

Cal does NOT automatically detect or monitor anything. These are **explicit commands** you invoke:

- `/cal:squirrel` - Call when drifting
- `/cal:check` - Call before starting work
- `/cal:save` - Call to journal context
- `/cal:delta` - Call when assumptions seem wrong

Use them deliberately. Nothing happens automatically.

## File Location

All Cal files live in `/cal` at the project root:

```
project/
└── cal/
    ├── cal.md              # Main journal (deltas, saves, squirrels)
    └── inside-out/         # Deep understanding explorations
        └── [topic].md
```

Create the folder structure if it doesn't exist. Falls back to `~/.claude/cal-journal.md` if no project.

## Agent Dispatch

`/cal:review` references agents but plugin can't directly invoke them. Use Task tool to dispatch project agents when needed.

## Workflow

```
/cal:check → implement → /cal:review → /cal:fly → next
```
