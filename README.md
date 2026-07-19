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
