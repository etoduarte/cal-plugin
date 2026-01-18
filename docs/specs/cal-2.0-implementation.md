# Cal 2.0 Implementation Specification

**Status:** Ready for Implementation
**Created:** 2026-01-17
**Source:** cal/meetings/2026-01-17-cal-evolution-continued/product-brief.md

---

## Overview

Refactor Cal from 16 commands to 7, enforce the "no execution" hard line, and implement modular onboarding with suggested agent prompts.

## Hard Line

**Cal has NO execution capabilities. Only coordination and annotation.**

- Cal dispatches agents, never does work inline
- Cal captures context to files
- Cal coordinates multi-agent workflows
- Cal prompts when agents are missing

## Out of Scope

- Lisa/Ralph loop plugins — don't touch
- Hooks system — CAN be modified if needed

---

## Phase 0: Foundation

**Prerequisite:** None
**Blocks:** All other phases

### F-1: Document File Location Strategy

**As a** Cal developer
**I want** file locations documented in CLAUDE.md
**So that** all commands write to consistent locations

**Acceptance Criteria:**
- [ ] CLAUDE.md contains "## Cal File Locations" section
- [ ] Documents: `cal/cal.md`, `cal/inside-out/`, `cal/meetings/`
- [ ] Documents: `.claude/*.local.md` for transient state
- [ ] Documents: Agent prompts file location

**Verification:**
```bash
grep -q "Cal File Locations" CLAUDE.md && echo "PASS"
```

---

### F-2: Define Journal Entry Schema

**As a** Cal developer
**I want** consistent journal entry format
**So that** all saves are parseable

**Acceptance Criteria:**
- [ ] Schema documented in CLAUDE.md
- [ ] Format: `## [ISO-8601-DATE] [TYPE] - [TOPIC]`
- [ ] Types defined: DELTA, SAVE, DECISION, SESSION
- [ ] Example entry included

**Verification:**
```bash
grep -q "Journal Entry Schema" CLAUDE.md && echo "PASS"
```

---

### F-3: Create Suggested Agent Prompts File

**As a** Cal user
**I want** prompts for creating recommended agents
**So that** I can bootstrap note-taker and sacred-keeper

**Acceptance Criteria:**
- [ ] File exists at `cal/agent-prompts.md`
- [ ] Contains prompt for creating note-taker agent
- [ ] Contains prompt for creating sacred-keeper agent
- [ ] Each prompt is copy-pasteable to Claude

**Verification:**
```bash
[ -f "cal/agent-prompts.md" ] && grep -q "note-taker" cal/agent-prompts.md && echo "PASS"
```

---

### F-4: Create cal/ Folder Structure Template

**As a** Cal developer
**I want** a documented folder structure
**So that** onboard knows what to create

**Acceptance Criteria:**
- [ ] Structure documented: `cal/cal.md`, `cal/inside-out/`, `cal/meetings/`, `cal/agent-prompts.md`
- [ ] cal.md template defined (empty journal with header)
- [ ] This is documentation only — onboard creates the actual folders

**Verification:**
```bash
grep -q "cal/cal.md" CLAUDE.md && echo "PASS"
```

---

### F-5: Define Role Manifest Schema

**As a** Cal developer
**I want** a role manifest that maps roles to agents
**So that** commands dispatch roles, not hardcoded agent names

**Acceptance Criteria:**
- [ ] Role manifest schema documented in CLAUDE.md
- [ ] Format: JSON with role → agent mapping
- [ ] Required roles defined: note-taker, sacred-keeper
- [ ] Commands reference roles, agents fill roles

**Verification:**
```bash
grep -q "Role Manifest" CLAUDE.md && echo "PASS"
```

---

## Phase 1: Simplification

**Prerequisite:** Phase 0 complete
**Blocks:** Phase 2

### S-1: Refactor check.md to Dispatch Only

**As a** Cal user
**I want** check to dispatch verification agents
**So that** Cal doesn't do work inline

**Acceptance Criteria:**
- [ ] check.md contains NO file reading for verification
- [ ] check.md contains NO inline analysis
- [ ] check.md dispatches appropriate agent based on context inference
- [ ] check.md captures dispatch result, doesn't interpret it

**Verification:**
```bash
! grep -q "Read tool" commands/check.md && echo "PASS"
```

---

### S-2: Merge pre.md into check.md

**As a** Cal developer
**I want** pre-flight logic in check
**So that** users have one verification command

**Acceptance Criteria:**
- [ ] check.md handles pre-flight context (before starting work)
- [ ] pre.md deleted
- [ ] No references to /cal:pre in codebase

**Verification:**
```bash
[ ! -f "commands/pre.md" ] && echo "PASS"
```

---

### S-3: Merge post.md into check.md

**As a** Cal developer
**I want** post-flight logic in check
**So that** users have one verification command

**Acceptance Criteria:**
- [ ] check.md handles post-flight context (after completing work)
- [ ] post.md deleted
- [ ] No references to /cal:post in codebase (except in specs/archive)

**Verification:**
```bash
[ ! -f "commands/post.md" ] && echo "PASS"
```

---

### S-4: Merge review.md into check.md

**As a** Cal developer
**I want** review logic in check
**So that** users have one verification command

**Acceptance Criteria:**
- [ ] check.md handles review context
- [ ] review.md deleted

**Verification:**
```bash
[ ! -f "commands/review.md" ] && echo "PASS"
```

---

### S-5: Fold meet-brief.md into meet.md

**As a** Cal developer
**I want** brief functionality in meet
**So that** there's one meeting command

**Acceptance Criteria:**
- [ ] meet.md handles guest briefings
- [ ] meet-brief.md deleted

**Verification:**
```bash
[ ! -f "commands/meet-brief.md" ] && echo "PASS"
```

---

### S-6: Fold profile.md into onboard.md

**As a** Cal developer
**I want** profile setup in onboard
**So that** there's one setup command

**Acceptance Criteria:**
- [ ] onboard.md handles user profile setup
- [ ] profile.md deleted

**Verification:**
```bash
[ ! -f "commands/profile.md" ] && echo "PASS"
```

---

### S-7: Delete Deprecated Commands

**As a** Cal developer
**I want** unused commands removed
**So that** the codebase is clean

**Acceptance Criteria:**
- [ ] fly.md deleted
- [ ] handoff.md deleted
- [ ] help.md deleted
- [ ] reset.md deleted

**Verification:**
```bash
[ ! -f "commands/fly.md" ] && [ ! -f "commands/handoff.md" ] && [ ! -f "commands/help.md" ] && [ ! -f "commands/reset.md" ] && echo "PASS"
```

---

## Phase 2: Core Enhancement

**Prerequisite:** Phase 1 complete

### E-1: Polish meet.md

**As a** Cal user
**I want** meet to work reliably
**So that** I can run collaborative sessions

**Acceptance Criteria:**
- [ ] meet.md instructs participants to write to their own files
- [ ] Guest briefing flow documented
- [ ] Cleanup protocol outputs `<promise>MEETING ADJOURNED</promise>`

**Verification:**
- Run `/cal:meet`, have a brief discussion, say "meeting adjourned"
- Verify meeting artifacts created in `cal/meetings/`

---

### E-2: Implement Context-Aware Check

**As a** Cal user
**I want** check to infer what I just did
**So that** it dispatches the right verifier

**Acceptance Criteria:**
- [ ] check.md reads `cal/` folder artifacts (cal.md, meeting notes, inside-out/)
- [ ] Infers work type from artifacts: spec, implementation, migration, etc.
- [ ] Dispatches appropriate verification agent based on role manifest
- [ ] Reports dispatch result without interpreting

**Note:** Context comes from cal/ artifacts, NOT conversation history. This keeps check deterministic and file-based.

**Verification:**
- Complete a spec, run `/cal:check`, verify appropriate agent dispatched
- Complete code, run `/cal:check`, verify different agent dispatched

---

### E-3: Enhance save.md with Schema

**As a** Cal user
**I want** save to use consistent journal format
**So that** entries are parseable

**Acceptance Criteria:**
- [ ] save.md writes entries in journal schema format
- [ ] Includes ISO-8601 date, TYPE, TOPIC
- [ ] Supports SESSION type for context preservation

**Verification:**
```bash
/cal:save "Test entry"
grep -q "$(date +%Y-%m-%d)" cal/cal.md && echo "PASS"
```

---

### E-4: Implement Onboard Exploration

**As a** Cal user
**I want** onboard to scan my codebase
**So that** it can suggest relevant agents

**Acceptance Criteria:**
- [ ] onboard.md globs for common patterns (package.json, tsconfig.json, Cargo.toml, etc.)
- [ ] Reports: languages, frameworks, folder structure
- [ ] Simple scan — not sophisticated analysis

**Verification:**
- Run `/cal:onboard` in a project
- Verify it reports detected patterns

---

### E-5: Onboard Creates cal/ Structure

**As a** Cal user
**I want** onboard to create cal/ folder
**So that** I have a journal from the start

**Acceptance Criteria:**
- [ ] Creates `cal/` directory if not exists
- [ ] Creates `cal/cal.md` with header
- [ ] Creates `cal/inside-out/` directory
- [ ] Creates `cal/meetings/` directory
- [ ] Copies `cal/agent-prompts.md` from template

**Verification:**
```bash
[ -d "cal" ] && [ -f "cal/cal.md" ] && [ -d "cal/inside-out" ] && [ -d "cal/meetings" ] && echo "PASS"
```

---

### E-6: Onboard Suggests Agents

**As a** Cal user
**I want** onboard to suggest agents based on my codebase
**So that** I know what to create

**Acceptance Criteria:**
- [ ] After exploration, presents suggestions with rationale
- [ ] Recommends note-taker and sacred-keeper first
- [ ] Suggests additional agents based on detected patterns
- [ ] Points user to agent-prompts.md

**Verification:**
- Run `/cal:onboard`
- Verify it recommends note-taker and sacred-keeper
- Verify it points to prompts file

---

## Phase 3: Utility Polish

**Prerequisite:** Phase 2 complete

### U-1: Polish delta Utility

**As a** Cal user
**I want** delta to use journal schema
**So that** wrong assumptions are logged consistently

**Acceptance Criteria:**
- [ ] delta writes to cal.md in journal schema
- [ ] Uses DELTA type
- [ ] Captures BELIEVED, ACTUAL, DELTA format

**Verification:**
```bash
/cal delta
grep -q "DELTA" cal/cal.md && echo "PASS"
```

---

### U-2: Polish squirrel Utility

**As a** Cal user
**I want** squirrel to use journal schema
**So that** refocus moments are logged

**Acceptance Criteria:**
- [ ] squirrel writes to cal.md in journal schema
- [ ] Uses appropriate type
- [ ] Captures what was interrupted and why

**Verification:**
```bash
/cal squirrel
# Verify entry added to cal.md
```

---

### U-3: Polish inside-out Utility

**As a** Cal user
**I want** inside-out to document multi-agent mode
**So that** exploration sessions are captured

**Acceptance Criteria:**
- [ ] inside-out writes artifacts to `cal/inside-out/`
- [ ] Documents the accordion pattern if multi-agent
- [ ] Produces handoff-ready output

**Verification:**
- Run `/cal inside-out [topic]`
- Verify artifact created in `cal/inside-out/`

---

## Implementation Order

1. **Phase 0** (F-1 → F-5): Foundation — all must complete
2. **Phase 1** (S-1 → S-7): Simplification — delete before adding
3. **Phase 2** (E-1 → E-6): Enhancement — build on clean base
4. **Phase 3** (U-1 → U-3): Polish — existing commands, minor updates

## Post-Workflow Verification

After each story, dispatch verification agents similar to current `/cal:post` behavior to confirm:
- Files exist where expected
- Commands run without error
- No regressions in existing functionality

## Summary

20 stories across 4 phases. Strict sequencing: each phase must complete before the next begins.

End state: 7 commands (4 core + 3 utilities), no inline execution, modular onboarding with agent prompts.
