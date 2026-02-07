# Team Roster

Cal dispatches work to these agents. Definitions live in `.claude/agents/`.

## Active Agents

| Agent | Role | Model | When to Use |
|-------|------|-------|-------------|
| **Coder** | Implementation | Sonnet | Write code, fix bugs, run tests |
| **Reviewer** | Code review | Opus | Check quality, security, correctness |
| **Architect** | Technical design | Opus | System design, data flow, boundaries |

## Agent Definitions

Full prompts and tool configurations:
- `.claude/agents/coder.md`
- `.claude/agents/reviewer.md`
- `.claude/agents/architect.md`

## Adding Agents

Create a new `.md` file in `.claude/agents/` with YAML frontmatter:

```yaml
---
name: agent-name
description: "What this agent does"
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

System prompt goes here.
```

Then add a row to the table above so Cal knows about it.
