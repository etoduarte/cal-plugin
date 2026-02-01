#!/bin/bash

# Cal Coordinator Guard - PreToolUse Hook
# Blocks direct code writing when Cal should dispatch to agents
# Makes "Cal never codes" a physical constraint, not a verbal one

set -euo pipefail

# Read hook input from stdin
HOOK_INPUT=$(cat)

# Extract tool name from hook input
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // empty')

# Tools that write code
CODE_TOOLS=("Edit" "Write" "NotebookEdit")

# Check if this is a code-writing tool
IS_CODE_TOOL=false
for tool in "${CODE_TOOLS[@]}"; do
  if [[ "$TOOL_NAME" == "$tool" ]]; then
    IS_CODE_TOOL=true
    break
  fi
done

# If not a code tool, allow
if [[ "$IS_CODE_TOOL" == "false" ]]; then
  exit 0
fi

# Extract file path from tool input
FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty')

# Allow writing to Cal system files (cal/, commands/, skills/, docs/, ideas/)
# These are coordination artifacts, not implementation code
CAL_PATHS=(
  "cal/"
  "commands/"
  "skills/"
  "docs/"
  "ideas/"
  "hooks/"
  ".claude/"
  "CLAUDE.md"
  "README.md"
  ".claude-plugin/"
)

for allowed_path in "${CAL_PATHS[@]}"; do
  if [[ "$FILE_PATH" == *"$allowed_path"* ]]; then
    # Allowed - this is Cal coordination, not coding
    exit 0
  fi
done

# Block code writing outside Cal system files
# Cal should dispatch to Coder agent instead

jq -n '{
  "decision": "block",
  "reason": "🛑 Cal is a coordinator, not a coder.\n\nTo write implementation code, use the dispatch skill:\n1. Read cal/team.md for the Coder agent\n2. Dispatch via Task tool with context\n3. Let the agent write the code\n\nCal manages the pipeline. Agents do the work."
}'

exit 0
