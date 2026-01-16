---
description: "Cal toolkit documentation"
---

# Cal's Toolkit - Help

## Commands

| Command | Purpose |
|---------|---------|
| `/cal:fly` | Accept story, proceed (**THE** acceptance signal) |
| `/cal:check` | Verify before action |
| `/cal:review` | Quality gate after action |
| `/cal:squirrel` | Stop drifting, refocus |
| `/cal:delta` | Surface wrong assumptions |
| `/cal:save` | Context preservation |
| `/cal:reset` | Nuclear context reset |
| `/cal:inside-out` | Deep understanding protocol |

## Quick Reference

```
/cal:fly              - Accept and advance
/cal:check            - Verify before starting
/cal:review           - Quality gate after finishing
/cal:review atomizer  - Run specific agent
/cal:squirrel         - Stop and refocus
/cal:delta            - BELIEVED/ACTUAL/DELTA/ENCODED
/cal:save             - Quick log to cal.md
/cal:save session     - Full state dump
/cal:save listen "x"  - Start active listening
/cal:reset            - Nuclear option
/cal:inside-out       - Deep understanding (extensive → condensed)
```

## User Signals

| Signal | Meaning | Action |
|--------|---------|--------|
| "fly" | **ACCEPTANCE** | Advance workflow |
| "looks good", "nice" | **PROGRESS** | Continue current work |

**Only "fly" advances.** Everything else = keep going.

## Workflow

```
/cal:check → implement → /cal:review → /cal:fly → next
```

## Execution Gate

Outside Ralph loop: **STOP.** Get explicit permission before implementing user stories.
