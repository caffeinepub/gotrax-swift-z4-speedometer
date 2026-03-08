import { useEffect, useState } from "react";

interface ClockState {
  dateStr: string;
  timeStr: string;
}

function formatClock(): ClockState {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { dateStr, timeStr };
}

export function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>(formatClock);

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(formatClock());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return clock;
}
