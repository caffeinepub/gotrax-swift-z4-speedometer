import { useEffect, useState } from "react";

function checkPortrait(): boolean {
  if (typeof window === "undefined") return false;
  // Prefer screen.orientation API, fallback to window dimensions
  if (window.screen?.orientation?.type) {
    const type = window.screen.orientation.type;
    return type === "portrait-primary" || type === "portrait-secondary";
  }
  return window.innerHeight > window.innerWidth;
}

export function useOrientation(): { isPortrait: boolean } {
  const [isPortrait, setIsPortrait] = useState<boolean>(checkPortrait);

  useEffect(() => {
    const update = () => setIsPortrait(checkPortrait());

    window.addEventListener("resize", update);

    const so = window.screen?.orientation;
    if (so) {
      so.addEventListener("change", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (so) {
        so.removeEventListener("change", update);
      }
    };
  }, []);

  return { isPortrait };
}
