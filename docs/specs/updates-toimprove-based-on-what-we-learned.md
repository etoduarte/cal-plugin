# Spec: Cal Plugin Improvements — Skills Guide Compliance + CLAUDE.md Audit

**Status:** IMPLEMENTED
**Date:** 2026-02-18
**Context:** Audit of cal-plugin v3.1.0 against Anthropic's "The Complete Guide to Building Skills for Claude" and CLAUDE.md bloat best practices (jatinw21 thread).

---

## Summary

Five user stories to bring Cal's skill into compliance with Anthropic's official skills guide, add a retroactive quality check command, trim CLAUDE.md to essential decisions only, and improve onboard's CLAUDE.md generation.

## Out of Scope

- Converting commands to portable skills (Claude Code only is fine)
- Changing Ralph Loop integration or Lisa plugin
- Modifying agent definitions (coder.md, reviewer.md, architect.md)
- Changing cal/OOD.md content (it stays as the canonical full-philosophy reference)
- Changing .claude/rules/ood.md (stays as-is for conversation-level detection)

---

## US-1: Rewrite `skills/cal-ood/SKILL.md`

**Goal:** Bring the only Cal skill into full compliance with the skills guide.

### Changes

#### 1a. Rewrite YAML frontmatter

**Current:**
```yaml
---
name: cal-ood
description: "Object-Oriented Data principles, violation patterns, and compliance test. Referenced by all Cal agents."
license: MIT
---
```

**New:**
```yaml
---
name: cal-ood
description: "Object-Oriented Data principles, violation patterns, and compliance test. Use when reviewing code for OOD compliance, designing domain objects, checking for scattered logic in utils/helpers/services, or when user mentions object-oriented data, domain modeling, or translation boundaries."
license: MIT
compatibility: "Claude Code CLI with cal-plugin installed"
metadata:
  author: Cal
  version: 3.1.0
---
```

#### 1b. Rewrite body to 8 unified questions + red flags

Replace the current body (Three Pillars + Five Commandments + Translation Boundaries + Before Writing Code + Compliance Test) with a differentiated compact checklist.

**New SKILL.md body structure:**

```markdown
# OOD Code-Time Checklist

> The data is the API. Pull logic IN onto objects. Never extract it OUT.

## Before Writing Code — 8 Questions

1. **Does this logic describe what the object IS?** Put it ON the object.
2. **Can AI understand capabilities from schema alone?** If no, logic is scattered.
3. **Am I creating a file that "helps" domain objects?** STOP. Logic belongs on them.
4. **Is the first parameter a domain object?** That logic belongs ON it.
5. **Would I need to import a utility to use this object?** Those should be getters/computed properties.
6. **Is this foreign data entering the domain?** Naturalize it first. Then it's a citizen.
7. **Does this action modify or delete user data?** Needs permission (modify) or double confirmation (delete). Fences are architectural.
8. **Am I building a separate AI-specific endpoint or interface?** Same interface serves human and AI. One code path.

All 8 must pass. If any fails, restructure before writing code.

## Red-Flag File Patterns (Auto-Reject)

`*Utils.*`, `*Helper.*`, `*Service.*`, `*Manager.*`, `*Calculator.*`

If a file matches these patterns, the logic belongs on a domain object instead.

## Translation Boundaries

Foreign data must be naturalized before entering the domain:

Foreign Source → Extract (raw data) → Naturalize (domain vocabulary) → Citizen (self-describing object)

After naturalization, AI reads citizens without parsers.

## Full Reference

For complete OOD philosophy, code examples (Swift + TypeScript), and the Five Commandments, see `cal/OOD.md`.
```

#### 1c. Create `references/` directory

Create `skills/cal-ood/references/` with:
- `swift-patterns.md` — Swift-specific OOD code examples (extracted from current SKILL.md and cal/OOD.md)
- `typescript-patterns.md` — TypeScript-specific OOD code examples

#### 1d. Update `claude-code.json` manifest

Update the skill description to match the new SKILL.md description field.

### Acceptance Criteria

- [ ] SKILL.md frontmatter has name, description (with trigger phrases), license, compatibility, metadata
- [ ] SKILL.md body contains exactly 8 questions, red-flag patterns, translation boundary summary, and pointer to cal/OOD.md
- [ ] SKILL.md body is under 60 lines (lean checklist, no code examples)
- [ ] `references/swift-patterns.md` exists with Swift OOD code examples
- [ ] `references/typescript-patterns.md` exists with TypeScript OOD code examples
- [ ] `claude-code.json` skill description matches SKILL.md description
- [ ] No content duplication between SKILL.md and cal/OOD.md (differentiated purpose)

---

## US-2: Create `/cal:check` Command

**Goal:** Add a retroactive quality check that dispatches the Reviewer agent on recent changes.

### New File: `commands/check.md`

```yaml
---
description: "Broad quality check on recent code changes. Dispatches Reviewer agent for OOD compliance, design system adherence, security, and code quality. Usage: /cal:check [scope]. Scopes: ood, security, design, spec, or a file path. Defaults to all."
argument: "scope (optional) - Focus area: ood, security, design, spec, or a file/directory path. Defaults to all."
disable-model-invocation: true
allowed_tools: ["Task", "Read", "Glob", "Grep", "Bash"]
---

# Check — Retroactive Quality Review

**Purpose:** Review recent code changes for quality, compliance, and correctness.

## Protocol

### 1. Determine Scope

If no argument: review all uncommitted + recently committed changes.
If scope argument provided:
- `ood` — Focus on OOD compliance only
- `security` — Focus on OWASP top 10, secrets, input validation
- `design` — Focus on design system adherence (cal/DESIGN.md)
- `spec` — Compare changes against active spec in docs/specs/
- File/directory path — Review only those files

### 2. Gather Context

1. Run `git diff` and `git diff --staged` to identify changed files
2. If scope is a file path, read those files directly
3. Read `cal/OOD.md` for OOD reference
4. Read active spec from `cal/NOW.md` if scope is `spec`

### 3. Dispatch Reviewer

Dispatch the Reviewer agent via Task tool with:
- The changed files/diffs as context
- The scope focus (or "all" for broad review)
- Instructions to produce a PASS / PASS WITH NOTES / FAIL verdict

### 4. Report Results

Present the Reviewer's verdict to the user:
- **PASS** — All checks clear
- **PASS WITH NOTES** — Minor concerns, listed with file:line references
- **FAIL** — Specific violations with file:line references and suggested fixes

### 5. Save Learnings

If patterns emerge (recurring violations), offer to save to `cal/cal.md`.
```

### Manifest Update

Add to `claude-code.json` commands array:
```json
"./commands/check.md"
```

### Acceptance Criteria

- [ ] `commands/check.md` exists with frontmatter (description, argument, disable-model-invocation, allowed_tools)
- [ ] Command dispatches Reviewer agent via Task tool
- [ ] Scope argument works: no arg = all, ood/security/design/spec = focused, file path = targeted
- [ ] `claude-code.json` includes the new command
- [ ] Reviewer returns PASS / PASS WITH NOTES / FAIL verdict with file:line references

---

## US-3: Trim Cal's `CLAUDE.md`

**Goal:** Apply the "would removing this cause mistakes?" litmus test to every line.

### Litmus Test

For every line, ask: "Would removing this cause Claude to make mistakes?"
- Not "is this useful" — would removing it cause MISTAKES?
- If Claude can figure it out by reading files, it doesn't belong here.

### Lines to KEEP (pass litmus test)

| Line | Why Keep |
|------|----------|
| Cal identity line | Can't be reverse-engineered — defines role as coordinator, not coder |
| Commands table | Prevents Cal from not knowing its own commands (faster than reading manifest) |
| Approval Gates section | Critical decision with no code signal — "looks good" != approval |
| Brain file pointers | Cal wouldn't know where to journal without these |
| Prime Directive one-liner | Architectural decision, not discoverable from code |

### Lines to CUT (fail litmus test)

| Line | Why Cut |
|------|---------|
| OOD Three Pillars (lines 19-23) | Redundant — .claude/rules/ood.md is auto-loaded every session |
| "See @cal/OOD.md for full..." | Pointer to a file Claude can discover |
| Analysis Modes paragraph | Discoverable from commands/analyze.md |
| Team section | Discoverable from cal/agents.md |
| Preferences pointers | Discoverable from cal/ directory listing |

### Target CLAUDE.md

~25 lines. Should feel uncomfortably short.

### Acceptance Criteria

- [ ] CLAUDE.md is under 30 lines
- [ ] Every remaining line passes the litmus test: removal would cause mistakes
- [ ] Commands table present (including new /cal:check)
- [ ] Approval Gates section present
- [ ] Brain file pointers present
- [ ] No redundant OOD content (covered by auto-loaded rule)
- [ ] No discoverable pointers (analysis modes, team, preferences)

---

## US-4: Update `coordinator.md` Rule

**Goal:** Add lightweight awareness of Lisa and Ralph as workflow tools.

### Changes

Add a new section to `.claude/rules/coordinator.md`:

```markdown
## Workflow Tools

When the user's request maps to a known workflow tool, suggest it:

- **Specification needed** → Suggest Lisa (`/lisa:plan`)
- **Implementation/build** → Suggest Ralph Loop (`/ralph-loop:ralph-loop`)
- **Debugging/investigation** → Suggest `/cal:analyze [mode]`
- **Quality review** → Suggest `/cal:check`

These are suggestions, not automatic dispatches. The user decides.
```

### What NOT to Change

- Keep the existing dispatch pattern for Coder/Reviewer/Architect agents
- Don't add pipeline state detection
- Don't add auto-suggestion based on NOW.md state

### Acceptance Criteria

- [ ] coordinator.md has a new "Workflow Tools" section
- [ ] Section contains 4 lightweight hints (Lisa, Ralph, analyze, check)
- [ ] Hints are suggestions, not auto-dispatches
- [ ] Existing dispatch behavior unchanged

---

## US-5: Update `onboard.md` Command

**Goal:** Generate leaner CLAUDE.md files for new projects and offer audit of existing ones.

### Changes

#### 5a. Add CLAUDE.md litmus test to generation

Add to commands/onboard.md, in the CLAUDE.md generation section:

```markdown
### CLAUDE.md Writing Principles

Every line must pass this test: **"Would removing this cause Claude to make mistakes?"**

**Include (decisions Claude can't reverse-engineer):**
- Style choices invisible in the codebase ("Use ES modules, not CommonJS")
- Boundaries with no code signal ("Don't touch /legacy")
- Workflow restrictions ("Run single tests, not the full suite")
- Approval/process gates with non-obvious semantics

**Exclude (noise that dilutes real instructions):**
- Standard language conventions Claude already knows
- How systems work (Claude can read the code)
- API documentation (link to it instead)
- Aspirational statements ("Write clean code", "Follow best practices")

**The bar:** If Claude could figure it out by reading your files, it doesn't belong in CLAUDE.md. The file should feel uncomfortably short.
```

#### 5b. Add existing CLAUDE.md audit

When onboard detects an existing CLAUDE.md, add a new option:

```markdown
If CLAUDE.md exists:
1. Read the existing CLAUDE.md
2. Apply the litmus test to every line
3. Present findings: "These N lines pass the test. These M lines could be cut because [reason]."
4. Ask user: "Want me to trim it, suggest improvements, or leave it as-is?"
```

### Acceptance Criteria

- [ ] commands/onboard.md contains the CLAUDE.md writing principles inline
- [ ] Litmus test is explicit: "Would removing this cause Claude to make mistakes?"
- [ ] Include/exclude lists are present with concrete examples
- [ ] Existing CLAUDE.md audit flow is documented (read, test each line, present, ask)
- [ ] New projects get lean CLAUDE.md generation following these principles

---

## Implementation Phases

### Phase 1: Skill + CLAUDE.md (US-1, US-3)

**Files touched:**
- `skills/cal-ood/SKILL.md` — rewrite
- `skills/cal-ood/references/swift-patterns.md` — create
- `skills/cal-ood/references/typescript-patterns.md` — create
- `CLAUDE.md` — trim
- `claude-code.json` — update skill description

**Verify:** SKILL.md under 60 lines, CLAUDE.md under 30 lines, references/ exists.

### Phase 2: Commands + Coordinator (US-2, US-4, US-5)

**Files touched:**
- `commands/check.md` — create
- `.claude/rules/coordinator.md` — add Workflow Tools section
- `commands/onboard.md` — add litmus test + audit flow
- `claude-code.json` — add check command

**Verify:** `/cal:check` appears in manifest, coordinator has hints, onboard has litmus test.

---

## Verification Commands

```bash
# Phase 1 verification
wc -l skills/cal-ood/SKILL.md          # Should be < 60
wc -l CLAUDE.md                         # Should be < 30
ls skills/cal-ood/references/           # Should show swift-patterns.md, typescript-patterns.md
cat claude-code.json | grep cal-ood     # Description should have trigger phrases

# Phase 2 verification
ls commands/check.md                    # Should exist
grep -l "Workflow Tools" .claude/rules/coordinator.md  # Should match
grep -l "litmus test" commands/onboard.md              # Should match
cat claude-code.json | grep check                      # Should be in commands array
```
