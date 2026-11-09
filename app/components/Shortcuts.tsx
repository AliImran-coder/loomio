"use client";

import { useState } from "react";
import { ExternalLink, Plus, Trash2, Pencil, X, Link2 } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Shortcut {
  id: string;
  name: string;
  url: string;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function Shortcuts() {
  const [shortcuts, setShortcuts, loaded] = useLocalStorage<Shortcut[]>(
    "loomio-shortcuts",
    []
  );
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setUrl("");
    setEditingId(null);
    setError("");
  }

  function saveShortcut(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanUrl = normalizeUrl(url);

    if (!cleanName || !cleanUrl) {
      setError("Enter both a website name and URL.");
      return;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setError("Please enter a valid website URL.");
        return;
      }
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    if (editingId) {
      setShortcuts((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, name: cleanName, url: cleanUrl }
            : item
        )
      );
    } else {
      setShortcuts((previous) => [
        ...previous,
        { id: crypto.randomUUID(), name: cleanName, url: cleanUrl },
      ]);
    }

    resetForm();
  }

  function editShortcut(item: Shortcut) {
    setEditingId(item.id);
    setName(item.name);
    setUrl(item.url);
    setError("");
  }

  function deleteShortcut(id: string) {
    setShortcuts((previous) => previous.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  }

  if (!loaded) return null;

  return (
    <section className="widget shortcuts-widget">
      <div className="widget-heading">
        <div className="widget-title">
          <Link2 size={19} />
          <h2>Quick Links</h2>
        </div>
        <span>{shortcuts.length} saved</span>
      </div>

      <form className="shortcut-form" onSubmit={saveShortcut}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Website name"
          aria-label="Website name"
          maxLength={40}
        />
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="example.com"
          aria-label="Website URL"
          type="text"
        />
        <button type="submit" aria-label={editingId ? "Save changes" : "Add link"}>
          {editingId ? <Pencil size={17} /> : <Plus size={19} />}
        </button>
        {editingId && (
          <button type="button" className="cancel-edit" onClick={resetForm} aria-label="Cancel editing">
            <X size={17} />
          </button>
        )}
      </form>

      {error && <p className="form-error">{error}</p>}

      <div className="shortcut-list">
        {shortcuts.map((item) => (
          <div className="shortcut-item" key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <span className="shortcut-letter">
                {item.name.charAt(0).toUpperCase()}
              </span>
              <span>{item.name}</span>
              <ExternalLink size={13} className="shortcut-external" />
            </a>
            <div className="shortcut-actions">
              <button type="button" onClick={() => editShortcut(item)} aria-label={`Edit ${item.name}`}>
                <Pencil size={15} />
              </button>
              <button type="button" onClick={() => deleteShortcut(item.id)} aria-label={`Delete ${item.name}`}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {shortcuts.length === 0 && (
          <p className="empty-message">Add your favorite websites here.</p>
        )}
      </div>
    </section>
  );
}
