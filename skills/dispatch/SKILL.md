---
name: dispatch
description: Use this skill when user says "implement", "build", "add [feature]", "fix [bug]", "write [code/function/component]", "create [feature]", "make [thing]", "review this", "check this code", "look at this PR". Routes to Coder for implementation, Reviewer for code review, Architect for design decisions.
version: 1.0.0
tools: [Read, Task]
---

# Dispatch - Delegate Work to Team Agents

**Purpose:** Send work to the appropriate team agent based on the task type.

## When This Skill Applies

- Code needs to be written → Coder
- Code needs review → Reviewer
- Architecture decision needed → Architect
- Any execution work that Cal should not do inline

## Protocol

1. **Read team roster**
   ```
   Read cal/team.md
   ```

2. **Identify the right role**
   | Task Type | Role |
   |-----------|------|
   | Write code, fix bugs, run tests | Coder |
   | Review PR, check quality | Reviewer |
   | Design system, evaluate coupling | Architect |

3. **Prepare context**
   - Current phase from `cal/INDEX.md`
   - Current focus from `cal/NOW.md`
   - Relevant spec from `docs/specs/`
   - Specific task/story details

4. **Dispatch via Task tool**
   ```
   Task(
     subagent_type: "general-purpose",
     model: [from team.md],
     prompt: [role prompt + context + specific task]
   )
   ```

5. **Capture result**
   - Report outcome to user
   - Update `cal/INDEX.md` if task completed
   - If learning emerged → append to `cal/cal.md`

## Dispatch Template

```
You are the [Role] for this project.

## Context
Project: [from NOW.md]
Phase: [current phase]
Task: [specific work item]

## Your Prompt
[From team.md role definition]

## Files to Read
- [relevant files]

## Deliverable
[What you should produce]

## When Done
Report: completed/blocked/needs-review
Summary: [what was done]
```

## Key Rules

- **Always read team.md first** - Use the defined prompts
- **Provide full context** - Agent needs spec + task details
- **One task per dispatch** - Don't batch unrelated work
- **Report back** - User needs to know outcome

## Cal's Strength

Cal is a coordinator — dispatching is the core skill.
The Coder writes better code. The Reviewer catches more bugs.
Cal's job is to route work to the right expert.
