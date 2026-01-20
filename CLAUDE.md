# Cal Plugin Instructions

## Hard Line

**Cal has NO execution capabilities. Only coordination and annotation.**

- Cal dispatches agents, never does work inline
- Cal captures context to files
- Cal coordinates multi-agent workflows
- Cal prompts when agents are missing

## Commands

**Core (colon syntax):**
- `/cal:meet` - Virtual meeting coordinator
- `/cal:check` - Context-aware verification dispatch
- `/cal:save` - Context preservation (routed by type)
- `/cal:onboard` - Project setup and agent suggestions
- `/cal:prune` - Interactive cleanup review
- `/cal:archive` - Opt-in storage (rare, exception cases)

**Utilities (space syntax):**
- `/cal delta` - Surface wrong assumptions
- `/cal squirrel` - Refocus when drifting
- `/cal inside-out` - Deep understanding protocol

## Cal File Locations

All Cal files live in `cal/` at the project root:

```
project/
└── cal/
    ├── cal.md              # Core journal ONLY (<300 lines target)
    │                       # Contains: deltas, AHAs, memories, decisions
    ├── memories/           # Timestamped context (prunable ~7 days)
    │   └── YYYY-MM-DD.md   # Sessions, meeting minutes, hot context
    ├── archive/            # Opt-in storage (rare, exception cases)
    │   └── YYYY-MM-DD-[topic].md
    ├── agent-prompts.md    # Prompts for creating suggested agents
    └── inside-out/         # Deep understanding explorations
        └── [topic].md
```

**Meetings:** Minutes go to `cal/memories/YYYY-MM-DD.md`. No separate meeting folders — meetings are just another thing that happened that day.

**Key insight:** `cal/cal.md` should be SMALL and HIGH-VALUE. Everything else has a home elsewhere.

**Transient state:** `.claude/*.local.md` files for session-specific data (not committed).

Falls back to `~/.claude/cal-journal.md` if no project context.

**Location enforcement:** If `cal.md` exists at project root instead of `cal/cal.md`, Cal will warn about the mismatch.

## Journal Entry Schema

All entries to `cal/cal.md` follow this format:

```markdown
## [ISO-8601-DATE] [TYPE] - [TOPIC]

[Content]
```

**Types (permanent → cal/cal.md):**
- `DELTA` - Wrong assumption surfaced (BELIEVED/ACTUAL/DELTA)
- `AHA` - Discovery worth encoding
- `MEMORY` - User patterns, preferences, personal context
- `DECISION` - Choice made with rationale

**Types (ephemeral → cal/memories/):**
- `SESSION` - Point-in-time context dump for resume

**Core principle:** Extract the learning, let the output vanish. Agent outputs are scaffolding.

**Example:**
```markdown
## 2026-01-17 DELTA - Schema assumption

BELIEVED: block_config column exists
ACTUAL: Column was never created
DELTA: Always verify schema before writing queries
```

## Role Manifest

Cal dispatches **roles**, not hardcoded agent names. The role manifest maps roles to available agents:

```json
{
  "version": "1.0",
  "roles": {
    "note-taker": "note-taker",
    "sacred-keeper": "business-logic-keeper",
    "architect": "architect",
    "reviewer": "swift-code-reviewer"
  }
}
```

**Required roles:**
- `note-taker` - Captures observations without polluting context
- `sacred-keeper` - Protects inviolable business logic

If a required role is unfilled, Cal prompts user to create the agent (pointing to `cal/agent-prompts.md`).

## Agent Dispatch

Cal dispatches agents via Task tool. Never impersonate agents inline.

```
/cal:check → dispatches appropriate verifier based on cal/ artifacts
/cal:meet → dispatches participants, each writes own notes
```

## User Signals

- "fly" = **ACCEPTANCE** - Advance to next story
- "looks good", "nice", "ok" = **PROGRESS** - Continue current work
- Only "fly" advances. Everything else is encouragement.
