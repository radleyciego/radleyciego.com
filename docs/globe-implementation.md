# Globe Implementation — Approved Values

This document records every exact visual and rendering value for the hero globe.
**DO NOT change any value listed here without explicit approval.**

---

## Canvas & Renderer

| Property | Value |
|---|---|
| WebGL canvas | `alpha: true`, premultiplied alpha, antialias on |
| `renderer.setSize(w, h, false)` | `false` — does not touch CSS |
| `renderer.setPixelRatio(min(dpr, 1.75))` | DPR capped at 1.75, applied once |
| CSS classes | `absolute inset-0 w-full h-full` — no blur, no filter |

## Camera

| Property | Value |
|---|---|
| Type | `PerspectiveCamera` |
| `fov` | `32` |
| `near` | `0.1` |
| `far` | `1000` |
| Position | `(0, 0, 20.2)` |
| `lookAt` | `(0, 0, 0)` |

## Lighting

| Light | Color | Intensity |
|---|---|---|
| Ambient | `0xffffff` | `1.2` |
| Directional (sun) | `0xffffff` | `1.2` |
| Sun position | `(5, 3, 5)` |

## Globe

| Property | Value |
|---|---|
| Radius | `5.0` |
| Y offset | `-1.6` (half-globe composition) |
| Land mesh color | `#0f1a30` |
| Land mesh opacity | `0.35` |
| Depth sphere | radius `5.0`, color `#010208`, opacity `0.45` |
| Rotation speed (auto) | `0.01` rad/s (counterclockwise around Y) |
| Drag sensitivity | `0.005` |
| Auto-resume after drag | `3000` ms |
| Drag idle timeout | `5000` ms |

## Atmosphere

| Layer | Color | Opacity | Geometry |
|---|---|---|---|
| Rim light | `#4d7cff` | `0.55` | Sphere r=5.55, BackSide |
| Upper glow | `#4d7cff` | `0.08` | Sphere r=6.8, BackSide |
| Lower haze | `#1a2a5e` | `0.10` | Sphere r=5.6, BackSide, lower half only |

## Page Background (src/app/page.tsx)

| Layer | Value |
|---|---|
| Section element | `relative overflow-hidden bg-[#020306]` |
| Grid pattern | `48px`, `rgba(43,59,91,0.12)`, on section element |
| Navy central gradient | `radial-gradient(ellipse 50% 50% at 50% 55%, rgba(10,18,40,0.50) 0%, transparent 100%)` |
| Navy left gradient | `radial-gradient(ellipse 40% 60% at 15% 50%, rgba(10,18,40,0.30) 0%, transparent 100%)` |
| Base color | `#020306` |

## Land Dots (Points)

| Property | Value |
|---|---|
| Data source | `src/data/land-points.json` — 13,918 `[lng, lat]` pairs |
| Lattice step | 1.25 degrees |
| Earth radius constant | `6371` (used in shader) |
| Base globe radius constant | `5.0` (used in shader) |
| Point size | `1.4` px (screen-space via `uPixelRatio`) |
| Color | `#8894ad` |
| Opacity | `0.7` |
| Blending | `THREE.NormalBlending` |
| Depth write | `true` |
| Vertex shader | Positions lat/lng on sphere surface, `gl_PointSize = size * uPixelRatio` |

## Nodes (15 Cities)

### Cores (inner layer)

| Property | Value |
|---|---|
| Base size | `6.5` px |
| Hover size | `9.5` px |
| Color | `#1747e8` |
| Opacity | `0.95` |
| Blending | `THREE.NormalBlending` |
| Depth write | `true` |

### Halos (outer layer)

| Property | Value |
|---|---|
| Base size | `10.0` px |
| Hover size | `15.0` px |
| Color | `#4d7cff` |
| Opacity | `0.09` |
| Blending | `THREE.AdditiveBlending` |
| Depth write | `false` |

### Signal Heads (on hover)

| Property | Value |
|---|---|
| Base size | `3.0` px |
| Hover size | `5.0` px |
| Color | `#4d7cff` |
| Opacity | `0.9` |
| Blending | `THREE.AdditiveBlending` |

### City List

| City | Lat | Lng |
|---|---|---|
| Abu Dhabi | 24.45 | 54.65 |
| Riyadh | 24.71 | 46.67 |
| Dubai | 25.20 | 55.27 |
| Doha | 25.29 | 51.53 |
| Kuwait City | 29.37 | 47.98 |
| Muscat | 23.59 | 58.54 |
| Manama | 26.23 | 50.58 |
| Dammam | 26.43 | 50.10 |
| Jeddah | 21.49 | 39.19 |
| Mecca | 21.39 | 39.86 |
| Medina | 24.47 | 39.61 |
| Tabuk | 28.38 | 36.56 |
| NEOM | 27.95 | 35.30 |
| AlUla | 26.62 | 37.92 |
| Yanbu | 24.09 | 38.06 |

## Connections (15 Pairs)

| From | To |
|---|---|
| Abu Dhabi | Riyadh |
| Abu Dhabi | Dubai |
| Abu Dhabi | Doha |
| Dubai | Doha |
| Dubai | Muscat |
| Riyadh | Doha |
| Riyadh | Kuwait City |
| Riyadh | Jeddah |
| Jeddah | Mecca |
| Jeddah | Medina |
| Mecca | Medina |
| Medina | Tabuk |
| Tabuk | NEOM |
| NEOM | AlUla |
| Yanbu | NEOM |

## Connections (Arcs)

| Property | Value |
|---|---|
| Geometry | Great-circle arcs, 50 segments |
| Altitude | `0.08` (fraction of globe radius) |
| Segments | `128` |
| Tube radius | `0.015` |
| Core color | `#1747e8` |
| Core opacity | `0.18` |
| Bright edge color | `#2457ef` |
| Bright edge opacity | `0.28` |
| Bright edge width | `0.007` |
| Tube geometry | `TubeGeometry` (not `Line2` / `worldUnits`) |

## Arc Animation

| Property | Value |
|---|---|
| Stagger delay | `0.12` s per arc |
| Pulse period | `3.5` s |
| Pulse delay | `0.2` s |
| Travel head color | `#102d88` |
| Travel head opacity | `0.8` |
| Travel head size | `0.045` |

## Interactivity

| Property | Value |
|---|---|
| Drag enabled | Yes (left mouse / touch) |
| Drag sensitivity | `0.005` |
| Auto-rotation resumes after | `3000` ms of inactivity |
| Drag idle detection | `5000` ms |
| `onPointerDown` | captures `e.nativeEvent.offsetX/Y` |
| `onPointerMove` | only when dragging |
| `onPointerUp` | stops drag, starts resume timer |

## Reduced Motion

| Property | Value |
|---|---|
| Detection | `window.matchMedia('(prefers-reduced-motion: reduce)')` |
| Effect | `autoRotate = false`, `pulseSpeed = 0`, `nodePulseSpeed = 0` |

## File Paths

| File | Purpose |
|---|---|
| `src/components/hero-globe.tsx` | Main Three.js globe component |
| `src/components/hero-globe-loader.tsx` | Dynamic import wrapper (`ssr: false`) |
| `src/app/page.tsx` | Home page with hero section and background layers |
| `src/app/globals.css` | CSS variables and base styles |
| `src/data/land-points.json` | 13,918 land dot coordinates |
| `scripts/preprocessLand.js` | GeoJSON preprocessing pipeline |
| `scripts/land.geojson` | Natural Earth 110m land polygons (source data) |
