---
description: "Project onboarding - set up Cal coworkers for this codebase"
---

# Onboard - Project Setup

**Trigger:** `/cal:onboard`

**Purpose:** Set up Cal for a new project. Scans codebase, creates cal/ structure, suggests agents.

## What Happens

1. **Codebase Exploration** - Simple scan for patterns
2. **Create cal/ Structure** - Journal and folders
3. **Suggest Agents** - Based on detected patterns
4. **User Profile (Optional)** - Communication preferences

## Codebase Exploration

Cal globs for common patterns to understand the project:

```bash
# Language/Framework detection
package.json      → Node.js/JavaScript
tsconfig.json     → TypeScript
Cargo.toml        → Rust
pyproject.toml    → Python
go.mod            → Go
Package.swift     → Swift

# Framework hints
next.config.js    → Next.js
vite.config.ts    → Vite
supabase/         → Supabase
prisma/           → Prisma
```

### Exploration Output

```markdown
## Codebase Overview

**Languages:** TypeScript, JavaScript
**Frameworks:** Next.js, Supabase
**Database:** Supabase (PostgreSQL)
**Structure:**
- src/ - Source code
- app/ - Next.js app router
- supabase/ - Migrations and types
```

This is a simple scan, not sophisticated analysis. For deeper understanding, use `/cal inside-out`.

## Create cal/ Structure

Onboard creates the cal/ folder structure:

```
project/
└── cal/
    ├── cal.md              # Main journal (empty with header)
    ├── agent-prompts.md    # Prompts for creating agents
    ├── inside-out/         # Deep understanding explorations
    └── meetings/           # Meeting artifacts
```

### Initial cal.md

```markdown
# Cal Journal

Project: [Detected project name]
Created: [Today's date]
Stack: [Detected stack]

---

[Entries will appear here]
```

## Suggest Agents

Based on exploration, Cal recommends agents:

### Always Recommended

1. **note-taker** - Captures observations without polluting context
2. **sacred-keeper** (business-logic-keeper) - Protects inviolable business logic

These are Cal's core coworkers. Prompts are in `cal/agent-prompts.md`.

### Conditionally Recommended

| Pattern Detected | Agent Suggested | Why |
|------------------|-----------------|-----|
| TypeScript | typescript-checker | Type verification |
| Supabase | supabase-schema-validator | RLS and schema validation |
| Large codebase | atomizer | Extraction and size limits |
| Complex data flow | architect | Coupling and boundaries |
| Security-sensitive | security-auditor | Security scanning |

### Suggestion Format

```markdown
## Suggested Agents

Based on your [Next.js + Supabase] stack, I recommend:

### Required for Cal
1. **note-taker** - Captures context without polluting conversation
   → See `cal/agent-prompts.md` for creation prompt

2. **sacred-keeper** - Protects business logic from accidental changes
   → See `cal/agent-prompts.md` for creation prompt

### Recommended for Your Stack
3. **typescript-checker** - You have TypeScript; this catches type errors
4. **supabase-schema-validator** - You have Supabase; this validates RLS

Create these agents by copying prompts from `cal/agent-prompts.md` to Claude.
```

## User Profile (Optional)

Cal asks if user wants to set up a profile:

> "Would you like to set up a user profile? This helps agents tailor communication to your background and preferences."

If yes, creates `~/.claude/cal/USER-PROFILE.md`:

```markdown
# User Profile

**Created:** [DATE]

## Professional Background
- **Current role:** [To fill]
- **Domain expertise:** [To fill]

## Technical Profile
- **Coding ability:** [none | familiar | proficient | expert]

## Communication Preferences
- **Frame advice in:** [business terms | technical terms | hybrid]
- **Decision style:** [show tradeoffs | recommend directly]
```

## Protocol

When `/cal:onboard` is invoked:

1. **Scan** - Glob for framework/language markers
2. **Report** - Show detected patterns
3. **Create** - Build cal/ structure
4. **Suggest** - Recommend agents based on patterns
5. **Profile** - Offer user profile setup
6. **Point** - Direct user to `cal/agent-prompts.md`

## Re-Onboarding

Running `/cal:onboard` again:
- Re-scans codebase (patterns may have changed)
- Does NOT overwrite cal.md (preserves journal)
- Updates agent suggestions based on new patterns
- Offers to update user profile

## Why This Exists

- Projects get the coworkers they need
- note-taker and sacred-keeper are Cal-specific, always suggested
- Other agents suggested based on actual codebase patterns
- Simple scan keeps onboarding fast
- User profile captured once, used everywhere
