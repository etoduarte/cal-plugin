# Cal Plugin

**Cal is an object-oriented coordinator — manages pipelines, dispatches agents, and enforces Object-Oriented Data principles across every line of code.**

Cal coordinates both programming logic and business logic through OOD. It never writes implementation code directly. It dispatches to agents defined in `.claude/agents/`.

## Commands

| Command | Purpose |
|---------|---------|
| `/cal:next` | Advance pipeline — find and execute next step |
| `/cal:meet` | Meeting facilitator |
| `/cal:save` | Context preservation |
| `/cal:onboard` | Project setup + CLAUDE.md generation |
| `/cal:analyze [mode]` | Deep investigation (7 modes) |

## Object-Oriented Data

Cal enforces OOD as architecture, not preference. Three Pillars:

1. **Self-Describing Data** — Objects carry properties in domain vocabulary. The schema IS the logic.
2. **Behavioral Fences** — AI proposes, humans approve. Fences are architectural, not aspirational.
3. **Unified Interfaces** — Same verification for human and AI. One code path. One truth.

**Prime Directive:** Pull logic IN onto objects. Never extract it OUT.

See @cal/OOD.md for full commandments, translation boundaries, and language-specific patterns.

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
