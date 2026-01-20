---
description: "Interactive review of Cal files for cleanup"
argument-hint: ""
---

# Prune - Interactive Cleanup Review

**Trigger:** `/cal:prune`

**Purpose:** Review Cal files with the user to identify what can be cleaned up.

## What It Does

1. **Scans** cal/ directory for size and staleness
2. **Reports** findings to user
3. **Presents** options for each concern
4. **User decides** — prune never auto-deletes

## Scan Targets

### cal/cal.md (Journal)

Check line count against 300-line target.

If over:
```
cal/cal.md is [X] lines (target: <300)

Potential cleanup:
- [N] SESSION entries (likely stale if >7 days old)
- [N] entries without clear type (may be misrouted)

Review these? [Y/n]
```

### cal/memories/ (Session Context)

Check for files older than 7 days.

If found:
```
Found [N] memory files older than 7 days:
- 2026-01-10.md (9 days old, 45 lines)
- 2026-01-08.md (11 days old, 120 lines)

These are session context snapshots. Usually safe to delete after a week.

Delete all? Delete selectively? Keep all? [d/s/k]
```

### cal/archive/ (Opt-In Storage)

Check for files past their revisit date or without action items.

If found:
```
Found [N] archive files that may be stale:
- 2026-01-05-edge-cases.md — no "revisit by" date
- 2026-01-02-coupling-analysis.md — revisit date passed

Review each? [Y/n]
```

## Review Flow

For journal entries flagged for review, present each with options:

```
## 2026-01-12 SESSION - Auth implementation

**Working on:** OAuth flow
**Branch:** feature/auth
[... content ...]

This is a 10-day-old session save.

Options:
1. Delete (session context, now stale)
2. Extract → move learning to delta/AHA, delete rest
3. Keep (still relevant)
4. Skip (decide later)

Choice: [1/2/3/4]
```

## What to Look For

### Likely Safe to Delete

- SESSION entries older than 7 days
- "Answered questions" sections
- Agent review outputs that were never extracted
- Duplicate information (same learning recorded twice)

### Likely Keep

- Deltas (timeless lessons)
- AHAs (core insights)
- Memories (user patterns)
- Decisions with rationale

### Extract Then Delete

- Session saves with buried insights
- Long entries where 2 lines capture the learning

## After Pruning

Report results:
```
Prune complete:
- Deleted: [N] entries ([X] lines)
- Extracted: [N] learnings
- Kept: [N] entries
- cal/cal.md: [X] → [Y] lines

Journal health: [Good/Review again soon]
```

## Triggers

Run `/cal:prune` when:
- cal/cal.md exceeds 300 lines
- Starting a new project phase
- Context feels cluttered
- Before a long break

## Why This Exists

- **Interactive** — User decides, Cal doesn't auto-delete
- **Guided** — Cal identifies candidates, user approves
- **Educational** — Process teaches what belongs where
- **Sustainable** — Regular pruning prevents 1500-line journals
