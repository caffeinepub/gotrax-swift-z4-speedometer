import { RotateCcw } from "lucide-react";

export function PortraitBlock() {
  return (
    <div
      data-ocid="portrait.panel"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#050505" }}
    >
      {/* Animated rotate icon */}
      <div className="mb-6 relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,255,136,0.06)",
            border: "2px solid rgba(0,255,136,0.3)",
            boxShadow:
              "0 0 30px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.05)",
          }}
        >
          <RotateCcw
            className="w-12 h-12"
            style={{
              color: "#00ff88",
              filter: "drop-shadow(0 0 8px #00ff88)",
              animation: "spin 3s linear infinite",
            }}
          />
        </div>
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(0,255,136,0.1)",
            transform: "scale(1.3)",
          }}
        />
      </div>

      <h2
        className="text-2xl font-display font-bold tracking-widest uppercase mb-3"
        style={{
          color: "#00ff88",
          filter: "drop-shadow(0 0 10px rgba(0,255,136,0.6))",
          letterSpacing: "0.25em",
        }}
      >
        Rotate Your Device
      </h2>

      <p
        className="text-sm tracking-wider"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}
      >
        This app is optimized for landscape mode
      </p>

      {/* Decorative lines */}
      <div className="mt-8 flex items-center gap-4">
        <div
          className="h-px w-16"
          style={{ background: "rgba(0,255,136,0.2)" }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#00ff88",
            boxShadow: "0 0 8px #00ff88",
          }}
        />
        <div
          className="h-px w-16"
          style={{ background: "rgba(0,255,136,0.2)" }}
        />
      </div>
    </div>
  );
}
