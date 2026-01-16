---
description: "Create or update global user profile for agent context"
---

# Profile - Global User Context

**Trigger:** `/cal:profile`

**Purpose:** Create or update a global user profile that agents reference to tailor their advice and communication style.

## Usage

```bash
# Create or update profile
/cal:profile

# View current profile
/cal:profile view
```

## Location

Global profile lives at: `~/.claude/cal/USER-PROFILE.md`

This persists across all projects and sessions. All agents should read this before giving advice.

## Profile Template

When invoked, create or open the profile file with this template:

```markdown
# User Profile

**Created:** [DATE]
**Updated:** [DATE]

---

## Professional Background

- **Current role:** [Job title / what you do]
- **Previous experience:** [Relevant background]
- **Domain expertise:** [Areas you know deeply]
- **Industry context:** [What space you work in]

---

## Technical Profile

- **Coding ability:** [none | familiar | proficient | expert]
- **Primary languages:** [Languages you use]
- **Tools used daily:** [IDE, CLI tools, etc.]
- **Data sophistication:** [none | basic SQL | analytics | data engineering]
- **Infrastructure familiarity:** [none | basic | intermediate | DevOps-level]

---

## Communication Preferences

- **Frame advice in:** [business terms | technical terms | hybrid]
- **Preferred analogies:** [marketing | engineering | finance | product | other]
- **Decision style:** [show tradeoffs and let me decide | recommend directly]
- **Detail level:** [high-level overview | detailed explanation | show me the code]
- **Feedback style:** [direct/blunt | diplomatic | encouraging]

---

## Working Style

- **Planning preference:** [plan thoroughly first | iterate quickly | depends on scope]
- **Risk tolerance:** [conservative/stable | balanced | move fast/break things]
- **Documentation preference:** [minimal | moderate | comprehensive]

---

## What This Means for Agents

Based on the above profile, agents should:

- [How to frame technical concepts]
- [What level of detail to provide]
- [What NOT to do - things that waste this user's time]
- [How to handle uncertainty or tradeoffs]

---

## Notes

[Any other context that helps agents serve you better]
```

## Protocol

When `/cal:profile` is invoked:

1. Check if `~/.claude/cal/USER-PROFILE.md` exists
2. If NO: Create it with template, ask user to fill in
3. If YES: Open for review/update, update "Updated" date

## Agent Integration

All agents doing inside-out exploration or giving advice should:

1. Check if profile exists: `~/.claude/cal/USER-PROFILE.md`
2. If exists, read it before proceeding
3. Tailor communication based on profile
4. Reference profile explicitly when making choices ("Based on your preference for direct feedback...")

## Why This Exists

- Capture user context once, use everywhere
- Avoid repeating "I'm technical" or "explain simply" every session
- Help agents calibrate advice to user's actual background
- Make multi-agent sessions more coherent (all agents share context)
