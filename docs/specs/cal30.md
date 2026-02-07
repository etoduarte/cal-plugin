# Cal 3.0 — Specification

**Feature:** Cal 3.0 — Major plugin redesign leveraging Opus 4.6 capabilities
**Created:** 2026-02-07
**Status:** APPROVED

---

## Summary

Cal 3.0 is a structural redesign of the Cal plugin based on three key insights:

1. **CLAUDE.md and .claude/rules/ are the most reliable behavioral enforcement mechanisms** — auto-loaded every session, no activation gap (Vercel data: 100% pass rate vs 53% for skills)
2. **Auto-invoke skills are unreliable** — skills fail to activate 56% of the time. All auto-invoke behaviors move to .claude/rules/ files
3. **Opus 4.6 enables new patterns** — native agent teams, Tasks DAG, context: fork, 1M context, adaptive thinking

Cal's core identity stays the same: a coordinator that manages pipelines, dispatches agents, and captures learnings. The implementation moves from scattered skills to a layered architecture that guarantees behavioral rules are always active.

---

## Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Dispatch → .claude/rules/coordinator.md | Always-on coordinator behavior, no skill activation needed |
| D2 | Remove coordinator-guard hook | Trust behavioral rules; allow overrides for quick fixes |
| D3 | Dynamic pipeline phases | Cal proposes phases per-idea based on complexity, not fixed 8-phase sequence |
| D4 | Cal proposes pipeline, user approves | Can consult expert agents to inform proposal |
| D5 | Meeting auto-detect end | No stop-hook loop; Cal detects conversation drift, offers to wrap up |
| D6 | team.md → agents.md | Human-readable roster referencing .claude/agents/ definitions |
| D7 | Merge NOW.md + INDEX.md → NOW.md | One file for current focus and pipeline state |
| D8 | Auto-invoke behaviors → .claude/rules/ | tone-awareness, squirrel, delta, coordinator |
| D9 | ideas/ = parking lot only | Unstructured, low-ceremony; active work goes to docs/specs/ |
| D10 | Active work = docs/specs/ + NOW.md | Specs hold artifacts, NOW.md tracks state |
| D11 | Analysis modes in cal/analysis.md | Brief mention in CLAUDE.md, full protocols loaded on demand |
| D12 | Seven analysis modes | Cake Walk, Rubbernecking, Inside-Out, Burst Mode, Bisect, Trace, Diff Audit |
| D13 | Remove stop-hook entirely | No looping mechanism; meetings are inline conversations |
| D14 | Unified /cal:analyze [mode] | Replaces /cal:inside-out; one command for all 7 analysis modes |
| D15 | /cal:onboard generates/edits CLAUDE.md | If missing: generate. If exists: suggest improvements. Non-destructive. |
| D16 | Keep memory system as-is for 3.0 | cal.md + cal/memories/ stays; 3.1 will refactor with Supabase sync |

---

## Architecture

### File Structure

```
project/
├── CLAUDE.md                          # Lean identity (~50 lines)
├── .claude/
│   ├── rules/
│   │   ├── coordinator.md             # Dispatch behavior + approval gates
│   │   ├── tone-awareness.md          # Frustration/joy detection (was lifeline)
│   │   ├── squirrel.md                # Drift/scope creep detection
│   │   └── delta.md                   # Wrong assumption detection
│   └── agents/
│       ├── coder.md                   # Implementation agent
│       ├── reviewer.md                # Code review agent
│       └── architect.md               # Design/architecture agent
├── cal/
│   ├── agents.md                      # Team roster (human-readable)
│   ├── cal.md                         # Permanent learnings journal
│   ├── NOW.md                         # Current focus + pipeline state
│   ├── analysis.md                    # 7 analysis mode protocols
│   ├── memories/                      # Ephemeral session/meeting context
│   ├── OOD.md                         # Code principles
│   ├── DESIGN.md                      # Visual design system
│   └── PREFERENCES.md                 # Infrastructure stack
├── skills/                            # Explicit user-invoked commands only
│   ├── next/SKILL.md                  # Advance pipeline
│   ├── meet/SKILL.md                  # Meeting facilitator (simplified)
│   ├── save/SKILL.md                  # Context preservation
│   ├── onboard/SKILL.md               # Project setup + CLAUDE.md generation
│   └── analyze/SKILL.md               # 7 analysis modes (replaces inside-out)
├── ideas/                             # Parking lot (unstructured)
│   └── hopper.md                      # Idea dump
├── docs/
│   └── specs/                         # Active work artifacts
└── hooks/
    └── hooks.json                     # Minimal (no coordinator-guard, no stop-hook)
```

### Layer Responsibility

| Layer | Location | Purpose | Loaded |
|-------|----------|---------|--------|
| Identity + commands | CLAUDE.md | Who Cal is, what commands exist | Every session |
| Behavioral rules | .claude/rules/*.md | How Cal behaves (dispatch, detect drift, etc.) | Every session (auto) |
| Agent definitions | .claude/agents/*.md | Team members Cal can dispatch | On dispatch |
| Explicit commands | skills/*.md | User-invoked workflows | When invoked |
| Brain | cal/*.md | Learnings, state, preferences | On demand |
| Analysis protocols | cal/analysis.md | Deep-dive methodologies | On demand via @import |

### CLAUDE.md (~50 lines)

```markdown
# Cal Plugin

Cal is a coordinator — manages pipeline, dispatches agents, captures learnings.

## Commands

| Command | Purpose |
|---------|---------|
| /cal:next | Advance pipeline - find and execute next step |
| /cal:meet | Meeting facilitator |
| /cal:save | Context preservation |
| /cal:onboard | Project setup + CLAUDE.md generation |
| /cal:analyze [mode] | Deep investigation (7 modes) |

## Analysis Modes

For deep investigation, Cal offers: Cake Walk (layering bugs), Rubbernecking (focused scan), Inside-Out (comprehensive understanding), Burst Mode (temporal comparison), Bisect (binary search), Trace (end-to-end follow), Diff Audit (state comparison). See @cal/analysis.md for protocols.

## Team

See cal/agents.md for roster. Agent definitions in .claude/agents/.

## Brain

| File | Purpose |
|------|---------|
| cal/cal.md | Permanent learnings (deltas, decisions, AHAs) |
| cal/NOW.md | Current focus + active pipeline |

## Preferences

- **Stack:** @cal/PREFERENCES.md
- **Design:** @cal/DESIGN.md
- **Code principles:** @cal/OOD.md

## Approval Gates

Phase advancement requires explicit approval: "approved", "advance", "next phase", or /approve.
"looks good", "nice", "ok" = encouragement, NOT advancement.
```

---

## Behavioral Rules Detail

### .claude/rules/coordinator.md

Cal's core identity as coordinator:
- Never writes implementation code directly (dispatches to Coder agent)
- When user requests implementation ("build", "implement", "fix", "add"), reads cal/agents.md and dispatches via Task tool
- Can be overridden if user explicitly asks for a quick inline fix
- Enforces approval gates for phase advancement
- Proposes dynamic pipeline per idea, waits for user approval before proceeding

### .claude/rules/tone-awareness.md

Detects emotional signals in user messages:
- **Frustration:** ALL CAPS, profanity, repeated corrections, "STOP", "NO", "JUST", exasperation markers
- **Joy:** "YES!", "Perfect!", exclamation + positive words, rapid idea building, momentum
- On frustration: Stop immediately, acknowledge, summarize what was happening, ask how to proceed
- On joy: Acknowledge momentum, name what's clicking, offer to keep going or capture the insight

### .claude/rules/squirrel.md

Detects task drift and scope creep:
- "One more thing..." mid-task
- Sudden pivot without closing current work
- Third iteration on same decision without new info
- Simple request becoming complex system
- On detection: Pause, state what's happening, ask "Stay on current task or intentionally pivot?"
- Bidirectional: Cal can call squirrel on user, user can call squirrel on Cal

### .claude/rules/delta.md

Detects wrong assumptions:
- Reality doesn't match expectation
- Test fails unexpectedly
- User corrects something Cal was confident about
- Blunt correction words: "INSTEAD", "NOT", "ACTUALLY"
- On detection: State the belief, read the actual source, report BELIEVED/ACTUAL/DELTA/ENCODED format
- Writes to cal/cal.md as permanent learning

---

## Analysis Modes (cal/analysis.md)

### 1. Cake Walk
**Best for:** Layering bugs (CSS stacking, SwiftUI view hierarchy, z-index issues)
**Method:** Peel layers top-down. At each layer, verify the layer is behaving correctly before moving deeper. The bug lives where a layer violates its contract with adjacent layers.

### 2. Rubbernecking
**Best for:** You have a suspect but need confirmation across the codebase
**Method:** Full code scan while fixating on one specific issue. Read every file through the lens of "could this be related to [suspect]?" Document every connection found. Verdict: confirmed, ruled out, or inconclusive with evidence.

### 3. Inside-Out
**Best for:** Comprehensive understanding of a system, concept, or domain (NOT bug-fixing)
**Method:** Start at the widest definition of the question. Narrow down into every rabbit hole. At the bottom, zoom back up to the top, re-evaluating each layer with knowledge gained deeper in. Journal extensively. Produce condensed insight at the end.

### 4. Burst Mode
**Best for:** Temporal comparison — tracking drift in data, configs, metrics over time
**Method:** Capture snapshots at defined intervals or states. Compare snapshots systematically. Catalog what changed, when, and whether the change correlates with the problem. Best used with git history, database snapshots, or metric dashboards.

### 5. Bisect
**Best for:** "It broke but I don't know when or where" — isolating root cause
**Method:** Binary search the problem space. Define "works" and "broken" states. Halve the search space repeatedly until the root cause is isolated. Can bisect across time (git bisect), across code (comment out halves), or across config (toggle features).

### 6. Trace
**Best for:** "Where does this value come from?" — following data end-to-end
**Method:** Pick one data point, event, or request. Trace it from input to output through every system boundary. Document each transformation, handoff, and decision point. The bug lives where the trace breaks or the data transforms unexpectedly.

### 7. Diff Audit
**Best for:** "It worked before, what changed?" — cataloging differences between states
**Method:** Compare two known states (branches, deployments, configs, environments). Catalog every difference systematically. Classify each diff as: relevant, irrelevant, or uncertain. Investigate the relevant and uncertain diffs.

---

## Skills (Explicit Commands)

### /cal:next — Advance Pipeline

Updated for dynamic pipelines:
1. Read cal/NOW.md for current state
2. If no active work: check ideas/hopper.md, ask user what to pull
3. If active work: determine next action based on current phase
4. Cal proposes next phase, waits for user approval
5. Can consult expert agents (.claude/agents/) to inform proposal
6. On approval: execute phase, update NOW.md, commit if gate passed

### /cal:meet — Meeting Facilitator

Simplified (no stop-hook):
1. Set facilitation mode (Cal becomes meeting coordinator)
2. Onboard missing parameters (topic, participants, instructions)
3. Dispatch participant agents as needed via Task tool
4. Facilitate discussion, capture decisions, note parking lot items
5. Auto-detect when conversation drifts from meeting topic
6. Offer to wrap up and generate minutes
7. Save minutes to cal/memories/YYYY-MM-DD.md
8. Ask if any decisions need protection (→ cal.md)

### /cal:save — Context Preservation

Unchanged from Cal 2.0:
- `delta` → cal.md (permanent)
- `aha` → cal.md (permanent)
- `memory` → cal.md (permanent)
- `decision` → cal.md (permanent)
- `session` → cal/memories/YYYY-MM-DD.md (prunable)

### /cal:onboard — Project Setup + CLAUDE.md Generation

Updated:
1. Scan codebase for framework/language markers
2. If CLAUDE.md missing: generate optimized CLAUDE.md with detected stack, build commands, and Cal config
3. If CLAUDE.md exists: scan it, suggest improvements (missing build commands, stale rules, missing Cal sections)
4. Create cal/ structure (cal.md, NOW.md, agents.md, analysis.md, etc.)
5. Create .claude/rules/ with Cal behavioral rules
6. Create .claude/agents/ with default team (Coder, Reviewer, Architect)
7. Suggest additional agents based on detected patterns

### /cal:analyze [mode] — Deep Investigation

New unified command replacing /cal:inside-out:
1. If no mode specified: Cal reads the problem description and suggests the best mode
2. If mode specified: load protocol from cal/analysis.md
3. Execute the analysis protocol
4. Produce structured output (findings, deltas discovered, recommendations)
5. Offer to save key learnings to cal.md

---

## Removed Components

| Component | Reason |
|-----------|--------|
| `commands/` directory | Migrated to skills/ (canonical format) |
| `hooks/coordinator-guard.sh` | Replaced by .claude/rules/coordinator.md behavioral rule |
| `hooks/stop-hook.sh` | Removed; meetings are inline, auto-detect end |
| `scripts/setup-meet.sh` | Meet simplified, no bash setup needed |
| `cal/INDEX.md` | Merged into NOW.md |
| `cal/team.md` | Renamed to cal/agents.md |
| `cal/agent-prompts.md` | Replaced by .claude/agents/*.md definitions |
| `skills/lifeline/` | Moved to .claude/rules/tone-awareness.md |
| `skills/delta/` | Moved to .claude/rules/delta.md |
| `skills/squirrel/` | Moved to .claude/rules/squirrel.md |
| `skills/dispatch/` | Moved to .claude/rules/coordinator.md |
| `commands/inside-out.md` | Replaced by skills/analyze/SKILL.md |

---

## Implementation Phases

### Phase 1: Architecture
- Rewrite CLAUDE.md (lean ~50 lines)
- Create .claude/rules/ with coordinator.md, tone-awareness.md, squirrel.md, delta.md
- Create .claude/agents/ with coder.md, reviewer.md, architect.md
- Create cal/agents.md (team roster)
- Merge INDEX.md into NOW.md
- Remove coordinator-guard.sh and stop-hook.sh
- Update hooks.json (minimal)

**Verification:** Claude Code loads the rules files every session. Cal behaves as coordinator without skill invocation. Squirrel/delta/tone-awareness detection works from rules.

### Phase 2: Skills Migration
- Migrate commands/ to skills/ format
- Create skills/analyze/SKILL.md (unified 7-mode command)
- Update skills/meet/SKILL.md (simplified, no stop-hook dependency)
- Update skills/next/SKILL.md (dynamic pipeline support)
- Update skills/onboard/SKILL.md (CLAUDE.md generation)
- Remove old commands/ directory
- Remove old auto-invoke skills (lifeline, delta, squirrel, dispatch)

**Verification:** All /cal: commands work. /cal:analyze [mode] triggers correct protocol. /cal:meet runs without stop-hook.

### Phase 3: Analysis Modes
- Write cal/analysis.md with full protocols for all 7 modes
- Each mode has: name, best-for, method, output format, examples
- Add @cal/analysis.md import to CLAUDE.md

**Verification:** /cal:analyze inside-out, /cal:analyze bisect, etc. each produce structured output following the protocol.

### Phase 4: Onboard Update
- Update skills/onboard/SKILL.md to scan codebase and generate/suggest CLAUDE.md
- Onboard creates .claude/rules/ and .claude/agents/ structure
- Onboard detects existing CLAUDE.md and suggests non-destructive improvements
- Remove cal/agent-prompts.md (replaced by .claude/agents/)
- Clean up scripts/ directory

**Verification:** /cal:onboard on a fresh project generates working CLAUDE.md, rules, and agents. On existing project, suggests improvements without destroying existing config.

---

## Future: Cal 3.1 (Out of Scope)

- **Supabase memory sync** — cal.md, memories/, and project files sync across computers and projects
- **Portable Cal** — Cal brain travels with you, not stuck in one repo
- **Memory refactor** — Rethink cal.md vs cal/memories/ split with sync in mind
