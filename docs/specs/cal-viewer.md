# Cal Viewer Specification

**Status:** Ready for Implementation
**Created:** 2026-01-17
**Source:** Lisa interview session

---

## Overview

A localhost web UI for browsing Cal markdown output. The viewer provides real-time, beautifully rendered access to the full `cal/` folder structure without digging through Finder.

## Hard Requirements

- **Sync:** Real-time auto-refresh via WebSocket (< 500ms latency)
- **Scope:** Full `cal/` folder (journal, meetings, inside-out, agent-prompts)
- **Stack:** Node.js + Express + WebSocket
- **Navigation:** Sidebar file tree
- **Meetings:** Tabbed participant view
- **Startup:** `/cal:viewer` command, auto-opens browser, port 3000
- **Style:** Apple-inspired (SF typography, whitespace, subtle shadows)
- **Location:** `cal/viewer/` inside Cal plugin
- **Target:** Auto-detect `cal/` in current working directory

## MVP Features

1. Sidebar tree navigation
2. Real-time refresh via WebSocket (< 500ms)
3. Tabbed participant view for meetings
4. Apple-inspired styling
5. Syntax highlighting for code blocks
6. Search with tree filter + content highlighting
7. Auto-open browser on launch

## Out of Scope (Post-MVP)

- Persist last viewed file
- Dark mode
- Export to PDF
- Bidirectional chat (web UI writing to files)

---

## Architecture

```
Cal Plugin Root/
├── commands/
│   └── viewer.md              # /cal:viewer command definition
└── cal/
    └── viewer/
        ├── package.json
        ├── server.js          # Express + WebSocket + file watcher
        ├── public/
        │   ├── index.html
        │   ├── styles.css     # Apple-inspired
        │   └── app.js         # Client: tree, tabs, search, WebSocket
        └── lib/
            ├── watcher.js     # chokidar file watcher
            └── search.js      # Text search across markdown
```

---

## User Stories

### Phase 1: Foundation

#### US-1: API Tree Endpoint

**As a** Cal user viewing the web UI
**I want** the server to expose the cal/ folder structure as JSON
**So that** the frontend can render a navigable tree

**Acceptance Criteria:**
- [ ] `GET /api/tree` returns JSON structure: `{name, type, children}`
- [ ] Includes all `.md` files and subdirectories
- [ ] Response time < 100ms for typical cal/ folder

**Verification:**
```bash
curl http://localhost:3000/api/tree | jq .
# Returns valid JSON tree structure
```

---

#### US-2: WebSocket File Change Events

**As a** Cal user viewing the web UI
**I want** the UI to update automatically when files change
**So that** I see new content without manual refresh

**Acceptance Criteria:**
- [ ] Server watches `cal/` folder using chokidar
- [ ] File add/change/delete emits WebSocket event
- [ ] Event includes file path and change type
- [ ] Latency from file save to event < 500ms

**Verification:**
```bash
# In one terminal: start server
# In another: echo "test" >> cal/cal.md
# WebSocket message received within 500ms
```

---

### Phase 2: UI Core

#### US-3: Sidebar Tree Rendering

**As a** Cal user
**I want** a sidebar showing the cal/ folder structure
**So that** I can navigate to any file

**Acceptance Criteria:**
- [ ] Left sidebar shows expandable folder tree
- [ ] Folders are expandable/collapsible
- [ ] Files show appropriate icons (📄 for .md)
- [ ] Current selection highlighted

**Verification:**
- Open browser, sidebar shows tree
- Click folder to expand, click again to collapse
- Tree matches actual cal/ folder structure

---

#### US-4: Markdown Content Rendering

**As a** Cal user
**I want** clicking a file to render its markdown content
**So that** I can read it beautifully formatted

**Acceptance Criteria:**
- [ ] Click file in tree → content appears in main pane
- [ ] Markdown rendered as HTML (headers, lists, code blocks, links)
- [ ] Content pane scrollable independently of sidebar
- [ ] File path shown in header/breadcrumb

**Verification:**
- Click `cal/cal.md` in tree
- Content renders with proper formatting
- Headers, code blocks, lists display correctly

---

#### US-5: Meeting Participant Tabs

**As a** Cal user viewing a meeting folder
**I want** tabbed navigation between participant files
**So that** I can switch between architect, product-visionary, etc.

**Acceptance Criteria:**
- [ ] Meeting folders (containing multiple `participant-*.md`) show tabs
- [ ] Tab labels extracted from filename (e.g., "architect" from `participant-architect.md`)
- [ ] Clicking tab switches content pane
- [ ] Active tab visually distinguished
- [ ] Also shows tabs for `guest-*.md`, `notes.md`, `minutes.md`

**Verification:**
- Navigate to a meeting folder with multiple participant files
- Tabs appear above content
- Clicking tabs switches displayed content

---

### Phase 3: Polish

#### US-6: Apple-Inspired Styling

**As a** Cal user
**I want** the UI to look clean and professional
**So that** reading is pleasant

**Acceptance Criteria:**
- [ ] Font: `-apple-system, BlinkMacSystemFont, system-ui` stack
- [ ] Generous whitespace (24px+ margins)
- [ ] Sidebar: subtle gray background (#f5f5f7), hover states
- [ ] Content: comfortable reading width (max 720px)
- [ ] Subtle shadows and rounded corners on cards
- [ ] Responsive: works on 1280px+ screens

**Verification:**
- Visual inspection matches Apple design language
- Text is comfortable to read
- Hover states provide feedback

---

#### US-7: Syntax Highlighting

**As a** Cal user reading markdown with code blocks
**I want** code to be syntax highlighted
**So that** code examples are readable

**Acceptance Criteria:**
- [ ] Code blocks detected by language hint (```javascript, ```bash, etc.)
- [ ] Syntax highlighting applied (using highlight.js or Prism)
- [ ] Unhinted code blocks get basic monospace styling
- [ ] Colors work with light background

**Verification:**
- Open a file with code blocks
- JavaScript, bash, markdown blocks show colored syntax

---

#### US-8: Search with Filter and Highlight

**As a** Cal user
**I want** to search across all markdown content
**So that** I can find specific information quickly

**Acceptance Criteria:**
- [ ] Search input in header/toolbar
- [ ] Typing filters tree to show only files containing search term
- [ ] When file is opened, search term is highlighted in content
- [ ] Clear button resets search
- [ ] Search is case-insensitive
- [ ] Debounced (300ms) to avoid excessive filtering

**Verification:**
- Type "DELTA" in search
- Tree filters to files containing "DELTA"
- Open a result, "DELTA" instances highlighted in yellow

---

### Phase 4: Integration

#### US-9: /cal:viewer Command

**As a** Cal user
**I want** to launch the viewer with `/cal:viewer`
**So that** I don't need to manually run npm scripts

**Acceptance Criteria:**
- [ ] `/cal:viewer` command defined in `commands/viewer.md`
- [ ] Command runs `npm start` in `cal/viewer/`
- [ ] Auto-opens default browser to `http://localhost:3000`
- [ ] Prints "Cal Viewer running at http://localhost:3000"

**Verification:**
```bash
/cal:viewer
# Server starts, browser opens automatically
```

---

## Edge Cases

### Empty cal/ Folder
- Show friendly message: "No Cal files yet. Run `/cal:onboard` to get started."
- Tree shows empty state, not error

### Malformed Markdown
- Render as-is with best effort
- Don't crash on invalid syntax
- Show raw text if parsing fails completely

### Server Already Running
- Detect port 3000 in use
- Print "Viewer already running at http://localhost:3000"
- Open browser to existing instance instead of failing

---

## Verification Commands

```bash
# Start viewer
cd cal/viewer && npm start

# Verify tree API
curl http://localhost:3000/api/tree

# Test real-time (in separate terminal)
echo "## Test Entry" >> cal/cal.md
# Should appear in UI within 500ms
```

---

## Implementation Order

1. **Phase 1** (US-1, US-2): Server foundation — API + WebSocket
2. **Phase 2** (US-3, US-4, US-5): UI core — tree, content, tabs
3. **Phase 3** (US-6, US-7, US-8): Polish — styling, highlighting, search
4. **Phase 4** (US-9): Integration — /cal:viewer command

Each phase should be independently verifiable before proceeding.
