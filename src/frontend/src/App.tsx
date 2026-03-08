import { Settings, WifiOff } from "lucide-react";
import { useState } from "react";
import { HeaderBar } from "./components/HeaderBar";
import { PortraitBlock } from "./components/PortraitBlock";
import { SettingsPanel } from "./components/SettingsPanel";
import { SpeedModeSelector } from "./components/SpeedModeSelector";
import type { SpeedMode } from "./components/SpeedModeSelector";
import { SpeedometerGauge } from "./components/SpeedometerGauge";
import { useGeolocation } from "./hooks/useGeolocation";
import { useOrientation } from "./hooks/useOrientation";
import { useSettings } from "./hooks/useSettings";

// Color lookup for gear icon glow
const THEME_GLOW: Record<string, string> = {
  green: "#00ff88",
  red: "#ff3366",
  blue: "#00aaff",
  orange: "#ff8800",
  purple: "#aa44ff",
  white: "#ffffff",
};

export default function App() {
  const { settings, updateSettings } = useSettings();
  const { speedMps, error, permissionDenied, acquiring } = useGeolocation();
  const { isPortrait } = useOrientation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<SpeedMode>("ECO");

  // Convert m/s to display unit
  const displaySpeed = (() => {
    if (speedMps === null) return 0;
    if (settings.unit === "mph") return speedMps * 2.237;
    return speedMps * 3.6;
  })();

  const accentColor = THEME_GLOW[settings.theme] ?? "#00ff88";
  const maxSpeed = settings.unit === "mph" ? 60 : 100;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Portrait block overlay */}
      {isPortrait && <PortraitBlock />}

      {/* Header */}
      <HeaderBar />

      {/* Main content area */}
      <main
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: "48px", paddingBottom: "8px" }}
      >
        {/* GPS error indicator */}
        {(error || permissionDenied) && (
          <div
            className="absolute top-14 left-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{
              transform: "translateX(-50%)",
              background: "rgba(255,51,102,0.1)",
              border: "1px solid rgba(255,51,102,0.25)",
              color: "rgba(255,100,130,0.8)",
              zIndex: 10,
            }}
          >
            <WifiOff className="w-3 h-3" />
            <span>
              {permissionDenied ? "GPS access denied" : "Waiting for GPS…"}
            </span>
          </div>
        )}

        {/* Speedometer gauge container */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(72vh, 560px)",
            height: "min(58vh, 440px)",
            flexShrink: 0,
          }}
        >
          {/* Ambient glow behind gauge */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 55%, ${accentColor}12 0%, transparent 65%)`,
              filter: "blur(20px)",
            }}
          />
          <SpeedometerGauge
            speed={displaySpeed}
            speedMps={speedMps}
            unit={settings.unit}
            theme={settings.theme}
            skin={settings.skin}
            maxSpeed={maxSpeed}
            acquiring={acquiring}
          />
        </div>

        {/* Speed mode selector */}
        <div className="flex-shrink-0 mt-2">
          <SpeedModeSelector mode={mode} onChange={setMode} />
        </div>

        {/* Footer attribution */}
        <div
          className="absolute bottom-2 left-1/2 text-xs"
          style={{
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            fontFamily: "sans-serif",
          }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </main>

      {/* Settings gear button */}
      <button
        type="button"
        data-ocid="settings.open_modal_button"
        onClick={() => setSettingsOpen(true)}
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 z-30"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "rgba(255,255,255,0.1)";
          el.style.color = accentColor;
          el.style.borderColor = accentColor;
          el.style.boxShadow = `0 0 16px ${accentColor}40`;
          el.style.transform = "scale(1.05) rotate(30deg)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "rgba(255,255,255,0.05)";
          el.style.color = "rgba(255,255,255,0.6)";
          el.style.borderColor = "rgba(255,255,255,0.12)";
          el.style.boxShadow = "none";
          el.style.transform = "scale(1) rotate(0deg)";
        }}
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        theme={settings.theme}
        skin={settings.skin}
        unit={settings.unit}
        onThemeChange={(t) => updateSettings({ theme: t })}
        onSkinChange={(s) => updateSettings({ skin: s })}
        onUnitChange={(u) => updateSettings({ unit: u })}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
