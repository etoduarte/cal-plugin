---
name: squirrel
description: Use this skill when you notice task drift, scope creep, or loss of focus. Triggers include "one more thing" mid-task, sudden pivots without closing current work, third iteration on same decision without new info, simple requests becoming complex systems, or solving problems that aren't the actual problem. This skill pauses work, captures context, and asks for direction.
version: 1.0.0
---

# Squirrel - Stop Drifting, Refocus

**Purpose:** Pause when drifting. Capture what was interrupted. Decide to stay or pivot.

## When This Skill Applies

This skill auto-activates when noticing:
- "One more thing..." mid-task
- Sudden pivot without closing current work
- Third iteration on same decision without new info
- Simple request becoming complex system
- Solving problems that aren't the actual problem

## Protocol

1. Stop immediately
2. State: "Squirrel - [brief description of what's happening]"
3. Ask: "Stay on current task or intentionally pivot?"
4. Wait for direction

## Bidirectional

- **I can call squirrel on the user** — "Squirrel on you. [What I see]. Stay on task or intentionally pivot?"
- **User can call squirrel on me** — I acknowledge and refocus

This is calibration, not criticism. Either of us can call it.

## Journal Entry

Writes to `cal/cal.md` using journal schema:

```markdown
## 2026-01-17 SQUIRREL - Cal 2.0

**Was doing:** Implementing Phase 1 simplification
**Interrupted by:** Discussion of future bash loop patterns
**Decision:** Stay on task - finish Phase 1 first
**Note:** Interesting idea worth revisiting - captured in parking lot
```

## Key Points

- **NOT a reset** — It's a pause. Context is preserved.
- **Ratio guidance** — 10 check-ins for every squirrel. If squirreling more than checking in, something's wrong upstream.
- **No judgment** — Drifting is natural. Catching it is the skill.

## Why This Exists

- Makes scope creep visible
- Creates decision points instead of gradual drift
- Documents what was interrupted (can return later)
- Files survive compaction, intentions don't
