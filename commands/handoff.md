---
description: "Extract findings from inside-out session into structured handoff"
---

# Handoff - Session to Implementation Bridge

**Trigger:** `/cal:handoff [recipient]`

**Purpose:** Extract findings from an inside-out exploration session into a structured handoff document for the next phase (Lisa spec, Ralph implementation, etc.).

## Usage

```bash
# Handoff to Lisa for spec writing
/cal:handoff lisa

# Handoff to Ralph for implementation
/cal:handoff ralph

# Custom recipient
/cal:handoff [team-name]
```

## Output Location

```
/cal/inside-out/[topic]/handoff-[recipient].md
```

For single-agent explorations:
```
/cal/inside-out/handoff-[subject]-[recipient].md
```

## Handoff Template

```markdown
# Handoff to [Recipient]

**From:** Inside-Out Session: [Topic/Subject]
**Date:** [DATE]
**Lenses Used:** [General, Atomizer, Architect, etc.]

---

## Executive Summary

[2-3 sentences: what we explored and the key takeaway]

---

## Key Findings Affecting Your Work

### Finding 1: [Title]
- **What:** [Description]
- **Why it matters for [recipient]:** [Impact]
- **Source:** [Which lens journal, line reference]

### Finding 2: [Title]
- **What:** [Description]
- **Why it matters for [recipient]:** [Impact]
- **Source:** [Which lens journal, line reference]

[Continue for all relevant findings...]

---

## Dependencies and Sequencing

### Must Happen First
- [ ] [Dependency 1]
- [ ] [Dependency 2]

### Can Be Parallel
- [ ] [Task 1]
- [ ] [Task 2]

### Blocked Until
- [ ] [Blocker]: [What unblocks it]

---

## Conflicts to Resolve

### Conflict 1: [Title]
- **Tension:** [Agent A says X, Agent B says Y]
- **My recommendation:** [If any]
- **User should decide:** [Yes/No]

[Continue for any conflicts...]

---

## Watch Items During Execution

Things to monitor that might go wrong:

- [ ] [Watch item 1]: [What to look for]
- [ ] [Watch item 2]: [What to look for]

---

## User Decisions Recorded

Decisions captured during exploration that affect implementation:

| Decision | Context | Impact |
|----------|---------|--------|
| [Decision 1] | [Why this was decided] | [How it affects work] |
| [Decision 2] | [Why this was decided] | [How it affects work] |

---

## Deltas Discovered

Assumptions that were corrected during exploration:

### Delta: [Topic]
- **BELIEVED:** [Original assumption]
- **ACTUAL:** [What we learned]
- **Impact on [recipient]:** [How this changes the work]

---

## Raw Source Files

For full context, see:
- `/cal/inside-out/[topic]/general.md`
- `/cal/inside-out/[topic]/atomizer.md`
- `/cal/inside-out/[topic]/[other-lenses].md`
- `/cal/inside-out/[topic]/synthesis.md` (if exists)
```

## Protocol

When `/cal:handoff [recipient]` is invoked:

1. **Identify session**: Find the current inside-out session (most recent in `/cal/inside-out/`)
2. **Read all journals**: Parse all lens files in the session folder
3. **Extract relevant findings**: Filter for what matters to the recipient
4. **Identify conflicts**: Find where lenses disagree
5. **Collect decisions**: Pull user answers from Q&A sections
6. **Gather deltas**: Extract all BELIEVED/ACTUAL/DELTA entries
7. **Write handoff**: Create the handoff document

## Recipient-Specific Filtering

### Lisa (Spec Writing)
Focus on:
- Requirements discovered
- User decisions and preferences
- Scope boundaries identified
- Technical constraints found
- UX considerations (if UX lens was used)

### Ralph (Implementation)
Focus on:
- Technical findings
- Code patterns discovered
- Dependencies and sequencing
- Potential pitfalls identified
- Performance considerations (if Performance lens was used)

### Custom Recipients
Include all findings, let recipient filter.

## Why This Exists

- Bridge between exploration and execution
- Prevent knowledge loss at phase transitions
- Make accordion pattern explicit: exploration → alignment → implementation
- Give next phase structured input, not raw notes
- Surface conflicts before they become bugs
