#!/bin/bash

# Cal Meet Stop Hook
# Prevents session exit when a meeting is active
# Continues the meeting loop until user says "meeting adjourned"

set -euo pipefail

# Read hook input from stdin (advanced stop hook API)
HOOK_INPUT=$(cat)

# Check if meeting is active
MEETING_STATE_FILE=".claude/meeting.local.md"

if [[ ! -f "$MEETING_STATE_FILE" ]]; then
  # No active meeting - allow exit
  exit 0
fi

# Parse markdown frontmatter (YAML between ---) and extract values
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$MEETING_STATE_FILE")
STATUS=$(echo "$FRONTMATTER" | grep '^status:' | sed 's/status: *//')
TOPIC=$(echo "$FRONTMATTER" | grep '^topic:' | sed 's/topic: *//' | sed 's/^"\(.*\)"$/\1/')
ITERATION=$(echo "$FRONTMATTER" | grep '^iteration:' | sed 's/iteration: *//' || echo "1")

# Validate status
if [[ "$STATUS" != "in_progress" ]]; then
  # Meeting not in progress - allow exit
  exit 0
fi

# Validate iteration is a number (default to 1 if not present)
if [[ ! "$ITERATION" =~ ^[0-9]+$ ]]; then
  ITERATION=1
fi

# Get transcript path from hook input
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path')

if [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  echo "⚠️  Cal meet: Transcript file not found" >&2
  echo "   Expected: $TRANSCRIPT_PATH" >&2
  echo "   Meeting is stopping." >&2
  rm "$MEETING_STATE_FILE"
  exit 0
fi

# Check if there are any assistant messages
if ! grep -q '"role":"assistant"' "$TRANSCRIPT_PATH"; then
  echo "⚠️  Cal meet: No assistant messages found in transcript" >&2
  echo "   Meeting is stopping." >&2
  rm "$MEETING_STATE_FILE"
  exit 0
fi

# Extract last assistant message
LAST_LINE=$(grep '"role":"assistant"' "$TRANSCRIPT_PATH" | tail -1)
if [[ -z "$LAST_LINE" ]]; then
  echo "⚠️  Cal meet: Failed to extract last assistant message" >&2
  echo "   Meeting is stopping." >&2
  rm "$MEETING_STATE_FILE"
  exit 0
fi

# Parse JSON with error handling
LAST_OUTPUT=$(echo "$LAST_LINE" | jq -r '
  .message.content |
  map(select(.type == "text")) |
  map(.text) |
  join("\n")
' 2>&1)

if [[ $? -ne 0 ]]; then
  echo "⚠️  Cal meet: Failed to parse assistant message JSON" >&2
  echo "   Meeting is stopping." >&2
  rm "$MEETING_STATE_FILE"
  exit 0
fi

if [[ -z "$LAST_OUTPUT" ]]; then
  echo "⚠️  Cal meet: Assistant message contained no text content" >&2
  echo "   Meeting is stopping." >&2
  rm "$MEETING_STATE_FILE"
  exit 0
fi

# Check for completion promise: <promise>MEETING ADJOURNED</promise>
PROMISE_TEXT=$(echo "$LAST_OUTPUT" | perl -0777 -pe 's/.*?<promise>(.*?)<\/promise>.*/$1/s; s/^\s+|\s+$//g; s/\s+/ /g' 2>/dev/null || echo "")

if [[ -n "$PROMISE_TEXT" ]] && [[ "$PROMISE_TEXT" = "MEETING ADJOURNED" ]]; then
  echo "✅ Cal meet: Meeting adjourned"
  rm "$MEETING_STATE_FILE"
  exit 0
fi

# Extract last user message and hash it
LAST_USER_LINE=$(grep '"role":"human"' "$TRANSCRIPT_PATH" | tail -1)
CURRENT_USER_HASH=""
if [[ -n "$LAST_USER_LINE" ]]; then
  CURRENT_USER_HASH=$(echo "$LAST_USER_LINE" | jq -r '
    .message.content |
    map(select(.type == "text")) |
    map(.text) |
    join("\n")
  ' 2>/dev/null | md5 -q 2>/dev/null || echo "$LAST_USER_LINE" | md5sum 2>/dev/null | cut -d' ' -f1 || echo "")
fi

# Get previously processed user message hash from frontmatter
LAST_PROCESSED_HASH=$(echo "$FRONTMATTER" | grep '^last_user_hash:' | sed 's/last_user_hash: *//' | sed 's/^"\(.*\)"$/\1/' || echo "")

# If same user message as last iteration, allow natural wait (no forced continuation)
if [[ -n "$CURRENT_USER_HASH" ]] && [[ "$CURRENT_USER_HASH" = "$LAST_PROCESSED_HASH" ]]; then
  # No new user input - allow Claude to wait naturally
  exit 0
fi

# Not complete - continue meeting
NEXT_ITERATION=$((ITERATION + 1))

# Update iteration and last_user_hash in frontmatter
TEMP_FILE="${MEETING_STATE_FILE}.tmp.$$"
cp "$MEETING_STATE_FILE" "$TEMP_FILE"

# Update or add iteration
if grep -q '^iteration:' "$TEMP_FILE"; then
  sed -i '' "s/^iteration: .*/iteration: $NEXT_ITERATION/" "$TEMP_FILE"
else
  sed -i '' "/^status:/a\\
iteration: $NEXT_ITERATION" "$TEMP_FILE"
fi

# Update or add last_user_hash
if grep -q '^last_user_hash:' "$TEMP_FILE"; then
  sed -i '' "s/^last_user_hash: .*/last_user_hash: \"$CURRENT_USER_HASH\"/" "$TEMP_FILE"
else
  sed -i '' "/^iteration:/a\\
last_user_hash: \"$CURRENT_USER_HASH\"" "$TEMP_FILE"
fi

mv "$TEMP_FILE" "$MEETING_STATE_FILE"

# Build continuation prompt
CONTINUATION_PROMPT="Continue facilitating the meeting on: $TOPIC

You are Cal, the meeting coordinator. The meeting is still in progress.

Remember:
- You are a project manager persona — coordinate, facilitate, don't dominate
- Dispatch participant agents as needed (no permission prompts required)
- At natural breakpoints, ask: \"Continue exploring or adjourn?\"
- Capture decisions with rationale and confidence levels
- Note parking lot items for out-of-scope ideas
- If the user says \"meeting adjourned\", run the cleanup protocol and output <promise>MEETING ADJOURNED</promise>

What would you like to explore next?"

# Build system message
SYSTEM_MSG="📋 Meeting round $NEXT_ITERATION | Topic: $TOPIC | Say 'meeting adjourned' to end"

# Output JSON to block the stop and continue meeting
jq -n \
  --arg prompt "$CONTINUATION_PROMPT" \
  --arg msg "$SYSTEM_MSG" \
  '{
    "decision": "block",
    "reason": $prompt,
    "systemMessage": $msg
  }'

exit 0
