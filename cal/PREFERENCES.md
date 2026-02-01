# Project Preferences

Hardcoded defaults. Override training defaults.

## Stack

| Layer | Tool |
|-------|------|
| Database | Supabase |
| Hosting | Vercel |
| Auth | Supabase Auth |

## Deploy Flow

```
git commit → git push → review on Vercel preview
```

Push immediately. Review live. Not local.

## React/Next.js

- **Storybook first** — Build components in Storybook, then integrate
- **Stories for everything** — Every component gets a story
- **Storybook path:** `/admin/storybook` (part of app, not separate)

## Next.js Boundaries

Classes can't serialize across server/client. Use Hot Potato:

```
Server: DB → DTO (plain object) → JSON
Client: JSON → hydrate to class → use rich object
```

Rich objects live on client only. DTOs cross the wire.

## Git

- Small commits, push often
- Use Vercel preview links for review
- PR when feature complete
