---
description: "Opt-in archive for multi-session carryover"
argument-hint: "[agent] [topic]"
---

# Archive - Opt-In Storage for Exception Cases

**Trigger:** `/cal:archive [agent] [topic]`

**Purpose:** Preserve agent output that can't be acted on yet and needs multi-session carryover.

## When to Use

**This is rare.** Most agent outputs should:
1. Be acted on immediately
2. Have learnings extracted → delta/AHA
3. Vanish with context

Use `/cal:archive` only when:
- Findings require multi-session work you can't start yet
- Output contains details you'll need verbatim later
- User explicitly says "save that review"

## When NOT to Use

| Situation | What to Do Instead |
|-----------|-------------------|
| "Good review, let me save it" | Extract the learning → `/cal:save aha` |
| Routine agent check passed | Let it vanish |
| Decision was made from review | Note in the spec, not archive |
| "Might need this later" | Probably won't. Let it vanish. |

## Usage

```bash
# Archive a specific agent's output for later
/cal:archive beta-enthusiast "edge cases for payment flow"
/cal:archive architect "coupling analysis for auth refactor"
```

## Where It Goes

`cal/archive/YYYY-MM-DD-[topic-slug].md`

Example: `cal/archive/2026-01-19-payment-edge-cases.md`

## File Format

```markdown
# Archive: [Topic]

**Date:** [ISO-8601]
**Agent:** [Agent name]
**Context:** [Why this was archived]

---

[Agent output verbatim]

---

**Action required:** [What needs to happen with this]
**Revisit by:** [Date or trigger condition]
```

## Archive Hygiene

Archives should be:
- **Rare** — If you're archiving frequently, you're probably not extracting learnings
- **Actionable** — Each archive has a clear "what to do with this"
- **Time-bound** — Include when to revisit or delete

If `cal/archive/` has more than 5 files, something's wrong with your extraction discipline.

## Why This Exists

Sometimes findings genuinely can't be acted on yet. This gives them a home that's:
- Separate from the journal (not polluting permanent learnings)
- Separate from memories (not ephemeral session context)
- Explicitly opt-in (forces conscious decision)
