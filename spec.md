# Gotrax Swift Z4 Speedometer

## Current State
A landscape-only GPS speedometer PWA for the Gotrax Swift Z4 scooter. Features an SVG arc gauge, 4 skins, 6 color themes, ECO/SPORT/STREET mode selector, live clock, battery indicator, and a settings panel. Settings are persisted in localStorage. The app currently has no service worker or web app manifest, so it cannot be installed or used offline.

## Requested Changes (Diff)

### Add
- Web App Manifest (`manifest.webmanifest`) with app name, icons, display mode, orientation lock, and theme color so the app is installable on iOS and Android
- Service Worker (`sw.js`) using a cache-first strategy to cache all app assets (HTML, JS, CSS, fonts) so the app loads and runs fully offline after first visit
- Registration of the service worker in `main.tsx`
- App icons (192x192 and 512x512) for the manifest
- `<link rel="manifest">` and apple-touch-icon meta tags in `index.html`

### Modify
- `vite.config.js` — add `vite-plugin-pwa` to auto-generate service worker and manifest, OR manually wire the service worker and manifest files
- `index.html` — add manifest link, apple-touch-icon, and mobile-web-app-capable meta tags

### Remove
- Nothing removed

## Implementation Plan
1. Install `vite-plugin-pwa` as a dev dependency
2. Generate app icons (192x192 and 512x512 PNG) using the image generation tool
3. Configure `vite-plugin-pwa` in `vite.config.js` with manifest metadata, icon paths, and a `GenerateSW` workbox strategy caching all static assets
4. Add `<link rel="manifest">` and iOS PWA meta tags to `index.html`
5. Validate and build
