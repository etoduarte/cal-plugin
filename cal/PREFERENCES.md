# Project Preferences

Hardcoded defaults. These override training defaults.

## Infrastructure Stack

| Layer | Tool | Non-negotiable |
|-------|------|----------------|
| Database | Supabase | Yes |
| Hosting | Vercel | Yes |
| Auth | Supabase Auth | Yes |

## Deploy Workflow

**Preferred flow:**
```
git add → git commit → git push → review live on Vercel preview
```

Not: commit and wait. Push immediately. Review on live preview URL.

## React Projects

**Required:**
- Storybook for all component development
- Build components in Storybook FIRST, then integrate
- Stories for every component
- Deploy Storybook to `/admin/storybook` path

**Component order:**
1. Design in Storybook
2. Build variants
3. Test interactions
4. Then integrate into app

## Git Preferences

- Commit frequently, small commits
- Push after each logical unit
- Use Vercel preview links for review
- PR when feature complete
