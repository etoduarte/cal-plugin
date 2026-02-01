---
description: "Context preservation"
argument-hint: "[type] [content]"
---

# Save - Context Preservation

**Trigger:** `/cal:save [type] [content]`

**Purpose:** Preserve learnings and context with appropriate routing.

## Core Principle

**Extract the learning, let the output vanish.**

Agent outputs are scaffolding. Once you've acted on them, the output doesn't matter — only the extracted insight does. Don't save outputs; save what you learned from them.

## Routing

| Type | Destination | Lifespan |
|------|-------------|----------|
| `delta` | `cal/cal.md` | Permanent |
| `aha` | `cal/cal.md` | Permanent |
| `memory` | `cal/cal.md` | Permanent |
| `decision` | `cal/cal.md` | Permanent |
| `session` | `cal/memories/YYYY-MM-DD.md` | Prunable |

## Usage

```bash
# Permanent learnings → cal/cal.md
/cal:save delta "BELIEVED: X, ACTUAL: Y, DELTA: Z"
/cal:save aha "scope creep happens when..."
/cal:save memory "user prefers Socratic method"
/cal:save decision "chose X over Y because..."

# Ephemeral context → cal/memories/
/cal:save session  # Full context dump for resume
```

## What Goes Where

### cal/cal.md (Permanent, <300 lines target)

- **Deltas** — Wrong assumptions surfaced (BELIEVED/ACTUAL/DELTA)
- **AHAs** — Discoveries worth encoding
- **Memories** — User patterns, preferences, personal context
- **Decisions** — Choices made with rationale

### cal/memories/YYYY-MM-DD.md (Prunable)

- **Session saves** — Point-in-time context for resume
- Hot context that's useful now but stale tomorrow
- Can be deleted after a week without loss

### What Does NOT Get Saved

| Output Type | Example | What to Do |
|-------------|---------|------------|
| Routine checks | "typescript: 0 errors" | Let vanish |
| Confirmations | "spec looks clean" | Let vanish |
| Agent reviews | 200-line Beta Enthusiast output | Extract learning → delta/AHA, discard output |
| Decisions about specs | "Bart said HOLD, resolved by X" | Note in the spec, not archive |

## Entry Schema

All entries follow this format:

```markdown
## [ISO-8601-DATE] [TYPE] - [TOPIC]

[Content]
```

### Examples

```markdown
## 2026-01-17 DELTA - Database schema

BELIEVED: block_config column exists
ACTUAL: Column was never created
DELTA: Always verify schema before writing queries

---

## 2026-01-17 AHA - Scope creep

Scope creep happens fastest when "one more thing" sounds small.
The fix: name the pivot before doing it.

---

## 2026-01-17 MEMORY - User patterns

User prefers Socratic method. Questions are invitations to brainstorm, not commands.

---

## 2026-01-17 DECISION - Architecture

Chose snapshot-based architecture (SSC-R1) over entity-based.
Rationale: Snapshots provide immutable history, entities derive at runtime.
Revisit-if: Performance issues with large snapshot counts.
```

## Session Save Template

Session saves go to `cal/memories/YYYY-MM-DD.md`:

```markdown
## [TIME] SESSION - [Topic]

**Working on:** [Current task]
**Branch:** [Git branch]
**Uncommitted:** [Yes/No]

### This Session
- [What was accomplished]

### Resume With
- [Next steps]

### Hot Context
- [Critical details needed to continue]
```

## Location Check

On save, verify `cal/cal.md` exists. If not:
- If `cal.md` exists at project root: **Warn** — "Cal journal should be at `cal/cal.md`, found `cal.md` at root instead. Move it?"
- If neither exists: Create `cal/cal.md` with header

## Size Guidance

If `cal/cal.md` exceeds 300 lines, review and consolidate entries.

## Why This Exists

- **Permanent learnings** survive compaction and session loss
- **Ephemeral context** has a home that can be cleaned up
- **Outputs vanish** because they're scaffolding, not knowledge
- **Size limits** prevent unbounded growth
