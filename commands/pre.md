---
description: "Intelligent pre-flight check - dispatch agents to verify readiness"
---

# Pre - Pre-Flight Verification

**Trigger:** `/cal:pre [context]`

**Purpose:** Before starting work, intelligently dispatch agents to verify everything is ready. Cal analyzes the task and selects appropriate verification agents.

## Usage

```bash
# Before starting a Lisa spec
/cal:pre lisa

# Before starting Ralph implementation
/cal:pre ralph

# Before any significant work (Cal infers from context)
/cal:pre
```

## What Cal Checks

Cal analyzes the current context and dispatches relevant agents:

### For Lisa (Spec Writing)
- **Spec-cleaner**: Check for orphaned specs, stale drafts
- **Explore**: Verify referenced code/systems exist
- **Business-logic-keeper**: Confirm business rules are documented

### For Ralph (Implementation)
- **Pre-flight-checker**: Verify spec is complete and approved
- **Explore**: Check dependencies and target files exist
- **Env-validator**: Verify environment is configured
- **Security-auditor**: Pre-scan for security considerations

### For Database Work
- **Supabase-schema-validator**: Check existing schema state
- **Explore**: Find related migrations and models

### For UI/Frontend Work
- **Typescript-checker**: Verify clean type state before changes
- **Explore**: Check component dependencies

## Dispatch Logic

```
/cal:pre → Cal analyzes:
  1. What type of work is about to start?
  2. What specs/files are involved?
  3. What could go wrong if we start now?

→ Cal dispatches 1-3 relevant agents
→ Agents report findings
→ Cal summarizes: "Ready to proceed" or "Blockers found"
```

## Agent Selection Heuristics

| Context Signal | Agents to Dispatch |
|----------------|-------------------|
| Spec file open/referenced | pre-flight-checker, spec-cleaner |
| Database migration mentioned | supabase-schema-validator |
| Auth/security in scope | security-auditor |
| TypeScript files in scope | typescript-checker |
| Environment variables involved | env-validator |
| Business logic/scoring | business-logic-keeper |
| Unknown/general | explore + pre-flight-checker |

## Output Format

```markdown
## Pre-Flight Check: [Context]

### Dispatched Agents
- [Agent 1]: [Why selected]
- [Agent 2]: [Why selected]

### Findings

#### [Agent 1] Report
[Summary of findings]

#### [Agent 2] Report
[Summary of findings]

### Verdict

**READY** - No blockers found. Proceed with [task].

— or —

**BLOCKED** - Issues to resolve:
- [ ] [Blocker 1]
- [ ] [Blocker 2]
```

## Why This Exists

- Catch problems BEFORE writing code, not after
- Intelligent dispatch = only run relevant checks
- Formalize the "pause before starting" habit
- Prevent drift between spec and implementation
- Part of the pre-flight → fly → post-flight rhythm
