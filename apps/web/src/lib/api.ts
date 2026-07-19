import type { TimetableEntry, TimetableEntryInput } from "../types/timetable";

function resolveApiUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://localhost:4000";
  }

  return "";
}

const API_URL = resolveApiUrl();

export function getApiConfigurationError() {
  if (import.meta.env.DEV) {
    return null;
  }

  if (!API_URL) {
    return "VITE_API_URL is not set. Add your public API URL in Vercel project settings, then redeploy.";
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(API_URL)) {
    return "VITE_API_URL points to localhost. Browsers block that from a deployed site. Use your public API URL instead.";
  }

  return null;
}

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
