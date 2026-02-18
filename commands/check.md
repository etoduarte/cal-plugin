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
