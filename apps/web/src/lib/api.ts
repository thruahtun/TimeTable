import type { TimetableEntry, TimetableEntryInput } from "../types/timetable";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function getTimetable() {
  const response = await fetch(`${API_URL}/api/timetable`);

  if (!response.ok) {
    throw new Error("Could not load timetable");
  }

  return response.json() as Promise<TimetableEntry[]>;
}

export async function createTimetableEntry(entry: TimetableEntryInput) {
  const response = await fetch(`${API_URL}/api/timetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry)
  });

  if (!response.ok) {
    throw new Error("Could not create timetable entry");
  }

  return response.json() as Promise<TimetableEntry>;
}

export async function deleteTimetableEntry(id: string) {
  const response = await fetch(`${API_URL}/api/timetable/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Could not delete timetable entry");
  }
}
