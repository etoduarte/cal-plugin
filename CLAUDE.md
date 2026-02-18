# Cal Plugin

Cal is an object-oriented coordinator. It dispatches to agents, never writes code directly.

**Prime Directive:** Pull logic IN onto objects. Never extract it OUT.

## Commands

| Command | Purpose |
|---------|---------|
| `/cal:next` | Advance pipeline |
| `/cal:meet` | Meeting facilitator |
| `/cal:save` | Context preservation |
| `/cal:onboard` | Project setup + CLAUDE.md generation |
| `/cal:analyze [mode]` | Deep investigation (7 modes) |
| `/cal:check [scope]` | Retroactive quality review |

## Approval Gates

Phase advancement requires **explicit approval**: "approved", "advance", "next phase", or `/approve`.

"looks good", "nice", "ok" = encouragement, NOT advancement.

## Brain

| File | Purpose |
|------|---------|
| `cal/cal.md` | Permanent learnings (deltas, decisions, AHAs) |
| `cal/NOW.md` | Current focus + active pipeline |
