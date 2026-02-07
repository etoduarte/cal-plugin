# Spec: Cal Plugin Restructure

**Status:** PENDING
**Created:** 2026-02-07
**Version:** 1.0

---

## Summary

Restructure Cal's plugin architecture from a skills-only format to the three-layer architecture used by Claude Code plugins: **commands** for user-facing `/cal:XXX` invocations, **skills** for reference material injected into agent context, and **agents** for autonomous executors with model selection, tools, and hooks.

## Motivation

Cal 3.0 moved all user-facing invocations from `commands/` (2.0) to `skills/` (3.0). This was a regression:
- Lost argument support (skills don't take parameters)
- Lost `<Task>` dispatch with Handlebars templating
- Lost `disable-model-invocation` (coordinator enforcement at the format level)
- Lost `allowed_tools` whitelisting per command
- Agents lack model selection, declarative skill references, and hooks

## Architecture

### Layer 1: Commands (`commands/*.md`)

User-facing `/cal:XXX` invocations. Each command is a flat `.md` file in `commands/`.

| Command | Arguments | `disable-model-invocation` | Execution |
|---------|-----------|----------------------------|-----------|
| `analyze` | `argument: "mode subject (optional) - Analysis mode and subject"` | No | Cal facilitates inline |
| `meet` | `argument: "topic (optional) - Meeting topic"` | Yes | Dispatches participant agents via `<Task>` |
| `next` | (none) | Yes | Cal reads state, dispatches dynamically |
| `onboard` | (none) | No | Executes directly |
| `save` | `argument: "type content - Save type and content"` | No | Executes directly |

**Command frontmatter format:**
```yaml
---
name: analyze
description: "Deep investigation with 7 analysis modes..."
argument: "mode subject (optional) - Analysis mode and subject"
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "AskUserQuestion", "Bash"]
---
```

For commands with `disable-model-invocation: true` (`meet`, `next`):
```yaml
---
name: next
description: "Advance the pipeline - find and execute next step"
disable-model-invocation: true
allowed_tools: ["Task"]
---
```

### Layer 2: Skills (`skills/*/SKILL.md`)

Reference material loaded into agent context via declarative `skills:` references.

| Skill | Purpose | Referenced by |
|-------|---------|---------------|
| `cal-ood` | OOD principles, violation patterns, commandments, compliance test | coder, reviewer, architect |

**`skills/cal-ood/SKILL.md`** — Derived from `cal/OOD.md`. Contains:
- The Three Pillars (Self-Describing Data, Behavioral Fences, Unified Interfaces)
- The Five Commandments (no utils, classes over plain objects, getters for derived state, collections on parent, hot potato)
- Red-flag file patterns
- The OOD Compliance Test
- Translation Boundaries pattern

This is the **canonical OOD source**. The behavioral rule (`.claude/rules/ood.md`) and the PreToolUse hook both reference these same principles but in condensed form appropriate to their context. Not DRY — consistent.

### Layer 3: Agents (`.claude/agents/*.md`)

Autonomous executors with full configuration.

#### coder.md
```yaml
---
name: coder
description: |
  Implementation agent. Writes code, runs tests, fixes bugs.

  <example>
  user: "Implement the login screen"
  assistant: [Launches coder agent]
  </example>

  <example>
  user: "Fix the bug in checkout"
  assistant: [Launches coder agent]
  </example>

  <example>
  user: "Add dark mode support"
  assistant: [Launches coder agent]
  </example>
model: sonnet
tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
skills:
  - cal-ood
hooks:
  PreToolUse:
    - matcher: Write
      hooks:
        - type: command
          command: "bash -c 'if echo \"$TOOL_INPUT_FILE_PATH\" | grep -qiE \"(Utils|Helper|Service|Manager|Calculator)\\.\"; then echo \"OOD VIOLATION: File name matches red-flag pattern. Pull this logic onto the domain object instead. See cal/OOD.md.\"; fi; exit 0'"
    - matcher: Edit
      hooks:
        - type: command
          command: "bash -c 'if echo \"$TOOL_INPUT_FILE_PATH\" | grep -qiE \"(Utils|Helper|Service|Manager|Calculator)\\.\"; then echo \"OOD VIOLATION: File name matches red-flag pattern. Pull this logic onto the domain object instead. See cal/OOD.md.\"; fi; exit 0'"
---
```

#### reviewer.md
```yaml
---
name: reviewer
description: |
  Code review specialist. Checks for bugs, security issues, OOD compliance, and adherence to project standards.

  <example>
  user: "Review this code"
  assistant: [Launches reviewer agent]
  </example>

  <example>
  user: "Check my PR for issues"
  assistant: [Launches reviewer agent]
  </example>
model: opus
tools:
  - Read
  - Grep
  - Glob
  - Bash
skills:
  - cal-ood
---
```

#### architect.md
```yaml
---
name: architect
description: |
  Architecture advisor. Evaluates system design, data flow, boundaries, and extensibility.

  <example>
  user: "How should I structure this?"
  assistant: [Launches architect agent]
  </example>

  <example>
  user: "What's the right pattern for this?"
  assistant: [Launches architect agent]
  </example>
model: opus
tools:
  - Read
  - Grep
  - Glob
skills:
  - cal-ood
---
```

## Manifest (`claude-code.json`)

```json
{
  "name": "cal",
  "version": "3.1.0",
  "description": "Object-oriented coordinator — manages pipelines, dispatches agents, enforces OOD",
  "author": "Cal",
  "license": "MIT",
  "commands": [
    "./commands/analyze.md",
    "./commands/meet.md",
    "./commands/next.md",
    "./commands/onboard.md",
    "./commands/save.md"
  ],
  "skills": [
    {
      "name": "cal-ood",
      "description": "Object-Oriented Data principles, violation patterns, and compliance test"
    }
  ]
}
```

## OOD Consistency

Three layers of OOD enforcement, each in its appropriate context:

| Layer | File | Audience | Depth |
|-------|------|----------|-------|
| Behavioral rule | `.claude/rules/ood.md` | Main conversation (Cal) | Violation detection triggers + response format |
| Skill | `skills/cal-ood/SKILL.md` | Agents (via `skills:` reference) | Full OOD principles for context injection |
| Hook | Agent `hooks.PreToolUse` | Coder agent | File-name pattern guard (red-flag detection) |

All three reference the same principles. The rule detects violations in conversation. The skill teaches agents the principles. The hook catches violations at the tool level. Not DRY — **consistent with appropriate depth per context.**

## File Changes

### Create
- `commands/analyze.md` — from `skills/analyze/SKILL.md` content, reformatted as command
- `commands/meet.md` — from `skills/meet/SKILL.md` content, reformatted as command
- `commands/next.md` — from `skills/next/SKILL.md` content, reformatted as command
- `commands/onboard.md` — from `skills/onboard/SKILL.md` content, reformatted as command
- `commands/save.md` — from `skills/save/SKILL.md` content, reformatted as command
- `skills/cal-ood/SKILL.md` — OOD reference skill derived from `cal/OOD.md`

### Modify
- `claude-code.json` — Replace skills array with commands + skills, bump version to 3.1.0
- `.claude/agents/coder.md` — Add model, tools, skills, hooks, `<example>` tags
- `.claude/agents/reviewer.md` — Add model, tools, skills, `<example>` tags
- `.claude/agents/architect.md` — Add model, tools, skills, `<example>` tags
- `.claude-plugin/plugin.json` — Bump version to 3.1.0

### Delete
- `skills/analyze/SKILL.md` — Moved to `commands/analyze.md`
- `skills/meet/SKILL.md` — Moved to `commands/meet.md`
- `skills/next/SKILL.md` — Moved to `commands/next.md`
- `skills/onboard/SKILL.md` — Moved to `commands/onboard.md`
- `skills/save/SKILL.md` — Moved to `commands/save.md`

### Unchanged
- `.claude/rules/ood.md` — Stays as behavioral rule for main conversation
- `.claude/rules/coordinator.md` — Stays
- `.claude/rules/delta.md` — Stays
- `.claude/rules/squirrel.md` — Stays
- `.claude/rules/tone-awareness.md` — Stays
- `cal/OOD.md` — Stays as canonical reference (skill derives from it)
- `cal/analysis.md` — Stays (analyze command references it)
- `cal/agents.md` — Stays (describes team roster for Cal to read)

## User Stories

### US-1: Convert skills to commands
**Acceptance:** All five commands (`analyze`, `meet`, `next`, `onboard`, `save`) appear in the `/` picker as `/cal:analyze`, `/cal:meet`, etc. with correct descriptions.

### US-2: Create OOD skill
**Acceptance:** `skills/cal-ood/SKILL.md` exists with full OOD content. Agent definitions reference it via `skills: [cal-ood]`.

### US-3: Enhance agent definitions
**Acceptance:** All three agents have `model`, `tools`, `skills`, and `<example>` tags in frontmatter. Coder has PreToolUse OOD guard hook.

### US-4: Update manifest
**Acceptance:** `claude-code.json` lists all five commands as file paths and the OOD skill. Version bumped to 3.1.0.

### US-5: Clean up old skills
**Acceptance:** `skills/analyze/`, `skills/meet/`, `skills/next/`, `skills/onboard/`, `skills/save/` directories deleted. Only `skills/cal-ood/` remains.

## Phases

### Phase 1: Commands + Manifest (US-1, US-4)
Create `commands/` directory with all five command files. Update `claude-code.json`. Verify they appear in picker.

### Phase 2: Agents + OOD Skill (US-2, US-3)
Create OOD skill. Update all three agent definitions with full configuration. Verify hook fires on red-flag patterns.

### Phase 3: Cleanup (US-5)
Delete old skill directories. Verify nothing breaks.

## Verification

After each phase:
1. Check `/` picker shows all `/cal:XXX` commands with descriptions
2. Invoke each command and verify it loads correctly
3. Verify agents auto-trigger from natural language examples
4. Verify OOD hook warns on `*Utils.*` file creation attempt
