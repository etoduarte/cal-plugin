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
- `/cal:save` - Journal context preservation
- `/cal:onboard` - Project setup and agent suggestions

**Utilities (space syntax):**
- `/cal delta` - Surface wrong assumptions
- `/cal squirrel` - Refocus when drifting
- `/cal inside-out` - Deep understanding protocol

## Cal File Locations

All Cal files live in `cal/` at the project root:

```
project/
└── cal/
    ├── cal.md              # Main journal (deltas, saves, decisions)
    ├── agent-prompts.md    # Prompts for creating suggested agents
    ├── inside-out/         # Deep understanding explorations
    │   └── [topic].md
    └── meetings/           # Meeting artifacts
        └── [date]-[topic]/
            ├── notes.md
            ├── minutes.md
            └── participant-[agent].md
```

**Transient state:** `.claude/*.local.md` files for session-specific data (not committed).

Falls back to `~/.claude/cal-journal.md` if no project context.

## Journal Entry Schema

All entries to `cal/cal.md` follow this format:

```markdown
## [ISO-8601-DATE] [TYPE] - [TOPIC]

[Content]
```

**Types:**
- `DELTA` - Wrong assumption surfaced (BELIEVED/ACTUAL/DELTA)
- `SAVE` - Context preservation
- `DECISION` - Decision recorded with rationale
- `SESSION` - Session summary

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
