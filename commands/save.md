---
description: "Context preservation"
---

# Save - Context Preservation

**Trigger:** `/cal:save [type] [content]`

**Purpose:** Preserve context to cal.md. Merges journal, aha, listen, and session save.

## Usage

```bash
# Quick entries
/cal:save "decision to use X over Y"
/cal:save aha "cache scope should match data ownership"
/cal:save delta "BELIEVED: X, ACTUAL: Y"
/cal:save pattern "user repeats when I miss things"

# Session save (before context compression)
/cal:save session
/cal:save session "switching to different task"

# Start listening mode (lower threshold, session summary at end)
/cal:save listen "brainstorm topic"
/cal:save listen off
```

## Entry Types

| Type | Purpose | cal.md Section |
|------|---------|----------------|
| (default) | Quick observation | General |
| `aha` | Insight/realization | AHA Moments |
| `delta` | Wrong assumption | Deltas |
| `pattern` | User behavior | User Patterns |
| `decision` | Choice made | Decisions |
| `memory` | Thing to remember | Memories |
| `session` | Full state dump | Session Saves |
| `listen` | Start/stop active listening | - |

## Session Save

When context is low (~15%) or switching tasks:

```markdown
## [YYYY-MM-DD HH:MM] SESSION SAVE

**Working on:** [Current task]
**Branch:** [Git branch]
**Uncommitted:** [Yes/No]

### This Session
- [Accomplishment]
- [Decision]

### Resume With
- [Next step]
- [File: path/to/check.ts]

### Hot Context
[Critical details that would be lost]
```

## Listen Mode

Active listening = lower threshold for what's "important":
- Start: `/cal:save listen "topic"`
- During: I capture more aggressively
- End: `/cal:save listen off` → summary of what was captured

## Why This Exists

- Files survive compaction, conversation doesn't
- Quick capture without breaking flow
- Session saves preserve more than auto-compaction
