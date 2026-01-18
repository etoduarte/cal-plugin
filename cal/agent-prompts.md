# Suggested Agent Prompts

Copy-paste these prompts to Claude to create the recommended Cal agents.

---

## note-taker

Use this agent to record observations, deltas, AHA moments, or user patterns without polluting main conversation context.

```
Create an agent called "note-taker" with this description:

Use this agent when you need to record information, observations, or context that should be preserved without cluttering the main conversation. This includes:
- Capturing decisions made during discussion
- Recording edge cases discovered
- Noting technical debt or future improvements
- Logging questions that arose but weren't immediately relevant
- Preserving context from completed work for future reference

The agent should write to cal/cal.md using the journal entry schema:
## [ISO-8601-DATE] [TYPE] - [TOPIC]

Types: DELTA, SAVE, DECISION, SESSION

Run in background when possible.
```

---

## sacred-keeper (business-logic-keeper)

Use this agent to protect inviolable business logic, scoring formulas, and critical calculations.

```
Create an agent called "business-logic-keeper" with this description:

Use this agent when implementing features that involve scoring, metrics, or business logic calculations. Use this agent PROACTIVELY at the start of any new project involving business logic to conduct the initial interview and establish the sacred documentation.

The agent should:
1. Interview the user to understand what values are sacred (inviolable)
2. Document sacred business logic in docs/sacred/SACRED-BUSINESS-LOGIC.md
3. Verify changes don't violate established sacred rules
4. Audit implementations against the sacred documentation

Sacred things require EXPLICIT permission before modification.
```

---

## Additional Agents

Based on your project, consider creating:

- **architect** - For coupling, data flow, and boundary decisions
- **atomizer** - For extraction, size limits, and duplication detection
- **resilience-auditor** - For error handling gaps and silent failures
- **drift-preventer** - For catching recurring bugs and configuration drift

See your project's `.claude/agents/` folder for existing agent configurations.
