# Cal Sync Feature - MVP Specification

**Status:** Ready for Implementation
**Created:** 2026-01-16
**Author:** Lisa Interview

---

## Overview

Cal Sync connects users' GitHub repositories to the Cal web app, allowing them to view their `.claude/` configuration in a web dashboard. This is the foundation for future conflict resolution and bidirectional sync features.

## Goals

1. Let users connect GitHub repos to Cal web app
2. Sync `.claude/` folder contents to Supabase
3. Display file tree browser in dashboard
4. Real-time updates via GitHub webhooks

## Non-Goals (MVP)

- Conflict detection/resolution
- Sharing/privacy features between users
- Writing back to repos
- Diff comparison with canonical plugin

---

## Technical Architecture

### Data Flow

```
1. User logs in (passkey)
2. User clicks "Connect GitHub"
3. GitHub OAuth → grants repo access
4. User selects repos to connect
5. Web app registers webhooks on selected repos
6. Initial sync pulls .claude/ contents → Supabase
7. Webhook fires on push → refreshes Supabase cache
8. Dashboard shows file tree from Supabase
```

### Database Schema

```sql
-- GitHub connections
CREATE TABLE github_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_user_id TEXT NOT NULL,
  github_username TEXT NOT NULL,
  access_token TEXT NOT NULL, -- encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Connected repositories
CREATE TABLE connected_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_connection_id UUID NOT NULL REFERENCES github_connections(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL, -- e.g., "etoduarte/cal-plugin"
  repo_id BIGINT NOT NULL,
  webhook_id BIGINT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, repo_full_name)
);

-- Synced files
CREATE TABLE synced_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES connected_repos(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL, -- e.g., ".claude/commands/fly.md"
  content TEXT,
  sha TEXT, -- git blob SHA for change detection
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(repo_id, file_path)
);
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github/auth` | GET | Initiate GitHub OAuth |
| `/api/github/callback` | GET | Handle OAuth callback |
| `/api/github/repos` | GET | List user's repos |
| `/api/repos/connect` | POST | Connect selected repos |
| `/api/repos/[id]/files` | GET | Get file tree for repo |
| `/api/repos/[id]/files/[path]` | GET | Get file contents |
| `/api/webhooks/github` | POST | Handle GitHub webhook |

---

## User Stories

### US-1: GitHub OAuth Connection

**As a** Cal user
**I want to** connect my GitHub account
**So that** Cal can access my repos

**Acceptance Criteria:**
- [ ] Dashboard shows "Connect GitHub" button when no GitHub connected
- [ ] Clicking button opens GitHub OAuth popup
- [ ] User grants access, returns to Cal dashboard
- [ ] GitHub access token stored in Supabase (encrypted)
- [ ] Dashboard shows "GitHub connected" state

**Technical Notes:**
- Use GitHub OAuth App (not GitHub App) for simplicity
- Request `repo` scope for full repo access
- Encrypt access token before storing (use existing encryption utils)

---

### US-2: Repo Selection

**As a** Cal user with GitHub connected
**I want to** select which repos to sync
**So that** only relevant projects are tracked

**Acceptance Criteria:**
- [ ] After OAuth, user sees list of ALL their repos
- [ ] Simple checkbox list UI
- [ ] User can select multiple repos
- [ ] "Connect selected" button triggers webhook setup + initial sync
- [ ] Connected repos appear in main dashboard

**Technical Notes:**
- Use GitHub API `GET /user/repos` with pagination
- Show all repos (don't filter by .claude/ presence)
- Store repo metadata in `connected_repos` table

---

### US-3: Webhook Setup & Initial Sync

**As a** Cal user
**I want to** have my .claude/ folder synced automatically
**So that** Cal web app stays up to date

**Acceptance Criteria:**
- [ ] Webhook registered on each connected repo (push events)
- [ ] Initial sync pulls entire `.claude/` folder contents
- [ ] Files stored in `synced_files` table
- [ ] "Last synced" timestamp shown per repo
- [ ] Webhook updates refresh file contents

**Technical Notes:**
- Use GitHub API to create webhook: `POST /repos/{owner}/{repo}/hooks`
- Webhook URL: `https://cal.applacat.com/api/webhooks/github`
- Initial sync: Use GitHub Contents API to get `.claude/` tree recursively
- On webhook: Only sync files that changed (check SHA)

---

### US-4: File Tree Browser

**As a** Cal user
**I want to** browse my .claude/ folder in the web UI
**So that** I can see my Cal configuration

**Acceptance Criteria:**
- [ ] Click project → shows expandable file tree
- [ ] Folders (commands/, agents/) are expandable
- [ ] Click file → shows contents in viewer panel
- [ ] Syntax highlighting for .md and .json files
- [ ] Shows "Last synced" timestamp

**Technical Notes:**
- Build tree structure from `synced_files` paths
- Use Monaco editor or similar for syntax highlighting
- Lazy-load file contents on click

---

## UI Mockup (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ Cal Dashboard                              [Connect GitHub] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Connected Projects                                         │
│  ─────────────────                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 pixley-mvp                    Last sync: 2m ago  │   │
│  │    └─ .claude/                                      │   │
│  │       ├─ commands/                                  │   │
│  │       │  ├─ review.md                              │   │
│  │       │  └─ deploy.md                              │   │
│  │       ├─ agents/                                    │   │
│  │       ├─ settings.json                             │   │
│  │       └─ CLAUDE.md                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📁 cal-server                    Last sync: 5m ago  │   │
│  │    └─ .claude/ ...                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Future Phases (Not MVP)

### Phase 2: Conflict Resolution
- Detect when plugin updates conflict with project customizations
- Show side-by-side diff in web UI
- User resolves conflicts
- Commit resolution back to repo

### Phase 3: Privacy & Sharing
- Per-project sharing toggle
- User approves specific diffs before admin sees them
- Aggregate patterns without exposing raw content

### Phase 4: Bidirectional Sync
- Promote good customizations to canonical plugin
- Admin review workflow
- PR generation

---

## Verification

After each user story, verify:

1. **US-1:** Can connect GitHub, see "connected" state
2. **US-2:** Can see repo list, select repos, they appear in dashboard
3. **US-3:** Webhook creates successfully, initial sync populates files
4. **US-4:** Can browse file tree, view file contents

**Test commands:**
```bash
npm run build  # Ensure no build errors
npm run typecheck  # Ensure no type errors
```

---

## Implementation Order

1. US-1: GitHub OAuth Connection
2. US-2: Repo Selection
3. US-3: Webhook Setup & Initial Sync
4. US-4: File Tree Browser

Each story is completable in one focused coding session.
