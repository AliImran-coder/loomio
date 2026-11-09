
"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Sparkles } from "lucide-react";

import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Shortcuts from "./components/Shortcuts";
import Settings, { type UserSettings } from "./components/Settings";
import Pomodoro from "./components/Pomodoro";
import Wallpaper from "./components/Wallpaper";

import { useLocalStorage } from "./hooks/useLocalStorage";

const defaultSettings: UserSettings = {
  name: "",
  theme: "dark",
  background: "#151827",
  engine: "Google",
  clockFormat: "12",
  showSeconds: false,
};

export default function Home() {
  const [settings, setSettings, settingsLoaded] =
    useLocalStorage<UserSettings>("loomio-settings", defaultSettings);

  const [wallpaper, setWallpaper, wallpaperLoaded] =
    useLocalStorage<string>("novatab-wallpaper", "");

  const [brightness, setBrightness, brightnessLoaded] =
    useLocalStorage<number>("novatab-wallpaper-brightness", 45);

  const [showSettings, setShowSettings] = useState(false);

  const isLoaded =
    settingsLoaded && wallpaperLoaded && brightnessLoaded;

  if (!isLoaded) {
    return <main className="loading-screen">Loading Loomio...</main>;
  }

  return (
    <main
      className={`dashboard ${settings.theme}`}
      style={
        {
          "--dashboard-bg": settings.background,
          "--wallpaper-overlay": brightness / 100,
          "--wallpaper-image": wallpaper
            ? `url("${wallpaper}")`
            : "none",
        } as React.CSSProperties
      }
    >
      <header className="topbar">
        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={21} />
          </div>
          <span>Loomio</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          <SettingsIcon size={21} />
        </button>
      </header>

      <section className="hero">
        <p className="greeting">YOUR PERSONAL SPACE</p>

        <h1>
          {settings.name.trim()
            ? `Good to see you, ${settings.name}!`
            : "Welcome to Loomio."}
        </h1>

        <Clock
          showSeconds={settings.showSeconds}
          format={settings.clockFormat}
        />

        <SearchBar
          engine={settings.engine}
          onEngineChange={(engine) =>
            setSettings((previous) => ({
              ...previous,
              engine,
            }))
          }
        />
      </section>

      <section className="widgets">
        <Tasks />
        <Notes />
        <Shortcuts />
        <Pomodoro />

        <Wallpaper
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          brightness={brightness}
          setBrightness={setBrightness}
        />
      </section>

      <footer>
        Your space. Your way. <Sparkles size={13} />
      </footer>

      {showSettings && (
        <Settings
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
