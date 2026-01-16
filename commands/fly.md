---
description: "Accept story, proceed (THE acceptance signal)"
---

# Fly - Acceptance & Go-Ahead

**Trigger:** `/cal:fly` or semantic "fly" in conversation

**Meaning:** Story accepted. Cleared to proceed.

## What It Does

1. **Accepts current work** - Equivalent to "the force is with you"
2. **Triggers pre-flight for next** - If there's a next story, run pre-flight checks
3. **Gives go-ahead** - Cleared to implement

## Usage

```
# Explicit command
/cal:fly

# Semantic (recognized in conversation)
"fly"
"let's fly"
"cleared to fly"
```

## Flow Integration

### During Ralph Loop
```
implement US-1 → /cal:post-flight → review → /cal:fly → pre-flight US-2 → implement US-2
```

### Compressed (when user trusts work)
```
implement US-1 → /cal:fly → implement US-2
```

### Outside Ralph Loop
```
/cal:fly → triggers pre-flight → asks permission before implementing
```

## Why "Fly"

- **Unambiguous** - Won't false-positive like "looks good" or "nice"
- **Semantic** - Can be used naturally in conversation
- **Aviation metaphor** - Ties into pre-flight/post-flight naming

## Signal Hierarchy

| Signal | Meaning | What I Do |
|--------|---------|-----------|
| "fly" | **ACCEPTANCE** | Accept story, pre-flight next, proceed |
| "looks good", "nice", "ok" | **PROGRESS** | Continue current work, no advancement |
| Silence | **UNCERTAIN** | Check in if significant decision needed |

**Only "fly" advances the workflow.** Other positive signals mean "you're on track" not "move on."

## Output

```markdown
## [DATE] FLY - [PROJECT]

**Accepted:** [What was completed]
**Next:** [What's coming up]
**Pre-flight:** [Status of next story readiness]
```
