import { useEffect, useRef, useState } from "react";

export interface GeolocationState {
  speedMps: number | null;
  error: string | null;
  permissionDenied: boolean;
  /** True while waiting for the first GPS fix (no position or error yet) */
  acquiring: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    speedMps: null,
    error: null,
    permissionDenied: false,
    acquiring: true,
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        speedMps: null,
        error: "Geolocation not supported",
        permissionDenied: false,
        acquiring: false,
      });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          speedMps: position.coords.speed,
          error: null,
          permissionDenied: false,
          acquiring: false,
        });
      },
      (err) => {
        const denied = err.code === GeolocationPositionError.PERMISSION_DENIED;
        setState({
          speedMps: null,
          error: err.message,
          permissionDenied: denied,
          acquiring: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return state;
}
