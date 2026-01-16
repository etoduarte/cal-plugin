---
description: "Project onboarding - set up Cal coworkers for this codebase"
---

# Onboard - Project Setup Interview

**Trigger:** `/cal:onboard`

**Purpose:** Interview-driven setup of Cal's coworkers (agents) for a new project. Like a Lisa interview, but for configuring the team.

## Usage

```bash
# Start onboarding for current project
/cal:onboard

# Re-run to add/remove coworkers
/cal:onboard update
```

## What Happens

1. **Interview Phase** - Cal asks about:
   - Project type (web app, CLI, library, etc.)
   - Tech stack (React, Node, Python, etc.)
   - Special concerns (migration, security, performance)
   - Team context (solo, small team, enterprise)

2. **Agent Selection** - Based on answers, Cal suggests coworkers:
   - "Based on your React/Supabase stack, I recommend: atomizer, architect, recurring-pattern-fixer"
   - User approves/modifies

3. **Template Instantiation** - Cal creates `.claude/agents/` with:
   - Selected agent templates
   - Placeholder sections for project-specific context
   - Instructions to read user profile

4. **First Inside-Out** - Cal suggests running inside-out to populate agents:
   - "Run `/cal:inside-out session [codebase]` to help your coworkers learn this project"

## Interview Questions

### Project Context
- What type of project is this? (web app, API, CLI, library, mobile, other)
- What's the primary language/framework?
- Is this greenfield or existing codebase?
- Are you migrating from a previous version? (triggers migration agents)

### Technical Concerns
- What's your biggest technical concern? (code quality, performance, security, UX)
- Do you have a database? What kind?
- Any external APIs or integrations?

### Team Context
- Working solo or with a team?
- Any established coding standards to enforce?
- Is there a user profile? (`/cal:profile`)

## Agent Templates Available

| Template | When to Suggest |
|----------|-----------------|
| **atomizer** | Any project with growing codebase |
| **architect** | Projects with complex data flow or state |
| **ux-visionary** | Projects with user interfaces |
| **drift-preventer** | Projects with recurring patterns/bugs |
| **security-sentinel** | Projects handling sensitive data |
| **performance-guardian** | Projects with performance requirements |
| **migration-guide** | Projects migrating from legacy code |

## Output Structure

After onboarding, creates:

```
project/
└── .claude/
    └── agents/
        ├── atomizer.md           # From template + project context placeholder
        ├── architect.md          # From template + project context placeholder
        └── [other-selected].md
```

Each agent file includes:

```markdown
---
name: [agent-name]
description: "[Auto-generated dispatch description]"
model: [sonnet|opus]
---

[Core principles from template]

## Project Context

*This section populated by inside-out exploration*

### Tech Stack
- [To be filled]

### Key Files
- [To be filled]

### Known Patterns
- [To be filled]

### Gotchas
- [To be filled]
```

## The Learning Loop

```
/cal:onboard
     ↓
Agents created with templates
     ↓
/cal:inside-out session [codebase]
     ↓
Agents learn project context
     ↓
Work happens...
     ↓
/cal:post
     ↓
Learnings propagate back to agent files
     ↓
Agents get smarter
```

## Re-Onboarding

Running `/cal:onboard update` allows:
- Adding new coworkers mid-project
- Removing coworkers that aren't helping
- Resetting an agent to fresh template

Does NOT destroy existing project context in agent files (merges carefully).

## Why This Exists

- Agents ship as templates, get instantiated per-project
- Each project gets the coworkers it needs
- Inside-out exploration populates project-specific knowledge
- Post-flight propagates learnings back
- Agents evolve with the project, not just session-to-session
- Prevents agent drift and explosion (curated team, not infinite agents)
