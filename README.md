# Sealedto

Wedding e-vites with opening animations, curated guest links, and RSVP admin.

Stack mirrors Voyaroo: Next.js 16 + React 19 + Auth.js + Postgres (`pg`) + Sass modules.

## Local setup

```bash
npm install
cp .env.example .env.local
# set a real AUTH_SECRET in .env.local
npm run db:up
npm run db:migrate
npm run dev
```

## Scripts

- `npm run dev` — local app
- `npm run db:up` / `db:down` — Docker Postgres on port `54323`
- `npm run db:migrate` — apply SQL migrations
- `npm test` — vitest
- `npm run build` — production build (`output: "standalone"`)

## Railway

1. Create a project with a **Postgres** plugin and a **web** service from this repo
2. Set env vars:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `AUTH_SECRET` (long random)
   - `NEXTAUTH_URL` (your https domain)
   - `AUTH_TRUST_HOST=true`
3. Pre-deploy / release command: `npm run db:migrate`
4. Start command: `node .next/standalone/server.js` (after `next build`)

## Product routes

- `/` — showcase homepage
- `/login`, `/register` — creator auth
- `/admin` — invites + RSVP admin
- `/i/[slug]` — public invite
- `/g/[token]` — curated personal invite
