---
description: "Advance the pipeline - find and execute next step"
allowed-tools: ["Read", "Write", "Edit", "Task", "AskUserQuestion", "Bash", "Glob"]
---

# Next - Advance the Pipeline

**Trigger:** `/cal:next`

**Purpose:** Find the next step in the pipeline and execute it.

## Protocol

1. **Read state**
   - Check `ideas/` for active idea folders
   - Read active idea's `STATUS.md` for current phase
   - Read `cal/NOW.md` for current focus
   - Read `cal/team.md` for available agents

2. **Determine next action**

   | Current Phase | Next Action | Gate |
   |---------------|-------------|------|
   | HOPPER | Pull idea from `cal/hopper.md` → create folder | — |
   | BRAINSTORM | Write `01-brief.md` | User says "approved"/"advance"/"next phase"/`/approve` |
   | BRD | Write `02-brd.md` | User says "approved"/etc → **commit + push** |
   | LISA | Run Lisa interview → `03-stories.md` | Cal approves → **commit + push** |
   | RALPH | Dispatch Coder via Ralph Loop | Tests pass → **commit + push** |
   | TRIAGE | Dispatch Reviewer | Reviewer says "approved" → **commit + push** |
   | SHIP | Merge to main | Deploy verified |
   | ARCHIVE | Move folder to `archive/[date]-[name]/` | — |

3. **Execute phase gates**

   When a phase completes:
   ```bash
   git add ideas/[name]/
   git commit -m "[phase] [idea-name]: [summary]"
   git push
   ```

   Then update `STATUS.md` with gate checkmark.

4. **Execute or dispatch**
   - If Cal's phase (BRAINSTORM, BRD) → Cal executes
   - If plugin phase (LISA, RALPH) → Invoke plugin
   - If agent's phase (TRIAGE) → Dispatch to Reviewer

5. **Update state**
   - Update idea's `STATUS.md` with progress
   - Update `cal/NOW.md` with current focus
   - If learning emerged → append to `cal/cal.md`

## Creating a New Idea Folder

When pulling from hopper:

```bash
cp -r ideas/.template ideas/[idea-name]
```

Then update `STATUS.md` with idea name and set phase to BRAINSTORM.

## Dispatch Format

When dispatching to an agent:

```
Context:
- Idea: [folder name]
- Phase: [current phase]
- Task: [specific work]

Files to read:
- ideas/[name]/STATUS.md
- ideas/[name]/[relevant docs]

Goal: [specific deliverable]

When done: Update STATUS.md, report outcome
```

## Key Rules

- **Never skip phases** - Pipeline flows forward only
- **Commit at every gate** - No uncommitted phase transitions
- **Cal never codes** - Dispatch to Coder via Ralph
- **One idea at a time** - Complete current before starting new
- **Folder is the unit** - All docs stay together

## Output

After each `/cal:next`:

```
## Status

**Idea:** [folder name]
**Phase:** [current phase]
**Action taken:** [what was done]
**Gate:** [passed / pending approval]
**Committed:** [yes / no]
**Next:** [what happens next]
```
