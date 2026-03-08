import { useEffect, useState } from "react";

// Manual Battery API types (not in standard TS lib)
interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export interface BatteryState {
  level: number | null;
  charging: boolean;
  /** true when the device/browser does not support the Battery Status API (e.g. iOS Safari) */
  unsupported: boolean;
}

export function useBattery(): BatteryState {
  const [battery, setBattery] = useState<BatteryState>({
    level: null,
    charging: false,
    unsupported: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;

    // Battery Status API is not available on iOS Safari / Firefox
    if (!nav.getBattery) {
      setBattery({ level: null, charging: false, unsupported: true });
      return;
    }

    let batteryManager: BatteryManager | null = null;

    const update = (bm: BatteryManager) => {
      setBattery({
        level: Math.round(bm.level * 100),
        charging: bm.charging,
        unsupported: false,
      });
    };

    nav
      .getBattery()
      .then((bm) => {
        batteryManager = bm;
        update(bm);

        bm.onlevelchange = () => update(bm);
        bm.onchargingchange = () => update(bm);
      })
      .catch(() => {
        // Battery API not available — keep null
        setBattery({ level: null, charging: false, unsupported: true });
      });

    return () => {
      if (batteryManager) {
        batteryManager.onlevelchange = null;
        batteryManager.onchargingchange = null;
      }
    };
  }, []);

  return battery;
}
