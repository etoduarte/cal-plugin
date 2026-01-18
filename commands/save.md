---
description: "Context preservation"
argument-hint: "[type] [content]"
---

# Save - Context Preservation

**Trigger:** `/cal:save [type] [content]`

**Purpose:** Preserve context to `cal/cal.md` using the journal entry schema.

## Usage

```bash
# Quick entries (uses SAVE type)
/cal:save "decision to use X over Y"

# Explicit types
/cal:save delta "BELIEVED: X, ACTUAL: Y"
/cal:save decision "chose snapshot architecture for SSC-R1"
/cal:save session  # Full context dump

# With topic
/cal:save delta auth "tokens expire after 1 hour not 24"
```

## Journal Entry Schema

All entries follow this format:

```markdown
## [ISO-8601-DATE] [TYPE] - [TOPIC]

[Content]
```

### Types

| Type | When to Use | Format |
|------|-------------|--------|
| `SAVE` | General context preservation | Free text |
| `DELTA` | Wrong assumption surfaced | BELIEVED/ACTUAL/DELTA |
| `DECISION` | Choice made with rationale | Choice + rationale |
| `SESSION` | Full state dump before context loss | Structured template |

### Examples

```markdown
## 2026-01-17 SAVE - Auth implementation

Completed OAuth flow integration with Google. Token refresh handled in middleware.

---

## 2026-01-17 DELTA - Database schema

BELIEVED: block_config column exists
ACTUAL: Column was never created
DELTA: Always verify schema before writing queries

---

## 2026-01-17 DECISION - Architecture

Chose snapshot-based architecture (SSC-R1) over entity-based.
Rationale: Snapshots provide immutable history, entities derive at runtime.
Revisit-if: Performance issues with large snapshot counts.

---

## 2026-01-17 SESSION - Context preservation

**Working on:** Cal 2.0 implementation
**Branch:** main
**Uncommitted:** Yes (Phase 1 complete)

### This Session
- Completed Phase 0: Foundation (F-1 through F-5)
- Completed Phase 1: Simplification (S-1 through S-7)
- Commands reduced from 16 to 7

### Resume With
- Start Phase 2: Core Enhancement
- Next: E-1 Polish meet.md

### Hot Context
- Hard line: Cal has NO execution, only coordination
- Role manifest maps roles to agents
- Context-aware check reads cal/ artifacts
```

## Session Save

Triggered when:
- Context is low (~15%)
- Switching tasks
- Before significant break
- User explicitly requests

Session saves capture full state for seamless resume.

## Where Entries Go

All entries append to `cal/cal.md`. If the file doesn't exist, create it with a header:

```markdown
# Cal Journal

Project: [Project name]
Created: [Date]

---

[Entries follow]
```

## Why This Exists

- Files survive compaction, conversation doesn't
- Schema makes entries parseable and searchable
- Session saves preserve more than auto-compaction
- Consistent format enables tooling later
