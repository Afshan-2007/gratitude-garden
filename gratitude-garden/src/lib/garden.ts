export type Entry = {
  id: string;
  text: string;
  date: string;
  createdAt: number;
};

const KEY = "gratitude-garden";

export function loadEntries(): Entry[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveEntries(entries: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function stageForEntry(entry: Entry, now = Date.now()) {
  const hours = (now - entry.createdAt) / (1000 * 60 * 60);

  if (hours < 2) return "sprout";
  if (hours < 24) return "sapling";
  return "bloom";
}

export function computeStreak(entries: Entry[]) {
  if (!entries.length) return 0;

  const dates = new Set(entries.map(e => e.date));
  let streak = 0;
  let d = new Date();

  while (true) {
    const key = d.toISOString().split("T")[0];
    if (dates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  return streak;
}