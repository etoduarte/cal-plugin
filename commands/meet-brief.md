---
description: "Request a guest briefing from an agent"
argument-hint: "AGENT_NAME [TOPIC]"
allowed-tools: ["Task", "Read", "Write", "Glob", "Grep"]
---

# Cal Meet: Guest Briefing

Dispatch an agent to give a structured briefing during a meeting.

## Usage

```bash
/cal:meet:brief architect "the auth patterns we considered"
/cal:meet:brief beta-enthusiast "what the beta implementation looked like"
```

Or during a meeting, just say: "Cal, have architect brief us on the auth patterns"

## Briefing Structure

The guest agent should deliver a briefing in this format:

```markdown
# Guest Briefing: [Topic]
Date: YYYY-MM-DD
Guest: [Agent Name]
Audience: [Meeting Participants]

## Summary
[2-3 sentence essence]

## Evidence/History
[Structured walkthrough]

## Key Lessons
[Insights for decision-making]

## Questions for Officials
[Thought prompts, not directives]

---
*[Guest] departing after briefing.*
```

## Collaboration Framing

Pass this to the guest agent:
> "The meeting abstraction helps the human organize thinking. You are an AI tool providing expertise, not a human attendee. Contribute clearly, don't roleplay meeting dynamics. After your briefing, ritually depart with 'departing after briefing.'"

## Instructions

1. Dispatch the specified agent using the Task tool
2. Provide the topic and collaboration framing
3. Guest writes briefing to `cal/meetings/{current-meeting}/guest-{agent}.md`
4. Guest ritually departs after completing briefing
5. Briefing will be referenced in final meeting minutes
