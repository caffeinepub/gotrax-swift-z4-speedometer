import { X } from "lucide-react";
import type { SpeedSkin, SpeedTheme, SpeedUnit } from "../hooks/useSettings";

interface SettingsPanelProps {
  open: boolean;
  theme: SpeedTheme;
  skin: SpeedSkin;
  unit: SpeedUnit;
  onThemeChange: (t: SpeedTheme) => void;
  onSkinChange: (s: SpeedSkin) => void;
  onUnitChange: (u: SpeedUnit) => void;
  onClose: () => void;
}

const COLOR_THEMES: Array<{ id: SpeedTheme; color: string; label: string }> = [
  { id: "green", color: "#00ff88", label: "Green" },
  { id: "red", color: "#ff3366", label: "Red" },
  { id: "blue", color: "#00aaff", label: "Blue" },
  { id: "orange", color: "#ff8800", label: "Orange" },
  { id: "purple", color: "#aa44ff", label: "Purple" },
  { id: "white", color: "#ffffff", label: "White" },
];

const SKIN_OPTIONS: Array<{ id: SpeedSkin; label: string; desc: string }> = [
  { id: "neon", label: "Neon Glow", desc: "Glowing neon arc" },
  { id: "minimal", label: "Minimal", desc: "Clean & simple" },
  { id: "classic", label: "Classic", desc: "Retro styled" },
  { id: "digital", label: "Digital", desc: "Segmented look" },
];

export function SettingsPanel({
  open,
  theme,
  skin,
  unit,
  onThemeChange,
  onSkinChange,
  onUnitChange,
  onClose,
}: SettingsPanelProps) {
  const activeColor =
    COLOR_THEMES.find((t) => t.id === theme)?.color ?? "#00ff88";

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          role="button"
          tabIndex={0}
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
          }}
          aria-label="Close settings"
        />
      )}

      {/* Panel */}
      <aside
        data-ocid="settings.panel"
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: "320px",
          background: "rgba(8,8,12,0.97)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: open
            ? `-20px 0 60px rgba(0,0,0,0.5), -1px 0 0 rgba(${
                activeColor === "#ffffff"
                  ? "255,255,255"
                  : activeColor
                      .slice(1)
                      .match(/../g)!
                      .map((h) => Number.parseInt(h, 16))
                      .join(",")
              },0.1)`
            : "none",
        }}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-4 rounded-full"
              style={{
                background: activeColor,
                boxShadow: `0 0 8px ${activeColor}`,
              }}
            />
            <h2
              className="font-display font-bold text-sm tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Settings
            </h2>
          </div>
          <button
            type="button"
            data-ocid="settings.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.5)";
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* ── Color Theme ── */}
          <section>
            <p
              className="block text-xs font-mono tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Color Theme
            </p>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_THEMES.map((ct, i) => {
                const isActive = ct.id === theme;
                return (
                  <button
                    type="button"
                    key={ct.id}
                    data-ocid={`settings.theme.item.${i + 1}`}
                    onClick={() => onThemeChange(ct.id)}
                    title={ct.label}
                    className="relative w-full aspect-square rounded-full transition-all duration-200"
                    style={{
                      background: ct.color,
                      border: isActive
                        ? "2px solid white"
                        : "2px solid transparent",
                      boxShadow: isActive
                        ? `0 0 0 2px ${ct.color}, 0 0 16px ${ct.color}`
                        : "0 0 8px rgba(0,0,0,0.5)",
                      cursor: "pointer",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${ct.color})`
                        : "none",
                    }}
                    aria-label={ct.label}
                    aria-pressed={isActive}
                  />
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div
            style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
          />

          {/* ── Speedometer Skin ── */}
          <section>
            <p
              className="block text-xs font-mono tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Display Style
            </p>
            <div className="space-y-2">
              {SKIN_OPTIONS.map((so, i) => {
                const isActive = so.id === skin;
                return (
                  <button
                    type="button"
                    key={so.id}
                    data-ocid={`settings.skin.item.${i + 1}`}
                    onClick={() => onSkinChange(so.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? activeColor : "rgba(255,255,255,0.07)"}`,
                      boxShadow: isActive
                        ? "0 0 12px rgba(0,0,0,0.4), inset 0 0 8px rgba(255,255,255,0.02)"
                        : "none",
                      cursor: "pointer",
                    }}
                  >
                    <div className="text-left">
                      <div
                        className="text-sm font-mono font-semibold"
                        style={{
                          color: isActive
                            ? activeColor
                            : "rgba(255,255,255,0.6)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {so.label}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: "rgba(255,255,255,0.25)",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {so.desc}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: activeColor,
                          boxShadow: `0 0 8px ${activeColor}`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div
            style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
          />

          {/* ── Speed Unit Toggle ── */}
          <section>
            <p
              className="block text-xs font-mono tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Speed Unit
            </p>
            <div
              data-ocid="settings.unit.toggle"
              className="flex rounded-lg overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {(["mph", "kmh"] as SpeedUnit[]).map((u) => {
                const isActive = unit === u;
                return (
                  <button
                    type="button"
                    key={u}
                    onClick={() => onUnitChange(u)}
                    className="flex-1 py-3 text-sm font-mono font-bold tracking-[0.15em] uppercase transition-all duration-200"
                    style={{
                      background: isActive ? activeColor : "transparent",
                      color: isActive ? "#000" : "rgba(255,255,255,0.4)",
                      boxShadow: isActive ? `0 0 16px ${activeColor}` : "none",
                      cursor: "pointer",
                      border: "none",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {u.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}
          >
            Settings saved automatically
          </p>
        </div>
      </aside>
    </>
  );
}
