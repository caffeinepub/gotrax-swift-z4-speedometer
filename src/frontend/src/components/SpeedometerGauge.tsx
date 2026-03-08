import { useEffect, useMemo, useRef, useState } from "react";
import type { SpeedSkin, SpeedTheme } from "../hooks/useSettings";

interface SpeedometerGaugeProps {
  speed: number; // display speed (in current unit)
  speedMps: number | null; // raw m/s for secondary unit display
  unit: "mph" | "kmh";
  theme: SpeedTheme;
  skin: SpeedSkin;
  maxSpeed?: number;
}

/** Smoothly animate a numeric value using requestAnimationFrame */
function useAnimatedValue(target: number, durationMs = 300): number {
  const [current, setCurrent] = useState(target);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);
  const toRef = useRef(target);
  const currentRef = useRef(target);
  const durationRef = useRef(durationMs);

  // Keep refs up to date without triggering the effect
  currentRef.current = current;
  durationRef.current = durationMs;

  useEffect(() => {
    if (Math.abs(target - toRef.current) < 0.01) return;
    fromRef.current = currentRef.current;
    toRef.current = target;
    startRef.current = null;

    if (animRef.current !== null) cancelAnimationFrame(animRef.current);

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / durationRef.current, 1);
      // Ease out cubic
      const eased = 1 - (1 - t) ** 3;
      const val = fromRef.current + (toRef.current - fromRef.current) * eased;
      setCurrent(val);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [target]);

  return current;
}

// Polar-to-cartesian for arc path
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// Build SVG arc path from startAngle to endAngle
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

// Theme color map
const THEME_COLORS: Record<SpeedTheme, string> = {
  green: "#00ff88",
  red: "#ff3366",
  blue: "#00aaff",
  orange: "#ff8800",
  purple: "#aa44ff",
  white: "#ffffff",
};

// Secondary dim colors for gauge track
const TRACK_COLORS: Record<SpeedTheme, string> = {
  green: "rgba(0,255,136,0.08)",
  red: "rgba(255,51,102,0.08)",
  blue: "rgba(0,170,255,0.08)",
  orange: "rgba(255,136,0,0.08)",
  purple: "rgba(170,68,255,0.08)",
  white: "rgba(255,255,255,0.07)",
};

export function SpeedometerGauge({
  speed,
  speedMps,
  unit,
  theme,
  skin,
  maxSpeed,
}: SpeedometerGaugeProps) {
  const max = maxSpeed ?? (unit === "mph" ? 60 : 100);
  const primaryColor = THEME_COLORS[theme];
  const trackColor = TRACK_COLORS[theme];

  // Smooth animated display speed
  const animatedSpeed = useAnimatedValue(Math.max(speed, 0), 250);
  const clampedSpeed = Math.min(animatedSpeed, max);

  // Secondary unit values (always show both)
  const secondaryVal =
    speedMps !== null
      ? unit === "mph"
        ? Math.round(speedMps * 3.6) // show kmh as secondary
        : Math.round(speedMps * 2.237) // show mph as secondary
      : null;
  const secondaryUnit = unit === "mph" ? "km/h" : "mph";

  // SVG dimensions
  const W = 400;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2 + 20;
  const outerR = 148;
  const innerR = 118;
  const tickOuterR = 143;
  const tickInnerR = 128;
  const labelR = 108;

  // Arc: 225deg sweep centered at bottom
  // Start: -225/2 + 90 = -22.5 => offset from top
  // 240 degree sweep: start = 150, end = 390 (= 30)
  const START_ANGLE = 150; // degrees from top-center (clockwise)
  const END_ANGLE = 390; // 150 + 240
  const SWEEP = 240;

  const progressAngle = START_ANGLE + (clampedSpeed / max) * SWEEP;

  const isNeon = skin === "neon";
  const isMinimal = skin === "minimal";
  const isClassic = skin === "classic";
  const isDigital = skin === "digital";

  // Tick marks
  const ticks = useMemo(() => {
    const result: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      major: boolean;
      angle: number;
      id: string;
    }> = [];
    const numTicks = 48; // Total tick divisions
    for (let i = 0; i <= numTicks; i++) {
      const angle = START_ANGLE + (i / numTicks) * SWEEP;
      const isMajor = i % 8 === 0;
      const outerTR = isMajor ? tickOuterR : tickOuterR - 4;
      const innerTR = isMajor ? tickInnerR - 4 : tickInnerR + 2;
      const p1 = polarToCartesian(cx, cy, outerTR, angle);
      const p2 = polarToCartesian(cx, cy, innerTR, angle);
      result.push({
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        major: isMajor,
        angle,
        id: `tick-${i}`,
      });
    }
    return result;
  }, [cx, cy]);

  // Speed labels on arc
  const speedLabels = useMemo(() => {
    const labelCount = 7; // 0, 10, 20, 30, 40, 50, 60 (or 0..100)
    return Array.from({ length: labelCount }, (_, i) => {
      const val = Math.round((i / (labelCount - 1)) * max);
      const angle = START_ANGLE + (i / (labelCount - 1)) * SWEEP;
      const pos = polarToCartesian(cx, cy, labelR, angle);
      return { val, x: pos.x, y: pos.y, angle, id: `label-${i}` };
    });
  }, [cx, cy, max]);

  // Glow filter strength based on skin
  const glowBlur = isNeon ? 8 : isClassic ? 3 : 0;
  const arcStrokeWidth = isMinimal ? 6 : isDigital ? 10 : 14;
  const trackStrokeWidth = isMinimal ? 6 : isDigital ? 10 : 14;

  const fontFamily = isDigital
    ? "'Geist Mono', monospace"
    : "'Mona Sans', sans-serif";
  const numberFontFamily = isDigital
    ? "'Geist Mono', monospace"
    : "'Bricolage Grotesque', sans-serif";

  const filterDef =
    isNeon || isClassic ? (
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={glowBlur} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowBlur * 1.5} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
      </defs>
    ) : (
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.05" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
      </defs>
    );

  const applyGlow = isNeon || isClassic;
  const applyStrongGlow = isNeon;
  const glowFilter = applyGlow ? "url(#glow)" : undefined;
  const strongGlowFilter = applyStrongGlow ? "url(#strong-glow)" : undefined;

  // Progress arc end cap dot
  const progressEnd = polarToCartesian(
    cx,
    cy,
    (outerR + innerR) / 2,
    progressAngle,
  );

  return (
    <svg
      data-ocid="speedometer.canvas_target"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
      aria-label={`Speed: ${Math.round(speed)} ${unit}`}
    >
      <title>
        Speedometer: {Math.round(speed)} {unit.toUpperCase()}
      </title>
      {filterDef}

      {/* Background center glow */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={outerR * 0.9}
        ry={outerR * 0.75}
        fill="url(#centerGlow)"
      />

      {/* Outer decorative ring (classic/neon only) */}
      {(isNeon || isClassic) && (
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 10}
          fill="none"
          stroke={primaryColor}
          strokeWidth="0.5"
          strokeOpacity="0.2"
          filter={glowFilter}
        />
      )}

      {/* Track arc (background) */}
      <path
        d={arcPath(cx, cy, (outerR + innerR) / 2, START_ANGLE, END_ANGLE)}
        fill="none"
        stroke={trackColor}
        strokeWidth={trackStrokeWidth + (isNeon ? 4 : 0)}
        strokeLinecap="round"
      />

      {/* Track inner shadow for depth */}
      <path
        d={arcPath(cx, cy, (outerR + innerR) / 2, START_ANGLE, END_ANGLE)}
        fill="none"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={trackStrokeWidth - 4}
        strokeLinecap="round"
      />

      {/* Tick marks */}
      {ticks.map((tick) => (
        <line
          key={tick.id}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={primaryColor}
          strokeWidth={tick.major ? (isNeon ? 2.5 : 2) : isNeon ? 1.5 : 1}
          strokeOpacity={tick.major ? 0.5 : 0.2}
          filter={tick.major && isNeon ? glowFilter : undefined}
        />
      ))}

      {/* Speed labels */}
      {speedLabels.map((label) => (
        <text
          key={label.id}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={isMinimal ? 8 : 9}
          fontFamily={fontFamily}
          fontWeight={isDigital ? "400" : "500"}
          fill={primaryColor}
          fillOpacity={0.45}
        >
          {label.val}
        </text>
      ))}

      {/* Progress arc (filled) */}
      {clampedSpeed > 0 && (
        <>
          <path
            d={arcPath(
              cx,
              cy,
              (outerR + innerR) / 2,
              START_ANGLE,
              progressAngle,
            )}
            fill="none"
            stroke={primaryColor}
            strokeWidth={arcStrokeWidth}
            strokeLinecap="round"
            filter={strongGlowFilter}
            strokeOpacity={isMinimal ? 0.85 : 1}
          />

          {/* Progress end cap glow dot */}
          {isNeon && (
            <circle
              cx={progressEnd.x}
              cy={progressEnd.y}
              r={arcStrokeWidth / 2 + 2}
              fill={primaryColor}
              filter="url(#strong-glow)"
              opacity={0.9}
            />
          )}
        </>
      )}

      {/* Zero-speed dim arc (when speed is 0, show thin start indicator) */}
      {clampedSpeed === 0 && (
        <path
          d={arcPath(
            cx,
            cy,
            (outerR + innerR) / 2,
            START_ANGLE,
            START_ANGLE + 2,
          )}
          fill="none"
          stroke={primaryColor}
          strokeWidth={arcStrokeWidth}
          strokeLinecap="round"
          strokeOpacity={0.3}
        />
      )}

      {/* Inner circle (glass effect) */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR - 8}
        fill="rgba(5,5,5,0.85)"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.15"
      />

      {/* Speed number */}
      <text
        x={cx}
        y={cy - 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isDigital ? 72 : 80}
        fontFamily={numberFontFamily}
        fontWeight={isDigital ? "700" : "800"}
        letterSpacing={isDigital ? "-2" : "-4"}
        fill={primaryColor}
        filter={applyStrongGlow ? strongGlowFilter : undefined}
        style={{
          userSelect: "none",
          paintOrder: "stroke fill",
        }}
      >
        {Math.round(speed)}
      </text>

      {/* Primary unit label */}
      <text
        x={cx}
        y={cy + 36}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
        fontFamily={fontFamily}
        fontWeight="600"
        letterSpacing="4"
        fill={primaryColor}
        fillOpacity={0.6}
        filter={glowFilter}
      >
        {unit.toUpperCase()}
      </text>

      {/* Secondary unit (other speed) */}
      {secondaryVal !== null && (
        <text
          x={cx}
          y={cy + 58}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontFamily={fontFamily}
          fontWeight="500"
          fill={primaryColor}
          fillOpacity={0.35}
        >
          {secondaryVal} {secondaryUnit.toUpperCase()}
        </text>
      )}

      {/* Skin name subtle label */}
      {isDigital && (
        <text
          x={cx}
          y={cy + 74}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
          fontFamily={fontFamily}
          fontWeight="400"
          letterSpacing="3"
          fill={primaryColor}
          fillOpacity={0.25}
        >
          DIGITAL
        </text>
      )}

      {/* Decorative bottom arc (classic) */}
      {isClassic && (
        <path
          d={arcPath(cx, cy, outerR + 18, START_ANGLE + 10, END_ANGLE - 10)}
          fill="none"
          stroke={primaryColor}
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="3 6"
        />
      )}

      {/* Digital segmented overlay */}
      {isDigital && (
        <path
          d={arcPath(cx, cy, (outerR + innerR) / 2, START_ANGLE, END_ANGLE)}
          fill="none"
          stroke={primaryColor}
          strokeWidth={arcStrokeWidth + 2}
          strokeLinecap="butt"
          strokeOpacity="0.06"
          strokeDasharray="4 2"
        />
      )}
    </svg>
  );
}
