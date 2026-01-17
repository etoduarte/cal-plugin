# /cal:meet — Specification

## Overview

Cal becomes a virtual meeting coordinator in a bash loop, helping the user think through problems with AI agents as participants. The "meeting" abstraction helps the human organize collaborative thinking; the AI agents contribute expertise without roleplaying human meeting dynamics.

---

## Commands

### Main Command
```
/cal:meet [--topic "..."] [--participants agent1,agent2] [--instructions "..."]
```
All parameters optional — Cal onboards what's missing.

### Subskill: Guest Briefing
```
/cal:meet:brief [agent] [topic]
```
Dispatches an agent to give a structured briefing, then ritually depart.

---

## Onboarding Protocol

When invoked with missing parameters, Cal asks quick questions:

1. **Topic** — "What are we figuring out today?"
2. **Participants** — Suggest based on topic, user confirms/adjusts
3. **Instructions** — "How should this meeting go?" (freeform, the soul of the meeting)
4. **Outputs** — Quick check if anything beyond minutes needed

---

## Required Agents

These agents are required for full `/cal:meet` functionality. On first run, Cal checks if they exist in `.claude/agents/` and guides the user to create them if missing.

| Agent | Role | Required For |
|-------|------|--------------|
| **note-taker** | Structured capture throughout (inputs, perspectives, outcomes). Judiciously stores LLM output — focus on meaning over verbatim. | Meetings |
| **spec-cleaner** | Interrupts immediately when ambiguity detected. Produces final minutes at wrap-up. | Meetings |
| **eunuch** | Read-only access to protected/sacred files. Returns content faithfully without modification. | Protection |
| **pilgrim** | Adds protective commentary around critical decisions. Suggests guard annotations. | Protection |

### First-Run Agent Onboarding

When `/cal:meet` is invoked and required agents are missing:

```
Cal: I need some coworkers registered before we can run meetings.

Missing agents:
- note-taker (required for meeting capture)
- spec-cleaner (required for minutes generation)

Would you like me to provide starter prompts for each?
```

If user agrees, Cal provides agent initialization prompts:

**note-taker starter prompt:**
```
Create .claude/agents/note-taker.md with:
- name: note-taker
- model: haiku (fast, cheap for continuous capture)
- Purpose: Capture meeting inputs, perspectives, and decisions in structured format
- Behavior: Judicious capture (meaning over verbatim), organize as inputs/perspectives/outcomes
- Output: Append to notes.md in meeting folder
```

**spec-cleaner starter prompt:**
```
Create .claude/agents/spec-cleaner.md with:
- name: spec-cleaner
- model: sonnet
- Purpose: Ensure clarity and produce final meeting minutes
- Behavior: Interrupt immediately when ambiguity detected (undefined terms, unclear references)
- Output: Generate minutes.md following the meeting minutes template
```

**eunuch starter prompt (for protection):**
```
Create .claude/agents/eunuch.md with:
- name: eunuch
- model: haiku
- Purpose: Read-only access to protected/sacred content
- Constraint: NEVER modify, create, or delete files. Read and return only.
- Use case: Fetch sacred business logic, protected decisions for reference
```

**pilgrim starter prompt (for protection):**
```
Create .claude/agents/pilgrim.md with:
- name: pilgrim
- model: sonnet
- Purpose: Add protective annotations to critical decisions
- Behavior: Suggest guard comments (HALLOWED GROUND, LOAD-BEARING) without modifying functional content
- Use case: Mark decisions that should not be changed without careful review
```

Cal does NOT auto-create these agents. The user must create them (ensures they understand what they're adding).

---

## Always Auto-Invited (When Agents Exist)

| Agent | Role |
|-------|------|
| **note-taker** | Structured capture throughout |
| **spec-cleaner** | Clarity checks + final minutes |

If these agents don't exist, Cal runs meetings in **minimal mode**:
- Cal handles note-taking inline (less structured)
- Cal produces minutes directly (no separate spec-cleaner pass)
- User warned about reduced functionality

---

## Mechanism

- **Bash loop** with promise: `"meeting adjourned"`
- **Cal coordinates directly** (no separate meeting-coordinator agent)
- Cal dispatches participants **proactively** (no permission prompts)
- **Prompt at natural breakpoints** — Cal uses judgment to ask "Continue or adjourn?"
- **State file** — `.claude/meeting.local.md` with YAML frontmatter

### State File Structure
```yaml
---
topic: "auth architecture"
slug: "auth-architecture"
started: 2026-01-17T10:00:00
participants: [architect, security-auditor]
instructions: "I'm leaning RLS but have doubts. Poke holes."
status: in_progress
related_meetings: []
---
```

---

## Warmup Context

Before the meeting begins, Cal provides orientation:

1. **Restate the topic and instructions**
2. **Surface related prior meetings** (if any exist with similar topics)
3. **Note any open tensions** from prior meetings that touch this topic
4. **List parking lot items** from prior meetings that might now be relevant

This prevents "cold start" meetings and builds continuity.

---

## Collaboration Framing

Passed to all dispatched agents:

> "The meeting abstraction helps the human organize thinking. You are an AI tool providing expertise, not a human attendee. Contribute clearly, don't roleplay meeting dynamics."

---

## Cal's Role During Meeting

- **Project manager persona**
- Knows a little about everything going on
- Can and should ask questions — but not the subject matter expert
- Interruptions should be high-value
- Coordinates, facilitates, but doesn't dominate

---

## Agent Output Handling

- Each participant agent writes to their **own file**
- Meetings are about **verbose documentation**
- spec-cleaner synthesizes all files into final minutes at end

### Participant File Template
```markdown
# [Meeting Topic] - [Participant Name]
Date: YYYY-MM-DD

## Contributions
[What this agent provided]

## Questions Raised
[What this agent asked]

## Disagreements/Tensions
[Where this agent pushed back or flagged concerns]
```

---

## Guest Briefings (/cal:meet:brief)

- User: "Cal, have architect brief us on the auth patterns"
- Cal dispatches agent with **appropriate context** (uses judgment)
- If confused about context scope, Cal asks user
- Guest delivers structured briefing → ritually departs ("departing after briefing")
- **Formal subskill**, not just documented behavior

### Guest Briefing Structure
```markdown
# Guest Briefing: [Topic]
Date: YYYY-MM-DD
Guest: [Agent Name]
Audience: [Meeting Participants]

## Summary
[2-3 sentence essence]

## Evidence/History
[Structured walkthrough]

## Key Lessons
[Insights for decision-making]

## Questions for Officials
[Thought prompts, not directives]

---
*[Guest] departing after briefing.*
```

---

## File Structure

```
cal/meetings/
├── {date}-{topic-slug}/
│   ├── notes.md                    # note-taker's structured capture
│   ├── participant-{agent}.md      # each participant's contributions
│   ├── guest-{agent}.md            # guest briefings (if any)
│   └── minutes.md                  # final minutes (spec-cleaner)
```

---

## Required Output: Meeting Minutes

```markdown
# [Topic]

**Date:** YYYY-MM-DD
**Participants:** [list]
**Instructions:** [how meeting was conducted]
**Related Meetings:** [links to prior meetings if any]

---

## Key Insights
- [Insight] — [Supporting reasoning]

## Decisions Made

### D1: [Decision Title]
- **Choice:** [What was decided]
- **Rationale:** [Why this was chosen]
- **Confidence:** HIGH | MEDIUM | LOW
- **Revisit if:** [What would change our mind]

### D2: [Decision Title]
...

## Unresolved Tensions
- [ ] **T1:** [Agent A] wants X vs [Agent B] wants Y
  - Currently leaning: [if any]
  - Blocking: [nothing yet | decision D-X]

## Open Questions
- [ ] [Question that needs follow-up]

## How Might We...
[Only if brainstorming-style meeting]
- HMW improve X so that Y?

## Parking Lot
[Out of scope for this meeting, captured for later]

## Assumptions Made
[What we took for granted that might be wrong]

## Next Steps
- [ ] [Action] — Owner: [who] — By: [when/context]

## Briefings Received
[If any guest briefings occurred]
- **[Guest: agent-name]** — [Summary of what was briefed]
  See: guest-{agent}.md
```

---

## Parking Lot

- **NOT related to /cal:squirrel**
- Parking lot = things out of scope for THIS meeting, captured for later
- Actually PREVENTS drift by giving a home for tangential ideas
- Squirrel = catching drift/distraction. Parking lot = intentional deferral.

---

## Error Handling

- **Inform user immediately** if agent dispatch fails
- Dispatched agents should **feel free to ask clarifying questions**
- They don't have full context of the meeting — questions are welcome

---

## End of Meeting (Cleanup Protocol)

1. User: "meeting adjourned"
2. spec-cleaner produces minutes + action items (or Cal produces if spec-cleaner missing)
3. **User reviews and approves** minutes
4. Cal asks: "Any decisions here need protection?"
5. If yes:
   - If eunuch + pilgrim exist → invoke with explicit permission
   - If missing → Cal offers to provide starter prompts, or user can skip protection
6. `<promise>MEETING ADJOURNED</promise>`

---

## Packaging

- Ships as part of **Cal plugin** (same repo)
- `/cal:meet` alongside `/cal:check`, `/cal:squirrel`, etc.
- `/cal:meet:brief` as subskill

---

## Scope

- **Full feature** from day one
- All capabilities: loop, dispatch, guest briefings, note-taker, spec-cleaner, protection

---

## Implementation Notes

### Stop Hook Pattern

The meeting loop uses the same stop hook pattern as Ralph Loop:

1. **State file** (`.claude/meeting.local.md`) indicates meeting in progress
2. **Stop hook** (`hooks/stop-hook.sh`) runs after each Claude response
3. Hook checks:
   - Does state file exist with `status: in_progress`?
   - Did user say "meeting adjourned"?
4. If in progress and not adjourned → hook returns `block` decision with continuation prompt
5. If adjourned or state missing → hook allows normal termination

Reference implementation: See Ralph Loop plugin at `~/.claude/plugins/cache/claude-plugins-official/ralph-loop/`

### Other Notes

- State file: `.claude/meeting.local.md` with YAML frontmatter
- Natural breakpoint detection left to Cal's judgment
- Warmup context generated by reading prior meetings in `cal/meetings/`

---

## Future Enhancements (Out of Scope for MVP)

Captured for later consideration:
- **Decision Registry** — Separate artifact for queryable institutional memory
- **/cal:meet:recall** — Find past decisions without folder navigation
- **Continuation support** — Resume prior meetings explicitly
- **Tempo signals** — Let user set meeting energy (brainstorm vs. decide)
- **Question Bank** — Extract questions for future briefings
- **/cal:post integration** — Propagate learnings after meeting

---

## User Stories

### US-0: First-Run Agent Onboarding
**As a** first-time user
**I want** Cal to detect missing required agents and guide me to create them
**So that** I can set up the meeting infrastructure properly

**Acceptance Criteria:**
- [ ] Cal checks for note-taker.md and spec-cleaner.md in .claude/agents/
- [ ] If missing, Cal informs user which agents are needed
- [ ] Cal offers to provide starter prompts for each missing agent
- [ ] User creates agents manually (Cal does NOT auto-create)
- [ ] After agents exist, Cal proceeds with normal meeting flow
- [ ] If user declines, Cal runs in minimal mode with warning

### US-1: Start a Meeting with Onboarding
**As a** user
**I want to** invoke `/cal:meet` without parameters
**So that** Cal asks me quick questions to set up the meeting

**Acceptance Criteria:**
- [ ] `/cal:meet` with no args triggers onboarding flow
- [ ] Cal asks for topic, participants, instructions in sequence
- [ ] User can provide partial params and Cal only asks for missing ones
- [ ] State file created after onboarding completes

### US-2: Meeting Loop Runs Until Adjourned
**As a** user
**I want to** have the meeting continue until I say "meeting adjourned"
**So that** I don't have to keep re-invoking the command

**Acceptance Criteria:**
- [ ] Stop hook detects meeting in progress and continues loop
- [ ] Cal prompts at natural breakpoints: "Continue or adjourn?"
- [ ] User saying "meeting adjourned" triggers cleanup protocol
- [ ] Promise `MEETING ADJOURNED` emitted after cleanup

### US-3: Dispatch Participant Agents
**As a** Cal meeting coordinator
**I want to** dispatch participant agents without permission prompts
**So that** the meeting flows naturally

**Acceptance Criteria:**
- [ ] Cal can dispatch agents listed in state file proactively
- [ ] Each agent receives collaboration framing
- [ ] Each agent writes to their own participant file
- [ ] Dispatch failures inform user immediately

### US-4: Guest Briefing Subskill
**As a** user
**I want to** request a guest briefing mid-meeting
**So that** I can get context on a topic from an expert

**Acceptance Criteria:**
- [ ] User says "Cal, have X brief us on Y"
- [ ] Cal dispatches agent with appropriate context
- [ ] Guest writes structured briefing to guest file
- [ ] Guest ritually departs after briefing
- [ ] Briefing referenced in final minutes

### US-5: Note-Taker Captures Structured Notes
**As a** meeting participant
**I want** structured notes captured throughout
**So that** the meeting is documented for later reference

**Acceptance Criteria:**
- [ ] note-taker captures user inputs, agent perspectives, decisions
- [ ] Capture is judicious (not verbatim LLM dumps)
- [ ] Notes written to notes.md in meeting folder

### US-6: Spec-Cleaner Interrupts for Ambiguity
**As a** user
**I want** spec-cleaner to immediately flag ambiguous statements
**So that** unclear references are resolved before they cause confusion

**Acceptance Criteria:**
- [ ] spec-cleaner monitors conversation for ambiguity
- [ ] Interrupts immediately when detected (not queued)
- [ ] Examples: undefined variable names, unclear references

### US-7: Final Minutes Generation
**As a** user
**I want** spec-cleaner to produce final minutes at wrap-up
**So that** I have a synthesized record of the meeting

**Acceptance Criteria:**
- [ ] Minutes follow the template structure
- [ ] Includes all required sections
- [ ] Decisions have confidence levels
- [ ] Unresolved tensions captured
- [ ] Guest briefings referenced

### US-8: Warmup Context on Meeting Start
**As a** user
**I want** Cal to provide orientation before the meeting begins
**So that** I'm not starting cold

**Acceptance Criteria:**
- [ ] Cal restates topic and instructions
- [ ] Related prior meetings surfaced (if any)
- [ ] Open tensions from prior meetings noted
- [ ] Relevant parking lot items mentioned

### US-9: Cleanup Protocol with User Approval
**As a** user
**I want** explicit review and approval of meeting outputs
**So that** nothing is finalized without my consent

**Acceptance Criteria:**
- [ ] User reviews minutes before they're finalized
- [ ] Cal asks which decisions need protection
- [ ] eunuch + pilgrim only invoked with explicit permission
- [ ] Meeting adjourned only after user approval

---

## Definition of Done

- [ ] All user stories pass acceptance criteria
- [ ] First-run agent detection and onboarding works
- [ ] Minimal mode works when agents missing
- [ ] Stop hook implemented and tested
- [ ] State file created/managed correctly
- [ ] Meeting folder structure created correctly
- [ ] Minutes template fully implemented
- [ ] `/cal:meet:brief` subskill works
- [ ] Integration with existing Cal plugin structure
