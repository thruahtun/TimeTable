# Girlfriend Timetable

A small full-stack timetable app built with React, TypeScript, Express, PostgreSQL, Prisma, and shadcn-style UI components.

## Stack

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS + shadcn-style components
- Backend: Express.js + TypeScript
- Database: PostgreSQL + Prisma ORM

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the backend environment file:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

4. Update `apps/api/.env` if your PostgreSQL connection string is different.

5. Run Prisma migration:

   ```bash
   npm run prisma:migrate
   ```

6. Start frontend and backend together:

   ```bash
   npm run dev
   ```

The web app runs on `http://localhost:5173`.
The API runs on `http://localhost:4000`.

## Deploy to Vercel

The frontend and API can run on the same Vercel project. You do **not** need `VITE_API_URL` in production.

### 1. Create a hosted PostgreSQL database

Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy the connection string.

### 2. Configure Vercel

Set **Root Directory** to `apps/web`, then add this environment variable:

| Name | Value |
|------|-------|
| `DATABASE_URL` | your hosted PostgreSQL connection string |

Redeploy. The build runs `prisma db push` and creates the tables automatically.

### 3. Local development

Keep using the Express API on port 4000:

```bash
npm run dev
```

Set `VITE_API_URL=http://localhost:4000` in `apps/web/.env`.
