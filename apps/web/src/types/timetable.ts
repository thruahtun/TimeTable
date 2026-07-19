export const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY"
] as const;

export type DayOfWeek = (typeof days)[number];

export type TimetableEntry = {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  location?: string | null;
  note?: string | null;
  color: string;
};

export type TimetableEntryInput = Omit<TimetableEntry, "id">;
