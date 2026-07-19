import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { prisma } from "./_lib/prisma.js";
import { timetableEntrySchema } from "./_lib/timetable.schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const entries = await prisma.timetableEntry.findMany({
        orderBy: [{ day: "asc" }, { startTime: "asc" }]
      });

      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const data = timetableEntrySchema.parse(req.body);
      const entry = await prisma.timetableEntry.create({ data });

      return res.status(201).json(entry);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Invalid timetable entry", issues: error.issues });
    }

    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
