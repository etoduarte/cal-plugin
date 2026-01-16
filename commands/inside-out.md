---
description: "Deep understanding protocol - extensive exploration condensed to insight"
---

# Inside-Out Protocol

**Purpose:** Build deep understanding of a topic, system, or concept. This is NOT for strategizing, planning, or brainstorming. Pure understanding first—planning comes later.

## Invocation

User provides:
1. **Subject:** What they want to understand
2. **Goal:** Why they need to understand it (context for depth)

## File Location

All Cal files live in a `/cal` folder at the project root:

```
project/
└── cal/
    ├── cal.md                      # Main journal
    └── inside-out/                 # Inside-out explorations
        ├── [subject-slug].md
        └── [another-subject].md
```

Create the folder structure if it doesn't exist.

## Protocol

### Phase 1 - Start the Journal

Create a new file at:
```
/cal/inside-out/[subject-slug].md
```

Initialize with:
```markdown
# Inside-Out: [Subject]

**Goal:** [Why we need to understand this]
**Started:** [DATE]

---

## Raw Understanding

[Extensive notes go here during exploration]
```

### Phase 2 - Go Deep

Explore extensively. Journal EVERYTHING:
- What I find
- What surprises me
- What contradicts my assumptions
- What connects to other things
- What I don't understand yet
- Questions that arise
- Sources I'm reading
- Code I'm examining
- Patterns I'm noticing

**Be verbose.** This is not the time for brevity. Capture the full texture of understanding as it develops. Include dead ends, wrong turns, and corrections—they're part of understanding.

### Phase 3 - Condense

When the user signals understanding is complete (or we've reached sufficient depth):

1. Add a `## Condensed Understanding` section at the TOP (after the header)
2. Distill the raw exploration into:
   - **Core insight:** The one thing that matters most
   - **Key mechanics:** How it actually works (3-5 bullets max)
   - **Gotchas:** What's counterintuitive or easy to miss
   - **Connections:** How this relates to other known things
3. Keep the raw notes below for reference

Final structure:
```markdown
# Inside-Out: [Subject]

**Goal:** [Why we needed to understand this]
**Started:** [DATE]
**Condensed:** [DATE]

---

## Condensed Understanding

**Core insight:** [One sentence]

**Key mechanics:**
- [How it works 1]
- [How it works 2]
- [How it works 3]

**Gotchas:**
- [Counterintuitive thing 1]
- [Easy to miss thing 2]

**Connections:**
- [Links to X because...]
- [Relevant to Y when...]

---

## Raw Understanding

[All the extensive notes preserved below]
```

## Key Principles

1. **Understanding ≠ Planning** — Don't jump to "so we should..." Stay in "so it is..."
2. **Extensive then condensed** — Capture everything, then distill
3. **Preserve the journey** — Raw notes stay; they have value for future deep dives
4. **User drives depth** — Keep going until user says enough
