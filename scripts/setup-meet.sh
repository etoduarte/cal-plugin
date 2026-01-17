#!/bin/bash

# Cal Meet Setup Script
# Creates state file for meeting coordination loop

set -euo pipefail

# Parse arguments
TOPIC=""
PARTICIPANTS=""
INSTRUCTIONS=""

# Parse options and positional arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      cat << 'HELP_EOF'
Cal Meet - Virtual Meeting Coordinator

USAGE:
  /cal:meet [OPTIONS]

OPTIONS:
  --topic <text>            Meeting topic (what we're figuring out)
  --participants <list>     Comma-separated agent names (e.g., architect,ux-visionary)
  --instructions <text>     How should this meeting go? (freeform)
  -h, --help                Show this help message

DESCRIPTION:
  Cal becomes a virtual meeting coordinator in a bash loop, helping you
  think through problems with AI agents as participants.

  If any parameters are missing, Cal will ask for them during onboarding.

EXAMPLES:
  /cal:meet
  /cal:meet --topic "auth architecture"
  /cal:meet --topic "pricing model" --participants architect,product-visionary
  /cal:meet --topic "what went wrong" --instructions "Postmortem style"

DURING MEETING:
  - Request briefings: "Cal, have architect brief us on the auth patterns"
  - Add to parking lot: "Parking lot this — it's out of scope"
  - Make decisions: Cal tracks with rationale and confidence

ENDING:
  Say "meeting adjourned" to trigger the cleanup protocol.
  Cal will produce minutes and ask for your approval.

MONITORING:
  # View meeting state:
  head -10 .claude/meeting.local.md
HELP_EOF
      exit 0
      ;;
    --topic)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --topic requires a text argument" >&2
        exit 1
      fi
      TOPIC="$2"
      shift 2
      ;;
    --participants)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --participants requires a comma-separated list" >&2
        exit 1
      fi
      PARTICIPANTS="$2"
      shift 2
      ;;
    --instructions)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --instructions requires a text argument" >&2
        exit 1
      fi
      INSTRUCTIONS="$2"
      shift 2
      ;;
    *)
      # Unknown option - might be part of topic
      if [[ -z "$TOPIC" ]]; then
        TOPIC="$1"
      fi
      shift
      ;;
  esac
done

# Create .claude directory if needed
mkdir -p .claude

# Generate slug from topic (if provided)
SLUG=""
if [[ -n "$TOPIC" ]]; then
  # Convert to lowercase, replace spaces with hyphens, remove special chars
  SLUG=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
fi

# Convert participants to YAML array format
PARTICIPANTS_YAML="[]"
if [[ -n "$PARTICIPANTS" ]]; then
  # Convert comma-separated to YAML array
  PARTICIPANTS_YAML="[$(echo "$PARTICIPANTS" | sed 's/,/, /g')]"
fi

# Create state file
cat > .claude/meeting.local.md <<EOF
---
topic: "${TOPIC}"
slug: "${SLUG}"
started: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
participants: ${PARTICIPANTS_YAML}
instructions: "${INSTRUCTIONS}"
status: in_progress
iteration: 1
related_meetings: []
---

# Cal Meet Session

You are Cal, the meeting coordinator. A meeting has been initiated.

## Your Role

You are a **project manager persona**:
- Know a little about everything going on
- Ask high-value questions
- Coordinate and facilitate, don't dominate
- Dispatch participant agents proactively (no permission prompts needed)

## Collaboration Framing

Pass this to all dispatched agents:
> "The meeting abstraction helps the human organize thinking. You are an AI tool providing expertise, not a human attendee. Contribute clearly, don't roleplay meeting dynamics."

## Meeting Flow

1. **Onboard missing parameters** (topic, participants, instructions)
2. **Provide warmup context** (restate topic, surface related meetings if any)
3. **Facilitate discussion** — dispatch agents, capture decisions, note parking lot items
4. **At natural breakpoints** — ask "Continue exploring or adjourn?"
5. **When user says "meeting adjourned"** — run cleanup protocol

## Cleanup Protocol

1. Generate meeting minutes (or have spec-cleaner do it if available)
2. Present minutes for user review and approval
3. Ask: "Any decisions here need protection?"
4. If yes and eunuch/pilgrim exist, invoke with permission
5. Output: <promise>MEETING ADJOURNED</promise>

## Required Agents Check

Before proceeding, check if these agents exist in .claude/agents/:
- note-taker.md (for structured capture)
- spec-cleaner.md (for minutes generation)

If missing, inform the user and offer starter prompts or run in minimal mode.
EOF

# Output setup message
echo "📋 Cal Meet - Virtual Meeting Coordinator"
echo ""

if [[ -n "$TOPIC" ]]; then
  echo "Topic: $TOPIC"
else
  echo "Topic: (Cal will ask)"
fi

if [[ -n "$PARTICIPANTS" ]]; then
  echo "Participants: $PARTICIPANTS"
else
  echo "Participants: (Cal will suggest)"
fi

if [[ -n "$INSTRUCTIONS" ]]; then
  echo "Instructions: $INSTRUCTIONS"
else
  echo "Instructions: (Cal will ask)"
fi

echo ""
echo "The meeting loop is now active. Cal will coordinate until you say"
echo "\"meeting adjourned\"."
echo ""
echo "To monitor: head -10 .claude/meeting.local.md"
echo ""
echo "---"
echo ""

# If parameters are missing, prompt Cal to do onboarding
if [[ -z "$TOPIC" ]] || [[ -z "$PARTICIPANTS" ]] || [[ -z "$INSTRUCTIONS" ]]; then
  echo "Cal, please start the meeting onboarding. Ask the user for any missing parameters:"
  if [[ -z "$TOPIC" ]]; then
    echo "- Topic: \"What are we figuring out today?\""
  fi
  if [[ -z "$PARTICIPANTS" ]]; then
    echo "- Participants: Suggest based on topic, let user confirm"
  fi
  if [[ -z "$INSTRUCTIONS" ]]; then
    echo "- Instructions: \"How should this meeting go?\""
  fi
  echo ""
  echo "After gathering parameters, check for required agents and provide warmup context."
else
  echo "Cal, all parameters are set. Check for required agents (note-taker, spec-cleaner in .claude/agents/),"
  echo "provide warmup context, and begin facilitating the meeting on: $TOPIC"
fi
