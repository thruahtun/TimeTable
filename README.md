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

## Deploy to Vercel + Render

The Vercel frontend **cannot** call `localhost:4000`. Browsers block public HTTPS sites from reaching your local machine.

### 1. Deploy the API (Render)

1. Create a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Deploy this repo on [Render](https://render.com) using `render.yaml`, or manually:
   - **Build command:** `npm install && npm run prisma:generate && npx prisma db push --schema apps/api/prisma/schema.prisma && npm run build -w apps/api`
   - **Start command:** `npm run start -w apps/api`
3. Set environment variables on Render:
   - `DATABASE_URL` = your hosted PostgreSQL URL
   - `WEB_ORIGIN` = `https://time-table-web.vercel.app`

Copy your Render API URL, for example `https://girlfriend-timetable-api.onrender.com`.

### 2. Configure Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-api.onrender.com` |

Set the **Root Directory** to `apps/web`, then redeploy.

After redeploy, the site should show **Connected to database** and save entries to Prisma.
