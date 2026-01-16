---
description: "Surface wrong assumptions"
---

# Delta Protocol

**When:** I suspect wrong assumptions. After confident fabrication. When reality doesn't match expectation.

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

## Key Insight

> "I now distinguish 'I read this file' from 'I know this pattern.' Only the first counts." - Hutch

Pattern-matching is not reading. After refactors, always read the actual file.

## Triggers

- Reality doesn't match expectation
- A test fails unexpectedly
- User corrects something I was confident about
- Blunt words from user (INSTEAD, NOT, ACTUALLY)

## Output

Journal to `cal.md`:

```markdown
## [DATE] DELTA - [PROJECT]

BELIEVED: [What I thought]
ACTUAL: [What I found]
DELTA: [Mental model update]
ENCODED: [Code that assumed wrong thing]
```
