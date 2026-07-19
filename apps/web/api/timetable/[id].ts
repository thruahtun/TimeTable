import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { prisma } from "../_lib/prisma.js";
import { timetableEntrySchema } from "../_lib/timetable.schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    if (req.method === "PUT") {
      const data = timetableEntrySchema.parse(req.body);
      const entry = await prisma.timetableEntry.update({
        where: { id },
        data
      });

      return res.status(200).json(entry);
    }

    if (req.method === "DELETE") {
      await prisma.timetableEntry.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Invalid timetable entry", issues: error.issues });
    }

    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
