# Cal Payload Simplification

**Status:** Ready for Implementation
**Created:** 2026-01-17
**Author:** Lisa Interview

---

## Overview

Simplify the Cal plugin payload by removing the web syncing feature and embedded agent templates. This prepares Cal for use in new projects without Pixley-specific baggage.

## Goals

1. Remove web syncing feature (never implemented, adds complexity)
2. Remove bundled agent templates (agents will be created on-demand via prompts)
3. Archive removed content for reference
4. Leave commands intact (refactoring is a separate follow-up)

## Non-Goals

- Updating commands (out of scope)
- Refactoring /cal:onboard, /cal:pre, /cal:post (separate follow-up)
- Changing Cal's core functionality

---

## What Gets Removed

### 1. Agent Templates (`templates/agents/`)

| File | Purpose | Why Removing |
|------|---------|--------------|
| `architect.md` | Architecture review, coupling analysis | Pixley-specific, will create on-demand |
| `atomizer.md` | Code extraction, deduplication | Pixley-specific, will create on-demand |
| `drift-preventer.md` | Recurring bug pattern detection | Pixley-specific, will create on-demand |
| `ux-visionary.md` | UI/UX design decisions | Pixley-specific, will create on-demand |

**New model:** If an agent is needed, create it via a prompt to Claude rather than bundling templates.

### 2. Web Sync Spec (`docs/specs/cal-sync-mvp.md`)

- Purpose: Sync .claude/ folders to Cal web app via GitHub webhooks
- Status: Specced but never implemented
- Decision: Delete completely. Will re-spec from scratch if revisited.

---

## Archive Strategy

Create `docs/archive/removed-agents.md` containing the full content of each removed agent template. This preserves the work for reference without cluttering the active codebase.

---

## User Stories

### US-1: Archive Removed Agents

**As a** Cal maintainer
**I want to** preserve removed agent content
**So that** I can reference it later if needed

**Acceptance Criteria:**
- [ ] `docs/archive/removed-agents.md` exists
- [ ] Contains full content of all 4 agent templates
- [ ] Includes metadata about why they were removed

**Verification:**
```bash
cat docs/archive/removed-agents.md | head -20
# Should show archive header and first agent
```

---

### US-2: Remove Agent Templates

**As a** Cal user
**I want to** not have Pixley-specific agents bundled
**So that** Cal feels like a general-purpose tool

**Acceptance Criteria:**
- [ ] `templates/agents/` folder deleted
- [ ] No references to `templates/agents/` in codebase

**Verification:**
```bash
ls templates/agents/ 2>&1 | grep -q "No such file"
# Should succeed (folder doesn't exist)
```

---

### US-3: Remove Web Sync Spec

**As a** Cal maintainer
**I want to** remove unimplemented features
**So that** the spec folder reflects actual capabilities

**Acceptance Criteria:**
- [ ] `docs/specs/cal-sync-mvp.md` deleted

**Verification:**
```bash
ls docs/specs/cal-sync-mvp.md 2>&1 | grep -q "No such file"
# Should succeed (file doesn't exist)
```

---

## Implementation Order

1. **US-1:** Create archive file with agent content
2. **US-2:** Delete templates/agents/ folder
3. **US-3:** Delete web sync spec

Each story is a single focused action.

---

## What Stays As-Is

These will be addressed in a separate refactor:

- All 16 commands in `commands/`
- `/cal:onboard` (references agents but will be refactored)
- `/cal:pre` and `/cal:post` (dispatch agents but will be refactored)
- `/calsync` skill reference (if any)

---

## Verification

After all stories complete:

```bash
# Confirm agent templates removed
[ ! -d "templates/agents" ] && echo "PASS: agents removed"

# Confirm sync spec removed
[ ! -f "docs/specs/cal-sync-mvp.md" ] && echo "PASS: sync spec removed"

# Confirm archive exists
[ -f "docs/archive/removed-agents.md" ] && echo "PASS: archive created"
```
