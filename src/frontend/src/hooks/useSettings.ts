import { useCallback, useState } from "react";

export type SpeedUnit = "mph" | "kmh";
export type SpeedTheme =
  | "green"
  | "red"
  | "blue"
  | "orange"
  | "purple"
  | "white";
export type SpeedSkin = "neon" | "minimal" | "classic" | "digital";

export interface AppSettings {
  unit: SpeedUnit;
  theme: SpeedTheme;
  skin: SpeedSkin;
}

const STORAGE_KEY = "gotrax_z4_settings";

const DEFAULT_SETTINGS: AppSettings = {
  unit: "mph",
  theme: "green",
  skin: "neon",
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      unit: parsed.unit ?? DEFAULT_SETTINGS.unit,
      theme: parsed.theme ?? DEFAULT_SETTINGS.theme,
      skin: parsed.skin ?? DEFAULT_SETTINGS.skin,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail if localStorage unavailable
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
