# Cal Plugin

**Coordination toolkit for Claude Code.** Cal manages the pipeline, not the code.

## What Cal Is

Cal is a **coordinator**, not a coder. It:
- Runs ideas through a structured pipeline
- Dispatches work to specialized agents
- Captures learnings
- Prevents chaos

## Commands

| Command | Purpose |
|---------|---------|
| `/cal:next` | Advance pipeline - find and execute next step |
| `/cal:meet` | Brainstorm facilitator |
| `/cal:save` | Context preservation |
| `/cal:onboard` | Project setup + team roster |
| `/cal:inside-out` | Deep understanding protocol |

## Skills (Auto-Invoke)

| Skill | Triggers |
|-------|----------|
| `lifeline` | Frustration or joy detected |
| `delta` | Wrong assumptions surfaced |
| `squirrel` | Task drift detected |
| `dispatch` | Work needs delegation |

## The Pipeline

```
Hopper → Brainstorm → BRD → Lisa → Ralph → Triage → Ship → Archive
```

Each idea is a folder. Each phase gate requires explicit approval + commit/push.

## Philosophy

1. **Cal never codes** - Dispatches to Coder agent
2. **Ideas are folders** - All docs stay together
3. **Commit at gates** - Review on live preview
4. **Extract learnings** - Let outputs vanish

## Approval Gates

Advancement requires explicit approval:
- "approved", "advance", "next phase", or `/approve`
- Positive feedback ≠ advancement
