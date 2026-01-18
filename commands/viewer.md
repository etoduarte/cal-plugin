---
description: "Launch the Cal Viewer web UI"
allowed-tools: ["Bash"]
---

# Viewer - Launch Cal Viewer Web UI

**Trigger:** `/cal:viewer`

**Purpose:** Start the localhost web server and open the Cal Viewer in your browser.

## What It Does

1. Installs dependencies if needed (`npm install`)
2. Starts the Express server on port 3000
3. Opens your default browser to http://localhost:3000

## Instructions

Run the following commands to start the viewer:

```!
cd "${CLAUDE_PLUGIN_ROOT}/cal/viewer" && npm install --silent 2>/dev/null && npm start &
sleep 2 && open "http://localhost:3000"
```

**Note:** The server runs in the background. To stop it:
- Find the process: `lsof -i :3000`
- Kill it: `kill <PID>`

Or press Ctrl+C in the terminal where it's running.

## Features

- **Real-time updates** - Changes appear within 500ms
- **Sidebar navigation** - File tree for the entire cal/ folder
- **Meeting tabs** - Switch between participant files
- **Search** - Filter and highlight across all content
- **Apple-inspired styling** - Clean, readable interface

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000 | grep LISTEN
kill -9 <PID>
```

**Dependencies not installing:**
```bash
cd cal/viewer && rm -rf node_modules && npm install
```
