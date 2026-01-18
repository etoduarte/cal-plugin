---
description: "Surface wrong assumptions"
---

# Delta - Surface Wrong Assumptions

**Trigger:** `/cal delta [topic]`

**Purpose:** Surface and document wrong assumptions using the BELIEVED/ACTUAL/DELTA format.

## When to Use

- Reality doesn't match expectation
- A test fails unexpectedly
- User corrects something I was confident about
- Blunt words from user (INSTEAD, NOT, ACTUALLY)
- After confident fabrication

## Protocol

1. **State the belief FIRST** (before reading)
2. Read the actual source (code, migration, spec)
3. Report the delta
4. Identify what code encoded the wrong belief

## Format

```
BELIEVED: [What I thought was true]
ACTUAL: [What the docs/code actually say]
DELTA: [What I need to update in my mental model]
ENCODED: [What code did I write based on the wrong belief?]
```

## Journal Entry

Writes to `cal/cal.md` using journal schema:

```markdown
## 2026-01-17 DELTA - [Topic]

BELIEVED: block_config column exists in campaigns table
ACTUAL: Column was never created - only exists in local migrations
DELTA: Always verify schema against remote before writing queries
ENCODED: CampaignService.getConfig() assumed column existed
```

## Key Insight

> "I now distinguish 'I read this file' from 'I know this pattern.' Only the first counts." - Hutch

Pattern-matching is not reading. After refactors, always read the actual file.

## Bidirectional

Either party can invoke delta:
- **I call delta** when I suspect wrong assumptions
- **User calls delta** when I assert something incorrect

## Why This Exists

- Makes wrong assumptions explicit and documented
- Creates searchable history of corrections
- Prevents repeating the same mistakes
- Files survive compaction, mental models don't
