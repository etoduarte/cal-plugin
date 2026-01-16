---
description: "Quality gate after action"
---

# Review - Quality Gate After Action

**Trigger:** `/cal:review` or `/cal:review [agents]`

**Purpose:** Verify quality after implementation. Combines post-flight and dispatch.

## When to Use

- After completing a user story
- After significant refactoring
- Before commits
- Before acceptance (`/cal:fly`)

## Default Review (Post-Flight)

Dispatches: `atomizer`, `bart`, `typescript-checker`

```bash
/cal:review              # Run default agents
/cal:review post-flight  # Same as above
```

## Custom Review

```bash
/cal:review atomizer           # Single agent
/cal:review atomizer,bart      # Multiple agents
/cal:review security           # Pre-defined set
```

## Pre-defined Sets

| Set | Agents |
|-----|--------|
| `post-flight` | atomizer, bart, typescript-checker |
| `security` | security-auditor, supabase-schema-validator |
| `contamination` | beta-contamination-hunter, beta-enthusiast |

## Available Agents

**Quality:** atomizer, bart, architect, typescript-checker
**Compliance:** pre-flight-checker, business-logic-keeper, beta-contamination-hunter
**Security:** security-auditor, supabase-schema-validator, resilience-auditor
**Testing:** jest-test-generator

## Output

```markdown
## Review Results

**Agents:** [list]

### Findings
- **atomizer:** [result]
- **bart:** [result]

### Status: CLEAR | ISSUES

**Action Items:**
- [Item if any]
```
