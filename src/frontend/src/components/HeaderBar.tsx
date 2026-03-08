import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
} from "lucide-react";
import { useBattery } from "../hooks/useBattery";
import { useClock } from "../hooks/useClock";

interface BatteryIconProps {
  level: number | null;
  charging: boolean;
}

function BatteryIcon({ level, charging }: BatteryIconProps) {
  if (charging) return <BatteryCharging className="w-4 h-4" />;
  if (level === null) return <Battery className="w-4 h-4 opacity-40" />;
  if (level >= 90) return <BatteryFull className="w-4 h-4" />;
  if (level >= 60) return <BatteryMedium className="w-4 h-4" />;
  if (level >= 30) return <BatteryLow className="w-4 h-4" />;
  return <BatteryWarning className="w-4 h-4" style={{ color: "#ff3366" }} />;
}

function batteryColor(level: number | null, charging: boolean): string {
  if (charging) return "#00ff88";
  if (level === null) return "rgba(255,255,255,0.3)";
  if (level >= 60) return "#00ff88";
  if (level >= 30) return "#ff8800";
  return "#ff3366";
}

export function HeaderBar() {
  const { dateStr, timeStr } = useClock();
  const { level, charging, unsupported } = useBattery();

  const color = batteryColor(level, charging);

  return (
    <header
      data-ocid="header.section"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "48px",
        background: "rgba(5, 5, 5, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Brand name */}
      <div className="flex items-center gap-3">
        {/* Accent dot */}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: "#00ff88",
            boxShadow: "0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4)",
          }}
        />
        <span
          className="font-display font-bold tracking-[0.18em] uppercase text-sm select-none"
          style={{
            color: "#ffffff",
            letterSpacing: "0.22em",
            textShadow: "0 0 20px rgba(255,255,255,0.15)",
          }}
        >
          Gotrax Swift Z4
        </span>
      </div>

      {/* Right: Battery + Clock */}
      <div className="flex items-center gap-4">
        {/* Battery */}
        <div className="flex items-center gap-1.5" style={{ color }}>
          <div style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <BatteryIcon level={level} charging={charging} />
          </div>
          <span
            className="font-mono text-xs tabular-nums"
            style={{
              color,
              filter: level !== null ? `drop-shadow(0 0 4px ${color})` : "none",
              minWidth: "32px",
              textAlign: "right",
            }}
          >
            {unsupported ? "N/A" : level !== null ? `${level}%` : "--"}
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-4 w-px"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />

        {/* Date + Time */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {dateStr}
          </span>
          <span
            className="font-mono text-xs font-semibold tabular-nums"
            style={{
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.05em",
            }}
          >
            {timeStr}
          </span>
        </div>
      </div>
    </header>
  );
}
