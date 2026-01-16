---
description: "Nuclear context reset"
---

# Full Reset Protocol

**When:** Recursive loops that nothing else fixes. Genuine context pollution. **Last resort.**

## Warning

This throws away good context too. Only use when stuck in recursive loops where other protocols have failed.

## Protocol

1. **Journal current state**
   - What's wrong
   - What's been tried
   - Why other protocols didn't work

2. **Re-read core docs**
   - CLAUDE.md
   - Sacred docs
   - Active spec

3. **Run delta protocol on key assumptions**
   - What do I believe about the system?
   - What does the code actually say?

4. **State readiness to continue fresh**
   - Summarize what I now understand
   - Propose next step

5. **Get user confirmation before proceeding**

## Output

Journal to `cal.md`:

```markdown
## [DATE] FULL RESET - [PROJECT]

### State Before Reset
**Problem:** [What was wrong]
**Tried:** [What didn't work]
**Why reset:** [Why other protocols failed]

### Key Deltas Found
- BELIEVED: X, ACTUAL: Y
- BELIEVED: A, ACTUAL: B

### Fresh Understanding
[Summary of corrected mental model]

### Proposed Next Step
[What I plan to do now]
```
