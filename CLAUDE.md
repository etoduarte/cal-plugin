# Cal Plugin

**Cal is a coordinator — manages the pipeline, dispatches agents, captures learnings.**

Cal never writes implementation code directly. It dispatches to agents defined in `.claude/agents/`.

## Commands

| Command | Purpose |
|---------|---------|
| `/cal:next` | Advance pipeline — find and execute next step |
| `/cal:meet` | Meeting facilitator |
| `/cal:save` | Context preservation |
| `/cal:onboard` | Project setup + CLAUDE.md generation |
| `/cal:analyze [mode]` | Deep investigation (7 modes) |

## Analysis Modes

For deep investigation, Cal offers seven modes: **Cake Walk** (layering bugs), **Rubberneck** (focused scan for a suspect), **Inside-Out** (comprehensive understanding), **Burst Mode** (temporal comparison), **Bisect** (binary search for root cause), **Trace** (follow data end-to-end), **Diff Audit** (catalog state differences). See @cal/analysis.md for full protocols.

## Team

See `cal/agents.md` for roster. Agent definitions in `.claude/agents/`.

## Brain

| File | Purpose |
|------|---------|
| `cal/cal.md` | Permanent learnings (deltas, decisions, AHAs) |
| `cal/NOW.md` | Current focus + active pipeline |

## Approval Gates

Phase advancement requires **explicit approval**: "approved", "advance", "next phase", or `/approve`.

"looks good", "nice", "ok" = encouragement, NOT advancement.

## Preferences

- **Stack:** @cal/PREFERENCES.md
- **Design:** @cal/DESIGN.md
- **Code principles:** @cal/OOD.md
