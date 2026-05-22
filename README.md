# Barmentech Seguros Platform

Monorepo for Barmentech Seguros MVP Phase 1.

This repository contains:
- A NestJS backend API for auth, quotations, leads, settings, email notifications, and storage.
- A Next.js frontend for public website, legal pages, auth, and role-based dashboards.

## Repository Structure

```text
barmentechseguros/
  backend/                # NestJS + Prisma API
  nextjs-insurance-app/   # Next.js web app
```

## Tech Stack

### Backend (`backend`)
- NestJS 11
- Prisma ORM + PostgreSQL
- JWT auth + role guards
- Resend (transactional emails)
- OpenAI integration (quotation extraction)
- DigitalOcean Spaces / S3 compatible storage

### Frontend (`nextjs-insurance-app`)
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Axios API client

## Local Development

## Prerequisites
- Node.js 20+
- npm (or compatible package manager)
- PostgreSQL database

## 1) Backend

```bash
cd backend
npm install
npm run start:dev
```

Default local API base used by the project: `http://localhost:3005/api`

## 2) Frontend

```bash
cd nextjs-insurance-app
npm install
npm run dev
```

Frontend development server is configured on port `3004`.

## 3) Open in browser
- Frontend: `http://localhost:3004`
- Backend API: `http://localhost:3005/api`

## Environment Variables

Use local `.env` files only.

Important:
- `.env*` files are git-ignored.
- Never commit secrets or credentials.

Typical backend variables (names only, no values):
- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `FRONTEND_URL`
- `BACKEND_URL`
- `DO_SPACES_BUCKET`
- `DO_SPACES_REGION`
- `DO_SPACES_ENDPOINT`
- `DO_SPACES_ACCESS_KEY`
- `DO_SPACES_SECRET_KEY`

Typical frontend variables (names only, no values):
- `NEXT_PUBLIC_API_URL`

## Database and Prisma

From `backend`:

```bash
# Apply migrations
npx prisma migrate deploy

# Optional seeds
npm run seed
npm run seed:additional-services
```

## Build Commands

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd nextjs-insurance-app
npm run build
npm run start
```

## Git Branching Strategy

Current workflow:
- `main`: production branch
- `staging`: pre-production validation branch
- local feature branches: development work

Promotion flow:
1. Develop and test locally.
2. Merge into `staging` and validate in staging environment.
3. Merge `staging` into `main` for production release.

## Security Policy

- Do not commit `.env` files.
- Do not commit keys, tokens, certificates, or private credentials.
- Rotate any key that was accidentally exposed outside secure channels.
- Keep logs and build artifacts out of version control.

## Release Tag

MVP Phase 1 baseline tag:
- `v0.1.0-mvp-phase1`

## License

Proprietary. Internal project.
