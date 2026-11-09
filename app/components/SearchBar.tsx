
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  engine: string;
  onEngineChange: (engine: string) => void;
}

const engines: Record<string, string> = {
  Google: "https://www.google.com/search?q=",
  Bing: "https://www.bing.com/search?q=",
  DuckDuckGo: "https://duckduckgo.com/?q=",
};

export default function SearchBar({
  engine,
  onEngineChange,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query.trim()) return;

    const url = engines[engine] || engines.Google;

    window.location.href = url + encodeURIComponent(query.trim());
  }

  return (
    <form className="search-box" onSubmit={handleSearch}>
      <Search size={20} />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search with ${engine}...`}
      />

      <select
        value={engine}
        onChange={(e) => onEngineChange(e.target.value)}
      >
        {Object.keys(engines).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </form>
  );
}
