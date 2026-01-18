---
description: "Context-aware verification dispatch"
argument-hint: "[pre|post|review]"
---

# Check - Context-Aware Verification Dispatch

**Trigger:** `/cal:check` or `/cal:check [context]`

**Purpose:** Dispatch appropriate verification agents based on context. Cal analyzes what's happening and selects the right verifiers.

## Hard Line

**Cal does NOT verify inline.** Cal reads context from `cal/` artifacts and dispatches agents. No file reading for verification, no inline analysis.

## Usage

```bash
# Auto-detect context from cal/ artifacts
/cal:check

# Explicit context
/cal:check pre      # Before starting work
/cal:check post     # After completing work
/cal:check review   # Quality gate before commit
```

## Context Detection

Cal reads `cal/` folder artifacts to infer work type:

| Artifact Found | Inferred Context | Agents to Dispatch |
|----------------|------------------|-------------------|
| Recent SAVE entry | Pre-flight | pre-flight-checker |
| Meeting notes open | Pre-meeting | explore |
| Recent implementation | Post-flight | typescript-checker, atomizer |
| Migration files changed | Database | supabase-schema-validator |
| Auth code touched | Security | security-auditor |
| Spec just completed | Review | spec-cleaner, architect |

## Pre-Flight Context (before work)

When starting new work, check dispatches:

- **pre-flight-checker** - Spec verification, drift detection
- **explore** - Verify referenced code exists
- **business-logic-keeper** - If touching sacred areas

Output: "READY to proceed" or "BLOCKED - issues to resolve"

## Post-Flight Context (after work)

When work completes, check dispatches:

- **typescript-checker** - Verify types are clean
- **atomizer** - Check for extraction opportunities
- **resilience-auditor** - Scan for error handling gaps
- **spec-cleaner** - Archive completed specs

Output: "CLEAN - all checks passed" or "ISSUES found"

## Review Context (quality gate)

Before commits, check dispatches:

- **atomizer** - Final extraction check
- **architect** - Coupling and boundary review
- **typescript-checker** - Types clean

Output: "CLEAR for commit" or "ISSUES to address"

## Dispatch Protocol

1. Read `cal/cal.md` for recent entries
2. Check `cal/meetings/` for active meetings
3. Infer work type from artifacts
4. Select 1-3 agents based on role manifest
5. Dispatch agents via Task tool
6. Report results without interpreting

## Output Format

```markdown
## Check: [Inferred Context]

### Context Signals
- [Signal 1]: [What was detected]
- [Signal 2]: [What was detected]

### Dispatched Agents
- [Role] → [Agent]: [Why selected]

### Results
[Agent reports - passed through without interpretation]

### Verdict
**[READY|CLEAN|CLEAR]** - [One line summary]
— or —
**[BLOCKED|ISSUES]** - Action required:
- [ ] [Item 1]
- [ ] [Item 2]
```

## Why This Exists

- One verification command for all contexts
- Cal orchestrates, agents verify
- Context detection from files keeps it deterministic
- No inline analysis - pure dispatch
