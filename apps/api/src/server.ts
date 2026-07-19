import cors from "cors";
import "dotenv/config";
import express from "express";
import { ZodError } from "zod";
import { prisma } from "./db.js";
import { timetableEntrySchema } from "./timetable.schema.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:5173";
const allowedOrigins = new Set(
  webOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const allowsVercelOrigins = [...allowedOrigins].some((origin) => origin.includes(".vercel.app"));

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  if (/^http:\/\/localhost:\d+$/.test(origin)) {
    return true;
  }

  if (allowsVercelOrigins && /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, origin ?? webOrigin);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/api/timetable", (_req, res) => {
  res.json({
    message: "Time Table API is running 🚀"
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/timetable", async (_req, res, next) => {
  try {
    const entries = await prisma.timetableEntry.findMany({
      orderBy: [{ day: "asc" }, { startTime: "asc" }]
    });

    res.json(entries);
  } catch (error) {
    next(error);
  }
});

app.post("/api/timetable", async (req, res, next) => {
  try {
    const data = timetableEntrySchema.parse(req.body);
    const entry = await prisma.timetableEntry.create({ data });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.put("/api/timetable/:id", async (req, res, next) => {
  try {
    const data = timetableEntrySchema.parse(req.body);
    const entry = await prisma.timetableEntry.update({
      where: { id: req.params.id },
      data
    });

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/timetable/:id", async (req, res, next) => {
  try {
    await prisma.timetableEntry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Invalid timetable entry", issues: error.issues });
    return;
  }

  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
    res.status(404).json({ message: "Timetable entry not found" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

export default app;