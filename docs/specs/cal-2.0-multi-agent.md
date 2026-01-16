# Cal 2.0 - Multi-Agent Inside-Out Sessions

**Status:** Ready for Implementation
**Created:** 2026-01-16
**Author:** Lisa Interview
**Version:** 2.0.0

---

## Overview

Cal 2.0 enhances the plugin with coordinated multi-agent exploration capabilities based on learnings from the pixley-mvp beta-mvp-inside-out session. The core innovation is the **accordion pattern**: narrow alignment points followed by divergent exploration, repeating until final alignment before implementation.

## Goals

1. Enable multi-lens parallel exploration of codebases
2. Capture user context once, use everywhere (global profile)
3. Formalize handoff between exploration and implementation phases
4. Improve journal formatting for async Q&A workflow

## Non-Goals (2.0)

- Automated agent orchestration (user stays in control)
- Cal web dashboard integration (future)
- Fixed lens catalog (dynamic selection preferred)

---

## The Accordion Pattern

Cal 2.0 sessions follow an accordion rhythm:

```
Alignment → Divergent Exploration → Alignment → Divergent Exploration → Final Alignment → Implementation
```

**Alignment Points:** Narrow focus, shared understanding, user decisions captured
**Divergent Exploration:** Multiple agents explore in parallel with different lenses
**Final Alignment:** Synthesis before implementation (spec-cleaner produces this)

---

## New Commands

### 1. `/cal:inside-out session [topic]`

Multi-agent exploration with dynamic lens selection.

**Invocation:**
```
/cal:inside-out session [topic]
```

**Process:**
1. Cal analyzes the task and suggests appropriate lenses (or asks user)
2. User approves/modifies lens selection
3. Cal creates folder structure: `/cal/inside-out/[topic]/`
4. Cal launches agents (user-directed, not automatic)
5. Each agent writes to their lens file (e.g., `general.md`, `atomizer.md`)
6. Agents collect questions at TOP of their journal
7. User answers questions (async, in files)
8. Agents finalize with Condensed Insight
9. Spec-cleaner synthesizes at alignment points
10. `/cal:handoff` prepares for next phase

**File Structure:**
```
/cal/inside-out/[topic]/
├── general.md           # General lens exploration
├── atomizer.md          # Atomizer lens exploration
├── architect.md         # Architecture lens exploration
├── ux.md                # UX lens exploration
├── [custom].md          # Any custom lenses
├── instructions.md      # Shared alignment doc (created at alignment points)
└── synthesis.md         # Final synthesis (spec-cleaner output)
```

**Lens Selection:**
Cal determines appropriate lenses based on task, or asks user. Common lenses:
- **General:** System understanding, data flow, "what is this"
- **Atomizer:** Code organization, duplication, file sizes
- **Architect:** Boundaries, coupling, state management
- **UX:** Interaction patterns, cognitive load, user-facing
- **Security:** Auth, RLS, secrets, vulnerabilities
- **Performance:** Bottlenecks, N+1, memory, latency

---

### 2. `/cal:profile`

Creates or updates global user profile.

**Invocation:**
```
/cal:profile
```

**Location:** `~/.claude/cal/USER-PROFILE.md`

**Template:**
```markdown
# User Profile

## Professional Background
- Current role:
- Previous experience:
- Domain expertise:

## Technical Profile
- Coding ability: [none | familiar | proficient | expert]
- Tools used daily:
- Data sophistication:

## Communication Preferences
- Frame advice in: [business terms | technical terms | hybrid]
- Preferred analogies: [marketing | engineering | finance | other]
- Decision style: [show tradeoffs | recommend directly]

## What This Means for Agents
- [How to tailor advice]
- [What NOT to do]
```

**Usage:** Created once, referenced by all agents via instruction to read profile before giving advice.

---

### 3. `/cal:handoff [recipient]`

Extracts findings from exploration into structured handoff document.

**Invocation:**
```
/cal:handoff lisa
/cal:handoff ralph
```

**Process:**
1. Cal reads all journals in current inside-out session
2. Extracts findings relevant to recipient
3. Creates `/cal/inside-out/[topic]/handoff-[recipient].md`

**Handoff Structure:**
```markdown
# Handoff to [Recipient]

## Key Findings Affecting Your Work
- [Finding 1]
- [Finding 2]

## Dependencies and Sequencing
- [What must happen first]
- [What can be parallel]

## Conflicts to Resolve
- [Tension 1: Agent A says X, Agent B says Y]
- [Tension 2: ...]

## Watch Items During Execution
- [Thing to monitor 1]
- [Thing to monitor 2]

## User Decisions Recorded
- [Decision 1]
- [Decision 2]
```

---

## Improved Journal Format

All inside-out journals (single or multi-agent) now use this format:

```markdown
# Inside-Out: [Subject] - [Lens]

**Goal:** [Why we need to understand this]
**Started:** [DATE]
**Lens:** [General | Atomizer | Architect | UX | Custom]

---

## Questions for User

> **IMPORTANT:** Answer these questions directly in this file.
> Your answers drive the exploration.

### Q1: [Question]
**Answer:**

### Q2: [Question]
**Answer:**

---

## /cal:delta Log

Document assumption corrections here using BELIEVED/ACTUAL/DELTA format.

### Delta 1: [Topic]
- **BELIEVED:** [What I thought]
- **ACTUAL:** [What is true]
- **DELTA:** [What I now understand]

---

## Condensed Insight

*Added after exploration complete*

**Core insight:** [One sentence]

**Key mechanics:**
- [How it works 1]
- [How it works 2]

**Gotchas:**
- [Counterintuitive thing]

---

## Raw Exploration

[Extensive notes below...]
```

**Key Changes from 1.x:**
- Questions section at TOP (not buried in notes)
- Explicit `/cal:delta` section required
- Lens identified in header
- Condensed Insight section (was implicit)

---

## User Stories

### US-1: Multi-Agent Session Setup

**As a** Cal user
**I want to** start a coordinated multi-agent exploration
**So that** I get comprehensive understanding from multiple perspectives

**Acceptance Criteria:**
- [ ] `/cal:inside-out session [topic]` creates folder structure
- [ ] Cal suggests lenses based on topic (or asks user)
- [ ] User can modify lens selection before agents launch
- [ ] Each lens gets its own journal file
- [ ] Folder includes README with session context

---

### US-2: User Profile Creation

**As a** Cal user
**I want to** create a profile that agents reference
**So that** advice is tailored to my background

**Acceptance Criteria:**
- [ ] `/cal:profile` creates `~/.claude/cal/USER-PROFILE.md`
- [ ] Template includes all relevant sections
- [ ] Agents are instructed to read profile before giving advice
- [ ] Profile persists across sessions and projects

---

### US-3: Improved Journal Format

**As an** agent doing inside-out exploration
**I want to** use the improved journal format
**So that** users can easily answer questions and track deltas

**Acceptance Criteria:**
- [ ] Questions section appears at TOP of journal
- [ ] `/cal:delta` section is required and used
- [ ] Lens is identified in header
- [ ] Condensed Insight has defined structure

---

### US-4: Handoff Command

**As a** Cal user finishing exploration
**I want to** generate a handoff document for Lisa/Ralph
**So that** the next phase has structured input

**Acceptance Criteria:**
- [ ] `/cal:handoff lisa` extracts from all session journals
- [ ] Output includes findings, dependencies, conflicts, watch items
- [ ] User decisions are captured in handoff
- [ ] File created in session folder

---

## Implementation Order

1. **US-3:** Improved journal format (update inside-out.md template)
2. **US-2:** User profile command (new command file)
3. **US-1:** Multi-agent session setup (enhance inside-out.md)
4. **US-4:** Handoff command (new command file)

---

## Technical Notes

### Dynamic Lens Selection

Cal should analyze the task and suggest lenses. Heuristics:
- Code exploration → General + Atomizer
- Architecture decisions → Architect + General
- UI/UX work → UX + General
- Security audit → Security + Architect
- Performance issues → Performance + General
- Complex system → All core lenses (General, Atomizer, Architect, UX)

If unsure, Cal asks user which perspectives would be valuable.

### Spec-Cleaner Integration

At alignment points in the accordion pattern, spec-cleaner agent is invoked to:
1. Read all lens journals
2. Create shared `instructions.md` for next exploration phase
3. Create `synthesis.md` for final alignment

This is not a Cal command - it's the natural role of spec-cleaner agent.

### CLI Notifications

When agents write questions to journals, Cal should notify user:
```
[Cal] Questions ready for review in /cal/inside-out/[topic]/
      - general.md: 3 questions
      - atomizer.md: 2 questions
```

This helps users know when to check in on async Q&A.

---

## Version History

- **2.0.0** - Multi-agent sessions, user profile, handoff command, improved journal format
- **1.2.0** - Inside-out command, file location structure
- **1.1.0** - Initial Cal toolkit

---

## Verification

After implementation:

```bash
# Verify new commands exist
ls /cal-plugin/commands/
# Should show: inside-out.md, profile.md, handoff.md (plus existing)

# Verify version bump
cat /cal-plugin/.claude-plugin/plugin.json
# Should show version: "2.0.0"
```

Test each user story manually by running the commands and verifying output matches spec.
