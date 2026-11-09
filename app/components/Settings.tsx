"use client";

import { X, Settings as SettingsIcon } from "lucide-react";

export interface UserSettings {
  name: string;
  theme: "dark" | "light";
  background: string;
  engine: string;
  clockFormat: "12" | "24";
  showSeconds: boolean;
}

interface SettingsProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onClose: () => void;
}

const backgrounds = [
  "#151827",
  "#20243a",
  "#243044",
  "#302342",
  "#18352f",
  "#3b2930",
];

export default function Settings({
  settings,
  setSettings,
  onClose,
}: SettingsProps) {
  function update<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  return (
    <div className="settings-overlay" onMouseDown={onClose}>
      <div
        className="settings-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="settings-heading">
          <div className="widget-title">
            <SettingsIcon size={21} />
            <h2>Dashboard Settings</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={21} />
          </button>
        </div>

        <div className="setting-group">
          <label htmlFor="user-name">Your name</label>

          <input
            id="user-name"
            value={settings.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Enter your name"
            maxLength={40}
          />
        </div>

        <div className="setting-group">
          <label htmlFor="theme-select">Appearance</label>

          <select
            id="theme-select"
            value={settings.theme}
            onChange={(event) =>
              update(
                "theme",
                event.target.value as UserSettings["theme"],
              )
            }
          >
            <option value="dark">Dark mode</option>
            <option value="light">Light mode</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Background color</label>

          <div className="color-options">
            {backgrounds.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${
                  settings.background === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => update("background", color)}
                aria-label={`Select ${color} background`}
              />
            ))}
          </div>

          <label
            className="custom-color-label"
            htmlFor="custom-background"
          >
            Custom color

            <input
              id="custom-background"
              type="color"
              value={settings.background}
              onChange={(event) =>
                update("background", event.target.value)
              }
            />
          </label>
        </div>

        <div className="setting-group">
          <label htmlFor="search-engine">Search engine</label>

          <select
            id="search-engine"
            value={settings.engine}
            onChange={(event) => update("engine", event.target.value)}
          >
            <option value="Google">Google</option>
            <option value="Bing">Bing</option>
            <option value="DuckDuckGo">DuckDuckGo</option>
          </select>
        </div>

        <div className="setting-group">
          <label htmlFor="clock-format">Clock format</label>

          <select
            id="clock-format"
            value={settings.clockFormat}
            onChange={(event) =>
              update(
                "clockFormat",
                event.target.value as UserSettings["clockFormat"],
              )
            }
          >
            <option value="12">12-hour</option>
            <option value="24">24-hour</option>
          </select>
        </div>

        <label
          className="setting-group setting-toggle"
          htmlFor="show-seconds"
        >
          <span>Show clock seconds</span>

          <input
            id="show-seconds"
            type="checkbox"
            checked={settings.showSeconds}
            onChange={(event) =>
              update("showSeconds", event.target.checked)
            }
          />
        </label>
      </div>
    </div>
  );
}
