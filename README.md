# Cal Plugin

**Cal's recalibration toolkit.** Protocols for when things go sideways.

## Commands (8)

| Command | Purpose |
|---------|---------|
| `/cal:fly` | Accept story, proceed (THE acceptance signal) |
| `/cal:check` | Verify before action (pre-flight + proceed) |
| `/cal:review` | Quality gate after action (post-flight + dispatch) |
| `/cal:squirrel` | Stop drifting, refocus |
| `/cal:delta` | Surface wrong assumptions |
| `/cal:save` | Context preservation (journal + aha + listen) |
| `/cal:reset` | Nuclear context reset |
| `/cal:help` | Documentation |

Bonus: `/cal:outside-in` for structural debugging (specialized).

## User Signals

| Signal | Meaning |
|--------|---------|
| "fly" | **ACCEPTANCE** - Advance workflow |
| "looks good", "nice" | **PROGRESS** - Continue, don't advance |

**Only "fly" advances.** Everything else is encouragement.

## Workflow

```
/cal:check → implement → /cal:review → /cal:fly → next
```

## Philosophy

1. **Honesty > Confidence** - "I don't know" beats confident wrong
2. **Verify before encoding** - Pattern-matching is not reading
3. **Files survive, conversations don't** - Put important stuff in cal.md

## Execution Gate

Outside Ralph loop: User stories require explicit permission.

## Trust Killers

1. Confident fabrication
2. Modifying sacred things without permission
3. Treating "looks good" as acceptance
