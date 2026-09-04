# Sealedto

Wedding e-vites with opening animations, curated guest links, and RSVP admin.

Create an invite in the admin, share a public link or personalised guest links, and collect RSVPs in one place.

## Stack

- **Next.js 16** (App Router, Turbopack, `output: "standalone"`)
- **React 19**
- **Auth.js** (`next-auth` v5) for creator accounts
- **Postgres** via **Prisma ORM** (`pg` driver adapter)
- **Sass modules** + Tailwind CSS
- **Framer Motion** + **GSAP** for invite motion
- Optional **Cloudinary** for production image uploads (local filesystem is the default)

## Product routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/login`, `/register` | Creator auth |
| `/admin` | Invite dashboard |
| `/admin/invites/new` | Create invite |
| `/admin/invites/[id]` | Edit invite + share kit |
| `/admin/invites/[id]/guests` | Guest list, CSV import/export, personal links |
| `/admin/preview` | Full-page live preview from draft state |
| `/i/[slug]` | Public invite |
| `/g/[token]` | Curated personal invite |

## Prerequisites

- Node.js 20.19+
- Postgres 16+ (local install or hosted)
- npm

## Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/sealedto
AUTH_SECRET=replace-with-a-long-random-string   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
UPLOAD_PROVIDER=local
```

Create the database, apply Prisma migrations, then run the app:

```bash
createdb sealedto
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register a creator account, then use `/admin` to create an invite.

### Database migrations

Schema lives in `prisma/schema.prisma`. Migrations live in `prisma/migrations/` and are applied with Prisma Migrate.

```bash
npm run db:migrate        # prisma migrate deploy (CI / production)
npm run db:migrate:dev    # prisma migrate dev (local schema changes)
npm run db:studio         # Prisma Studio
```

`prisma.config.ts` loads `DATABASE_URL` from `.env.local` then `.env`.

**Rules of thumb**

- Always run `npm run db:migrate` after pulling schema changes (or `db:migrate:dev` when you change the schema locally).
- Never edit an already-applied migration in a shared/prod database — create a new Prisma migration instead.

If you still have a database created by the old hand-written SQL migrations, use a fresh database. The Prisma init migration is not a drop-in replay of those files.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Local Next.js dev server |
| `npm run build` | Production build (standalone output) |
| `npm start` | `next start` |
| `npm run start:standalone` | `node .next/standalone/server.js` |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run db:migrate` | Apply pending Prisma migrations (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Create/apply migrations from schema changes |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma Client |

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string |
| `AUTH_SECRET` | Yes | Long random secret for Auth.js |
| `NEXTAUTH_URL` | Yes | Public origin of the app (`https://…` in prod) |
| `AUTH_TRUST_HOST` | Yes in prod | Set to `true` behind Railway / reverse proxies |
| `UPLOAD_PROVIDER` | No | `local` (default) or `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | If Cloudinary | |
| `CLOUDINARY_API_KEY` | If Cloudinary | |
| `CLOUDINARY_API_SECRET` | If Cloudinary | |

## Image uploads

- **Local (default):** files land in `uploads/` under the project root. Fine for local development.
- **Cloudinary (recommended in production):** set `UPLOAD_PROVIDER=cloudinary` plus the three Cloudinary vars. Railway’s filesystem is ephemeral — local uploads will disappear on restart/redeploy.

## Deploy to Railway

The app is already configured for Railway: Next.js `output: "standalone"` and Prisma Migrate that only needs `DATABASE_URL`.

### 1. Create the project

1. Push this repo to GitHub.
2. In [Railway](https://railway.app): **New Project → Deploy from GitHub repo**.
3. Add a database: **+ New → Database → PostgreSQL**.

You should have two services in the same project: the **web** app and **Postgres**.

### 2. Configure the web service

**Settings → Build / Deploy**

| Setting | Value |
| --- | --- |
| Build command | `npm run build` (or leave default if Nixpacks already runs it) |
| Start command | `node .next/standalone/server.js` |
| Custom start / release command | `npm run db:migrate` |

Put `npm run db:migrate` on the **release / pre-deploy** step so schema updates run before the new process starts. Prisma records applied migrations in `_prisma_migrations` and skips them on later deploys.

If Railway’s UI only exposes a single start command, use:

```bash
npm run db:migrate && node .next/standalone/server.js
```

### 3. Environment variables

On the **web** service → **Variables**:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://<your-railway-domain>
AUTH_TRUST_HOST=true

UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=<from Cloudinary>
CLOUDINARY_API_KEY=<from Cloudinary>
CLOUDINARY_API_SECRET=<from Cloudinary>
```

`DATABASE_URL=${{Postgres.DATABASE_URL}}` is a Railway reference variable — it injects the Postgres plugin’s connection string at runtime and during the release command.

### 4. Domain + Auth URL

1. Under **Settings → Networking**, generate a Railway domain or attach a custom domain.
2. Set `NEXTAUTH_URL` to that exact origin, e.g. `https://sealedto-production.up.railway.app` (no trailing slash).
3. Redeploy after changing `NEXTAUTH_URL`.

### 5. Verify the deploy

1. Confirm the release logs show Prisma migrations applied, e.g. `20260903100000_init`.
2. Open `/register`, create a creator account.
3. Create an invite in `/admin`, upload a hero image (Cloudinary), publish, and open `/i/[slug]`.
4. Add a curated guest and open their `/g/[token]` link.

### Railway troubleshooting

| Symptom | Likely fix |
| --- | --- |
| App boots but login redirects fail | Wrong `NEXTAUTH_URL`, or missing `AUTH_TRUST_HOST=true` |
| `Missing DATABASE_URL` during migrate | Wire `DATABASE_URL` as `${{Postgres.DATABASE_URL}}` on the **web** service |
| Migration fails mid-deploy | Check release logs; fix schema / connection; re-deploy (already-applied Prisma migrations stay recorded) |
| Hero / gallery images vanish after redeploy | Switch to `UPLOAD_PROVIDER=cloudinary` — local disk is ephemeral |
| Standalone start fails | Confirm build finished and start command is `node .next/standalone/server.js` |

## Production checklist

- [ ] Postgres provisioned and `DATABASE_URL` set on the web service
- [ ] `npm run db:migrate` runs on every deploy (release or start prefix)
- [ ] Strong `AUTH_SECRET`
- [ ] `NEXTAUTH_URL` matches the public HTTPS origin
- [ ] `AUTH_TRUST_HOST=true`
- [ ] Cloudinary configured for uploads
- [ ] Smoke-tested register → create invite → publish → public + curated guest links

## Project layout (high level)

```
app/                  App Router pages + API routes
components/admin/     Invite editor, guests, share kit
components/invite/    Editorial template, sections, motion, themes
prisma/               Schema + Prisma migrations
lib/                  Prisma client, invites, uploads, auth helpers
lib/generated/        Generated Prisma Client (`npm run db:generate`)
```
