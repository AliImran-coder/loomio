"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, Check } from "lucide-react";

interface WallpaperProps {
  wallpaper: string;
  setWallpaper: (value: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
}

const wallpapers = [
  { name: "Mountains", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600" },
  { name: "Ocean", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600" },
  { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600" },
  { name: "Night Sky", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600" },
];

export default function Wallpaper({
  wallpaper,
  setWallpaper,
  brightness,
  setBrightness,
}: WallpaperProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function uploadWallpaper(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setWallpaper(reader.result);
        setError("");
      }
    };
    reader.onerror = () => setError("Could not read this image.");
    reader.readAsDataURL(file);
  }

  return (
    <section className="widget wallpaper-widget">
      <div className="widget-heading">
        <div className="widget-title">
          <ImageIcon size={19} />
          <h2>Wallpapers</h2>
        </div>
        <span>Personalize</span>
      </div>

      <div className="wallpaper-grid">
        {wallpapers.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`wallpaper-option ${wallpaper === item.url ? "selected" : ""}`}
            style={{ backgroundImage: `url("${item.url}")` }}
            onClick={() => {
              setWallpaper(item.url);
              setError("");
            }}
          >
            <span>{item.name}</span>
            {wallpaper === item.url && (
              <span className="wallpaper-check"><Check size={15} /></span>
            )}
          </button>
        ))}
      </div>

      {wallpaper.startsWith("data:image/") && (
        <div
          className="wallpaper-option custom-preview selected"
          style={{ backgroundImage: `url("${wallpaper}")` }}
        >
          <span>My Upload</span>
          <span className="wallpaper-check"><Check size={15} /></span>
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          uploadWallpaper(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />

      <button type="button" className="wallpaper-upload" onClick={() => fileInput.current?.click()}>
        <Upload size={17} />
        Upload your own wallpaper
      </button>

      <div className="wallpaper-brightness">
        <div className="brightness-heading">
          <label htmlFor="wallpaper-brightness">Dark overlay</label>
          <span>{brightness}%</span>
        </div>
        <input
          id="wallpaper-brightness"
          type="range"
          min="0"
          max="85"
          value={brightness}
          onChange={(event) => setBrightness(Number(event.target.value))}
        />
      </div>

      {error && <p className="wallpaper-error">{error}</p>}

      <button
        type="button"
        className="wallpaper-remove"
        onClick={() => {
          setWallpaper("");
          setError("");
        }}
      >
        <X size={15} />
        Remove wallpaper
      </button>
    </section>
  );
}
