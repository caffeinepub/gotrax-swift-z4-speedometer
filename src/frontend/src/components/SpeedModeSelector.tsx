type SpeedMode = "ECO" | "SPORT" | "STREET";

interface SpeedModeSelectorProps {
  mode: SpeedMode;
  onChange: (mode: SpeedMode) => void;
}

const MODES: Array<{
  id: SpeedMode;
  color: string;
  glow: string;
  dimColor: string;
  ocid: string;
}> = [
  {
    id: "ECO",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.3)",
    dimColor: "rgba(0,255,136,0.07)",
    ocid: "mode.eco.button",
  },
  {
    id: "SPORT",
    color: "#ff3366",
    glow: "rgba(255,51,102,0.3)",
    dimColor: "rgba(255,51,102,0.07)",
    ocid: "mode.sport.button",
  },
  {
    id: "STREET",
    color: "#00aaff",
    glow: "rgba(0,170,255,0.3)",
    dimColor: "rgba(0,170,255,0.07)",
    ocid: "mode.street.button",
  },
];

export function SpeedModeSelector({ mode, onChange }: SpeedModeSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      {MODES.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            type="button"
            key={m.id}
            data-ocid={m.ocid}
            onClick={() => onChange(m.id)}
            className="relative px-6 py-2 rounded-full font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-200 select-none"
            style={{
              background: isActive ? m.dimColor : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? m.color : "rgba(255,255,255,0.1)"}`,
              color: isActive ? m.color : "rgba(255,255,255,0.35)",
              boxShadow: isActive
                ? `0 0 16px ${m.glow}, 0 0 32px ${m.glow}, inset 0 0 12px rgba(255,255,255,0.03)`
                : "none",
              filter: isActive ? `drop-shadow(0 0 6px ${m.color})` : "none",
              minWidth: "88px",
              cursor: "pointer",
              letterSpacing: "0.2em",
            }}
          >
            {/* Active pip indicator */}
            {isActive && (
              <span
                className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full"
                style={{
                  background: m.color,
                  boxShadow: `0 0 6px ${m.color}`,
                }}
              />
            )}
            {m.id}
          </button>
        );
      })}
    </div>
  );
}

export type { SpeedMode };
