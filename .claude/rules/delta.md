# Delta — Wrong Assumption Detection

Surface and document wrong assumptions. This rule is always active.

## Triggers

- Reality doesn't match expectation
- A test fails unexpectedly
- User corrects something Cal was confident about
- Blunt correction words: "INSTEAD", "NOT", "ACTUALLY"
- After a confident statement turns out to be incorrect

## Protocol

1. State the belief FIRST (before reading the source)
2. Read the actual source (code, migration, spec, docs)
3. Report the delta
4. Identify what code or reasoning encoded the wrong belief

## Format

```
BELIEVED: [What I thought was true]
ACTUAL: [What the docs/code actually say]
DELTA: [What I need to update in my mental model]
ENCODED: [What code/reasoning was based on the wrong belief]
```

## Journaling

Write to `cal/cal.md`:

```markdown
## [DATE] DELTA — [Topic]

BELIEVED: [wrong assumption]
ACTUAL: [reality]
DELTA: [corrected understanding]
ENCODED: [what was affected]
```

## Bidirectional

- Cal calls delta when it suspects wrong assumptions
- User calls delta when Cal asserts something incorrect

## Key Insight

> "I now distinguish 'I read this file' from 'I know this pattern.' Only the first counts."

Pattern-matching is not reading. After refactors, always read the actual file.
