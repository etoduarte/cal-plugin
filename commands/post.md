---
description: "Intelligent post-flight check - dispatch agents to verify work and propagate learnings"
---

# Post - Post-Flight Verification & Learning

**Trigger:** `/cal:post [context]`

**Purpose:** After completing work, intelligently dispatch agents to verify correctness AND propagate learnings back into the system. Cal analyzes what was done and selects appropriate agents.

## Usage

```bash
# After completing Ralph implementation
/cal:post ralph

# After inside-out exploration session
/cal:post inside-out

# After any significant work (Cal infers from context)
/cal:post
```

## Two Responsibilities

### 1. Verification (Did we do it right?)
Dispatch agents to check the work:
- Tests pass?
- Types clean?
- Security sound?
- Schema valid?

### 2. Propagation (What did we learn?)
Update system knowledge with discoveries:
- Update CLAUDE.md with new patterns
- Update agent files with new understanding
- Archive completed specs
- Document new gotchas

## What Cal Checks

Cal analyzes what was just completed and dispatches relevant agents:

### After Implementation (Ralph)
- **Typescript-checker**: Verify types are clean
- **Jest-test-generator**: Run tests, generate for uncovered paths
- **Resilience-auditor**: Check error handling
- **Security-auditor**: Scan for vulnerabilities introduced
- **Spec-cleaner**: Archive completed spec, clean up drafts

### After Database Changes
- **Supabase-schema-validator**: Validate migration and RLS
- **Security-auditor**: Check for data exposure

### After Inside-Out Exploration
- **Cal-journaler**: Record key deltas to cal.md
- **Agent-updater** (conceptual): Propose CLAUDE.md updates based on learnings
- **Spec-cleaner**: Create synthesis if multi-agent session

### After Deployment
- **Post-deploy-health-check**: Verify production is healthy
- **Env-validator**: Confirm environment matches expectations

## Learning Propagation Protocol

After inside-out sessions, Cal should propose updates to:

### CLAUDE.md Updates
```markdown
## Proposed CLAUDE.md Addition

Based on inside-out session: [topic]

### New Understanding
[What we learned that future agents should know]

### New Gotcha
[Counterintuitive thing discovered]

### New Pattern
[Reusable pattern identified]
```

### Agent File Updates
If exploration revealed something an agent should know:
```markdown
## Proposed Agent Update: [agent-name]

### Add to Agent Instructions
[New instruction based on learnings]

### Reason
[What inside-out revealed that led to this]
```

User approves before any updates are made.

## Dispatch Logic

```
/cal:post → Cal analyzes:
  1. What type of work just completed?
  2. What files were changed?
  3. What could be wrong that we haven't caught?
  4. What did we learn that should persist?

→ Cal dispatches 2-4 relevant agents
→ Agents report findings
→ Cal summarizes verification results
→ Cal proposes learning propagation
```

## Agent Selection Heuristics

| Context Signal | Verification Agents | Propagation Actions |
|----------------|--------------------|--------------------|
| Code written | typescript-checker, jest-test-generator | None |
| DB migration added | supabase-schema-validator | None |
| Auth code touched | security-auditor | None |
| Inside-out completed | None | cal-journaler, propose CLAUDE.md updates |
| Spec implemented | spec-cleaner | Archive spec |
| Deployment done | post-deploy-health-check | None |
| Deltas discovered | None | Update CLAUDE.md with gotchas |

## Output Format

```markdown
## Post-Flight Check: [Context]

### Verification

#### Dispatched Agents
- [Agent 1]: [Why selected]
- [Agent 2]: [Why selected]

#### Findings
- [Agent 1]: [Pass/Fail + details]
- [Agent 2]: [Pass/Fail + details]

#### Verdict
**CLEAN** - All checks passed.
— or —
**ISSUES** - Problems found:
- [ ] [Issue 1]
- [ ] [Issue 2]

---

### Learning Propagation

#### Deltas Discovered This Session
- [Delta 1]: BELIEVED X, ACTUAL Y

#### Proposed CLAUDE.md Updates
[Updates to propose, if any]

#### Proposed Agent Updates
[Agent updates to propose, if any]

#### Specs to Archive
- [Spec 1] → Move to /cal/archive/

**Approve propagation?** [User confirms before changes]
```

## Why This Exists

- Catch problems AFTER writing code, before they ship
- Propagate learnings back into the system (agents get smarter)
- Close the loop: exploration → implementation → verification → learning
- Inside-out discoveries shouldn't die in journal files
- Part of the pre-flight → fly → post-flight rhythm
