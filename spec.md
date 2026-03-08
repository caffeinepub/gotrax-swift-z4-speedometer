# Gotrax Swift Z4 Speedometer

## Current State
- React + Vite frontend with a full-screen SVG arc speedometer gauge
- GPS speed via `navigator.geolocation.watchPosition` in `useGeolocation.ts`
- Settings (theme, skin, unit) persisted in localStorage
- Battery display, live clock, speed mode tabs, portrait block overlay
- PWA icons already generated (192px and 512px)
- `index.html` has Apple mobile-web-app meta tags but NO `manifest.json` link and NO service worker

## Requested Changes (Diff)

### Add
- `public/manifest.json` — full Web App Manifest (name, icons, display, orientation, theme_color, start_url)
- `public/sw.js` — service worker with cache-first strategy, caching all app shell assets on install
- `<link rel="manifest" href="/manifest.json">` in `index.html`
- Service worker registration in `main.tsx` (registers `sw.js` after page load)
- "Searching for GPS..." state in `SpeedometerGauge.tsx` / `App.tsx`: shown when `speedMps === null` and no error (GPS acquiring lock), distinct from error states

### Modify
- `index.html`: add manifest link tag
- `main.tsx`: register service worker after app mounts
- `App.tsx`: pass GPS-acquiring state to gauge for "Searching for GPS..." display
- `useGeolocation.ts`: add `acquiring` boolean flag (true while waiting for first fix, false once speed arrives or error occurs)
- `SpeedometerGauge.tsx`: accept `acquiring` prop and render "Searching for GPS..." overlay text instead of "0" when acquiring

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/public/manifest.json` with all required PWA fields, pointing to existing icons
2. Create `src/frontend/public/sw.js` with install/activate/fetch handlers caching app shell (cache-first with network fallback)
3. Add `<link rel="manifest">` to `index.html`
4. Add service worker registration code to `main.tsx`
5. Update `useGeolocation.ts` to expose `acquiring: boolean` (true until first position or error)
6. Update `App.tsx` to pass `acquiring` to `SpeedometerGauge`
7. Update `SpeedometerGauge.tsx` to show "Searching for GPS..." label when acquiring
