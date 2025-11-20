# ArtisanHub Backend (scaffold)

Quick scaffolded backend for the multi-vendor marketplace. Uses Node + TypeScript + Express + Prisma (SQLite by default for quick prototyping).

Getting started (from `backend/`):

1. Install dependencies

```powershell
npm install
```

2. Copy env file

```powershell
cp .env.example .env
```

3. Initialize Prisma DB and generate client

```powershell
npx prisma generate
npx prisma migrate dev --name init --skip-seed
```

4. Run in development

```powershell
npm run dev
```

Notes:
- This is a minimal scaffold to get auth and products endpoints running quickly. Switch `DATABASE_URL` in `.env` to a Postgres URL for production.
- To switch to Postgres:

- Update `.env` to set `PROVIDER="postgresql"` and `DATABASE_URL` to your Postgres connection string.
- Update `prisma/schema.prisma` if you need DB-specific adjustments (the scaffold uses an env-driven provider).
- Run migrations against Postgres:

```powershell
npx prisma generate
npx prisma migrate deploy
```

- If you want to create migrations locally against Postgres instead of SQLite, run `npx prisma migrate dev` after setting `.env` to your Postgres URL.
- Next steps: implement vendor onboarding, orders, payments, unit tests, and secure refresh token storage.
