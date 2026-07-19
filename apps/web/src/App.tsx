import { CalendarDays, Heart, MapPin, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { createTimetableEntry, deleteTimetableEntry, getTimetable } from "./lib/api";
import { DayOfWeek, TimetableEntry, TimetableEntryInput, days } from "./types/timetable";

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday"
};

const sampleEntries: TimetableEntry[] = [
  {
    id: "sample-1",
    title: "Morning class",
    day: "MONDAY",
    startTime: "09:00",
    endTime: "10:30",
    location: "Main campus",
    note: "Bring coffee and notes",
    color: "#f472b6"
  },
  {
    id: "sample-2",
    title: "Study date",
    day: "WEDNESDAY",
    startTime: "15:00",
    endTime: "17:00",
    location: "Library",
    note: "Quiet table near the window",
    color: "#14b8a6"
  },
  {
    id: "sample-3",
    title: "Assignment time",
    day: "FRIDAY",
    startTime: "19:00",
    endTime: "20:30",
    location: "Home",
    note: "Finish weekly review",
    color: "#f59e0b"
  }
];

const initialForm: TimetableEntryInput = {
  title: "",
  day: "MONDAY",
  startTime: "09:00",
  endTime: "10:00",
  location: "",
  note: "",
  color: "#f472b6"
};

function App() {
  const [entries, setEntries] = useState<TimetableEntry[]>(sampleEntries);
  const [form, setForm] = useState<TimetableEntryInput>(initialForm);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getTimetable()
      .then((data) => {
        setEntries(data.length > 0 ? data : sampleEntries);
        setIsApiConnected(true);
      })
      .catch(() => {
        setIsApiConnected(false);
      });
  }, []);

  const entriesByDay = useMemo(
    () =>
      days.map((day) => ({
        day,
        entries: entries
          .filter((entry) => entry.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      })),
    [entries]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entryInput = {
      ...form,
      location: form.location?.trim() || null,
      note: form.note?.trim() || null
    };

    setIsSaving(true);

    try {
      if (isApiConnected) {
        const saved = await createTimetableEntry(entryInput);
        setEntries((current) => [...current, saved]);
      } else {
        setEntries((current) => [...current, { ...entryInput, id: crypto.randomUUID() }]);
      }

      setForm(initialForm);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(entry: TimetableEntry) {
    if (isApiConnected && !entry.id.startsWith("sample-")) {
      await deleteTimetableEntry(entry.id);
    }

    setEntries((current) => current.filter((item) => item.id !== entry.id));
  }

  return (
    <main className="min-h-screen">
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4 fill-current" />
                For her weekly rhythm
              </div>
              <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">Her Timetable</h1>
            </div>
            <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {isApiConnected ? "Connected to database" : "Preview mode"}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="title">Activity</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Your Goal..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="day">Day</Label>
                <Select
                  id="day"
                  value={form.day}
                  onChange={(event) => setForm({ ...form, day: event.target.value as DayOfWeek })}
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {dayLabels[day]}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Starts</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={(event) => setForm({ ...form, startTime: event.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Ends</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={(event) => setForm({ ...form, endTime: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location ?? ""}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  placeholder="Room 204"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={form.color}
                  onChange={(event) => setForm({ ...form, color: event.target.value })}
                  className="h-11 p-1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="note">Sweet note</Label>
                <Textarea
                  id="note"
                  value={form.note ?? ""}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  placeholder="Anything she should remember"
                />
              </div>

              <Button disabled={isSaving} type="submit">
                <CalendarDays className="h-4 w-4" />
                {isSaving ? "Saving..." : "Add to timetable"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entriesByDay.map(({ day, entries: dayEntries }) => (
            <Card key={day} className="min-h-64">
              <CardHeader>
                <CardTitle>{dayLabels[day]}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {dayEntries.length === 0 ? (
                  <p className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                    Free day
                  </p>
                ) : (
                  dayEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-md border bg-background p-3 shadow-sm"
                      style={{ borderLeft: `6px solid ${entry.color}` }}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold">{entry.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                        <Button
                          aria-label={`Delete ${entry.title}`}
                          onClick={() => void handleDelete(entry)}
                          type="button"
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {entry.location ? (
                        <p className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {entry.location}
                        </p>
                      ) : null}
                      {entry.note ? <p className="text-sm leading-6">{entry.note}</p> : null}
                    </article>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
