---
description: "Deep understanding protocol - single or multi-agent exploration"
---

# Inside-Out Protocol

**Purpose:** Build deep understanding of a topic, system, or concept. This is NOT for strategizing, planning, or brainstorming. Pure understanding first—planning comes later.

## Invocation Modes

### Single-Agent Mode (Default)
```
/cal:inside-out [subject]
```
One agent explores deeply from a general perspective.

### Multi-Agent Session Mode
```
/cal:inside-out session [topic]
```
Multiple agents explore in parallel with different lenses. Follows the **accordion pattern**:
```
Alignment → Divergent Exploration → Alignment → ... → Final Alignment → Implementation
```

---

## File Location

### Single-Agent
```
project/
└── cal/
    └── inside-out/
        └── [subject-slug].md
```

### Multi-Agent Session
```
project/
└── cal/
    └── inside-out/
        └── [topic]/
            ├── general.md
            ├── atomizer.md
            ├── architect.md
            ├── ux.md
            ├── instructions.md    # Shared alignment (created at alignment points)
            └── synthesis.md       # Final synthesis
```

Create the folder structure if it doesn't exist.

---

## Journal Template

**IMPORTANT:** This format is required for all inside-out journals.

```markdown
# Inside-Out: [Subject]

**Goal:** [Why we need to understand this]
**Started:** [DATE]
**Lens:** [General | Atomizer | Architect | UX | Security | Performance | Custom]

---

## Questions for User

> Answer these questions directly in this file.
> Your answers drive the exploration.

### Q1: [Question about something non-obvious]
**Answer:**

### Q2: [Question about edge case or decision]
**Answer:**

---

## Delta Log

Document assumption corrections using BELIEVED/ACTUAL/DELTA format.

### Delta 1: [Topic]
- **BELIEVED:** [What I thought was true]
- **ACTUAL:** [What the code/docs actually say]
- **DELTA:** [What I now understand differently]

---

## Condensed Insight

*Added after exploration complete*

**Core insight:** [One sentence - the thing that matters most]

**Key mechanics:**
- [How it works 1]
- [How it works 2]
- [How it works 3]

**Gotchas:**
- [Counterintuitive thing]
- [Easy to miss thing]

**Connections:**
- [Links to X because...]

---

## Raw Exploration

[Extensive notes preserved below...]
```

---

## Single-Agent Protocol

### Phase 1 - Start the Journal

Create `/cal/inside-out/[subject-slug].md` using the template above.

Set **Lens:** to "General" for single-agent explorations.

### Phase 2 - Go Deep

Explore extensively. Journal EVERYTHING:
- What I find
- What surprises me
- What contradicts my assumptions (use Delta Log!)
- What connects to other things
- What I don't understand yet
- Questions that arise (add to Questions for User section!)
- Sources I'm reading
- Code I'm examining
- Patterns I'm noticing

**Be verbose.** Capture the full texture of understanding. Include dead ends and corrections.

### Phase 3 - Condense

When user signals completion:
1. Fill in the **Condensed Insight** section
2. Add `**Condensed:** [DATE]` to header
3. Keep raw notes below for reference

---

## Multi-Agent Session Protocol

### Phase 1 - Session Setup

1. Analyze the task and determine appropriate lenses
2. Ask user to approve/modify lens selection
3. Create folder: `/cal/inside-out/[topic]/`
4. Create journal file for each lens

**Lens Selection Heuristics:**
- Code exploration → General + Atomizer
- Architecture decisions → Architect + General
- UI/UX work → UX + General
- Security audit → Security + Architect
- Performance issues → Performance + General
- Complex system → All core lenses

### Phase 2 - Parallel Exploration

Each lens agent:
1. Reads user profile (`~/.claude/cal/USER-PROFILE.md`) if it exists
2. Explores from their perspective
3. Writes questions at TOP of their journal
4. Documents deltas when assumptions change
5. Journals extensively in Raw Exploration

**Coordination:**
- Agents work independently but can reference each other's findings
- User answers questions async in the journal files
- CLI notifies user when questions are ready

### Phase 3 - Alignment Point

When exploration is complete:
1. Each agent finalizes their Condensed Insight
2. Spec-cleaner agent creates `instructions.md` (shared alignment)
3. If more exploration needed, repeat Phase 2 with shared context
4. If done, spec-cleaner creates `synthesis.md`

### Phase 4 - Handoff

Create handoff-ready output in `synthesis.md`:

```markdown
# Synthesis: [Topic]

**Explored:** [DATE]
**Lenses:** [List of agents that participated]

## Executive Summary
[2-3 sentence essence for someone who wasn't in the exploration]

## Key Findings
1. [Finding with evidence]
2. [Finding with evidence]

## Deltas Discovered
- [Important assumption corrections]

## Recommendations
1. [Actionable recommendation]
2. [Actionable recommendation]

## Open Questions
- [Questions that emerged but weren't resolved]

## Handoff Context
[What the next agent/phase needs to know to continue]
```

---

## Available Lenses

| Lens | Focus | Key Questions |
|------|-------|---------------|
| **General** | System understanding | What is it? How does data flow? |
| **Atomizer** | Code organization | Duplication? File sizes? Extractions? |
| **Architect** | Boundaries & coupling | What persists vs derives? State management? |
| **UX** | Interaction patterns | Mental models? Cognitive load? Progressive disclosure? |
| **Security** | Vulnerabilities | Auth? RLS? Secrets? Injection risks? |
| **Performance** | Bottlenecks | N+1 queries? Memory? Latency? Caching? |

Custom lenses can be defined per-session based on task needs.

---

## Key Principles

1. **Understanding ≠ Planning** — Stay in "so it is..." not "so we should..."
2. **Questions at TOP** — User finds them easily for async answers
3. **Delta explicitly** — Document when reality ≠ expectation
4. **Extensive then condensed** — Capture everything, then distill
5. **Preserve the journey** — Raw notes stay for future reference
6. **User drives depth** — Keep going until user says enough
7. **Accordion rhythm** — Align, diverge, align, diverge, final align
