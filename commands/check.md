---
description: "Verify before action"
---

# Check - Verify Before Action

**Trigger:** `/cal:check` — invoke this command before significant action

**Purpose:** Verify readiness before implementation. Combines pre-flight, proceed, and check-in.

## When to Use

- Before starting a user story
- Before writing significant code
- After returning from a break
- When assumptions feel shaky

## Protocol

1. **State intent:** "I'm about to [action]"
2. **Name assumptions:** What I believe to be true
3. **Categorize risk:**
   - Safe: Pure logic, new isolated code
   - Risky: Schema, data flow, existing patterns, sacred areas
4. **Verify risky ones:** Read actual files
5. **Check spec alignment:** No drift from spec
6. **Ask:** "Match your expectation?"
7. **Wait for confirmation**

## For User Stories (Spec Check)

```markdown
### Pre-Implementation Checklist
- [ ] Spec exists and is current
- [ ] Dependencies met (previous stories done)
- [ ] No open questions
- [ ] Sacred docs won't be violated
```

## Agents Dispatched

- `pre-flight-checker` - Spec verification, drift detection
- `business-logic-keeper` - If touching metrics/scoring

## Output

```
I'm about to [action].

Assumptions:
- [Assumption 1] (safe/risky)
- [Assumption 2] (safe/risky)

[Verified risky ones: findings]

Spec check: [CLEAR/ISSUES]

Match your expectation?
```

## Execution Gate

Outside Ralph loop: **STOP.** Get explicit permission before implementing.
