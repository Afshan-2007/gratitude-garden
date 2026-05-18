import { useEffect, useMemo, useState } from "react";
import { Plant } from "../components/Plant";
import {
  loadEntries,
  saveEntries,
  todayStr,
  stageForEntry,
  computeStreak,
  type Entry,
} from "../lib/garden";

export default function Index() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setEntries(loadEntries());
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const today = todayStr();
  const todayEntry = entries.find((e) => e.date === today);
  const streak = useMemo(() => computeStreak(entries), [entries]);

  function plant() {
    const trimmed = text.trim();
    if (!trimmed || todayEntry) return;

    const entry: Entry = {
      id: crypto.randomUUID(),
      text: trimmed,
      date: today,
      createdAt: Date.now(),
    };

    const next = [...entries, entry];
    setEntries(next);
    saveEntries(next);
    setText("");
  }

  function deleteEntry(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  }

  const sorted = [...entries].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div style={{ padding: "30px" }}>

      {/* 🌿 HERO SECTION */}
      <div style={{ marginBottom: "40px" }}>

        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            background: "#e6e3d5",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            marginBottom: "15px",
          }}
        >
          ● GRATITUDE GARDEN
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: "48px", margin: 0 }}>
          One thankful thought,
          <br />
          <span style={{ color: "#2e7d32", fontStyle: "italic" }}>
            one growing seed.
          </span>
        </h1>

        {/* Description */}
        <p style={{ maxWidth: "500px", color: "#555", marginTop: "15px" }}>
          Each day you write what you're grateful for, a seed is planted.
          Sprouts become saplings. Saplings bloom. Your garden remembers.
        </p>

        {/* Stats */}
        <div
          style={{
            marginTop: "20px",
            background: "#f3efe5",
            padding: "20px",
            borderRadius: "20px",
            display: "inline-flex",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: 0, color: "#2e7d32" }}>
              {entries.length}
            </h2>
            <p style={{ fontSize: "12px" }}>SEEDS</p>
          </div>

          <div style={{ width: "1px", height: "40px", background: "#ccc" }} />

          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: 0, color: "#e67e22" }}>
              {streak}
            </h2>
            <p style={{ fontSize: "12px" }}>DAY STREAK</p>
          </div>
        </div>
      </div>

      {/* 🌱 TODAY SECTION */}
      <div
        style={{
          background: "#f3efe5",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        {todayEntry ? (
          <>
            <h3>Today's seed is planted 🌱</h3>
            <p style={{ fontStyle: "italic" }}>"{todayEntry.text}"</p>
          </>
        ) : (
          <>
            <h3>Today, I'm grateful for...</h3>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something..."
              style={{
                width: "100%",
                height: "80px",
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
              }}
            />

            <button
              onClick={plant}
              disabled={!text.trim()}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                borderRadius: "20px",
                background: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Plant seed 🌱
            </button>
          </>
        )}
      </div>

      {/* 🌿 GARDEN */}
      <div className="garden" style={{ marginTop: "30px", position: "relative" }}>
        <div className="cloud slow" style={{ top: 20 }}>☁️</div>
<div className="cloud medium" style={{ top: 50 }}>☁️</div>
<div className="cloud fast" style={{ top: 80 }}>☁️</div>
        <div className="sun">☀️</div>

        {sorted.map((e, i) => {
          const perRow = 18;
          const x = (i % perRow) * 30;
          const y = Math.floor(i / perRow) * 45;

          return (
            <div
              key={e.id}
              style={{
                position: "absolute",
                left: `${x}px`,
                bottom: `${20 + y}px`,
              }}
            >
              <Plant
                seed={e.id}
                stage={stageForEntry(e, now)}
                word={e.text}
              />
            </div>
          );
        })}

        <div className="soil"></div>
      </div>

      {/* 📜 RECENT */}
      <div style={{ marginTop: "40px" }}>
        <h2>Recent gratitudes</h2>

        {sorted
          .slice()
          .reverse()
          .slice(0, 5)
          .map((e) => (
            <div
              key={e.id}
              style={{
                background: "#f5f1e6",
                padding: "20px",
                borderRadius: "20px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {new Date(e.date).toDateString()}
                </p>
                <p style={{ fontStyle: "italic" }}>"{e.text}"</p>
              </div>

              <button
                onClick={() => deleteEntry(e.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}