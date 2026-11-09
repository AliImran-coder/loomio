"use client";

import { StickyNote } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Notes() {
  const [notes, setNotes, loaded] = useLocalStorage<string>("loomio-notes", "");

  if (!loaded) return null;

  return (
    <section className="widget notes-widget">
      <div className="widget-heading">
        <div className="widget-title">
          <StickyNote size={19} />
          <h2>Quick Notes</h2>
        </div>
        <span>Auto saved</span>
      </div>

      <textarea
        className="notes-input"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Write your thoughts, ideas or reminders..."
        aria-label="Quick notes"
      />
    </section>
  );
}
