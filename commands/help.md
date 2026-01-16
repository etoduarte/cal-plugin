---
description: "Cal toolkit documentation"
---

# Cal's Toolkit - Help

Cal is your project manager / scrum master. Brings in specialized coworkers (agents) when needed, and makes them smarter over time through learning propagation.

## Commands

### Core Workflow

| Command | Purpose |
|---------|---------|
| `/cal:pre` | **Pre-flight** - Dispatch agents to verify readiness |
| `/cal:fly` | **Accept** - Story accepted, proceed |
| `/cal:post` | **Post-flight** - Verify work + propagate learnings |

### Exploration

| Command | Purpose |
|---------|---------|
| `/cal:inside-out [subject]` | Deep single-agent exploration |
| `/cal:inside-out session [topic]` | Multi-agent parallel exploration |
| `/cal:profile` | Create/update global user profile |
| `/cal:handoff [recipient]` | Extract findings for next phase |

### Recalibration

| Command | Purpose |
|---------|---------|
| `/cal:check` | Verify before action |
| `/cal:review` | Quality gate after action |
| `/cal:squirrel` | Stop drifting, refocus |
| `/cal:delta` | Surface wrong assumptions |
| `/cal:save` | Context preservation |
| `/cal:reset` | Nuclear context reset |

## Quick Reference

```
# Workflow rhythm
/cal:pre              - Verify ready to start
/cal:fly              - Accept and advance
/cal:post             - Verify complete + learn

# Exploration
/cal:inside-out       - Deep understanding (single agent)
/cal:inside-out session "topic"  - Multi-lens parallel exploration
/cal:profile          - Create global user profile
/cal:handoff lisa     - Extract findings for Lisa
/cal:handoff ralph    - Extract findings for Ralph

# Quality
/cal:check            - Verify before starting
/cal:review           - Quality gate after finishing
/cal:review atomizer  - Run specific agent

# Recovery
/cal:squirrel         - Stop and refocus
/cal:delta            - BELIEVED/ACTUAL/DELTA
/cal:save             - Quick log to cal.md
/cal:save session     - Full state dump
/cal:reset            - Nuclear option
```

## The Rhythm

```
/cal:pre → implement → /cal:post → /cal:fly → next
    ↑                      │
    │                      ↓
    └──── learnings propagate back ────┘
```

## Learning Loop

Cal solves agent amnesia through file-based memory:

```
Inside-out exploration
        ↓
   Discoveries (deltas, patterns, gotchas)
        ↓
   /cal:post
        ↓
   Propose updates to CLAUDE.md / agent files
        ↓
   User approves
        ↓
   Next session: agents start smarter
```

Agents don't remember between sessions—but their instruction files do.

## User Signals

| Signal | Meaning | Action |
|--------|---------|--------|
| "fly" | **ACCEPTANCE** | Advance workflow |
| "looks good", "nice" | **PROGRESS** | Continue current work |

**Only "fly" advances.** Everything else = keep going.

## Cal's Coworkers (Agents)

Cal dispatches these specialists as needed:

| Agent | Specialty |
|-------|-----------|
| **Explore** | Codebase navigation, finding files |
| **Typescript-checker** | Type verification |
| **Jest-test-generator** | Test creation and running |
| **Supabase-schema-validator** | DB migration and RLS audit |
| **Security-auditor** | Vulnerability scanning |
| **Resilience-auditor** | Error handling gaps |
| **Spec-cleaner** | Documentation hygiene |
| **Pre-flight-checker** | Readiness verification |
| **Post-deploy-health-check** | Production verification |
| **Business-logic-keeper** | Business rules guardian |
| **Atomizer** | Code extraction, deduplication |

Agents get smarter over time as `/cal:post` propagates learnings back into their instruction files.

## Execution Gate

Outside Ralph loop: **STOP.** Get explicit permission before implementing user stories.
