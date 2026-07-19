import { DayOfWeek } from "@prisma/client";
import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm time format");

export const timetableEntrySchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(80),
    day: z.nativeEnum(DayOfWeek),
    startTime: timeSchema,
    endTime: timeSchema,
    location: z.string().trim().max(80).optional().nullable(),
    note: z.string().trim().max(240).optional().nullable(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#f472b6")
  })
  .refine((value) => value.startTime < value.endTime, {
    message: "End time must be later than start time",
    path: ["endTime"]
  });

export type TimetableEntryInput = z.infer<typeof timetableEntrySchema>;
