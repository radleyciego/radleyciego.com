# radleyciego.com

Personal consulting & portfolio site for Radley Ciego — geospatial data engineer and infrastructure resilience consultant. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, MapLibre GL JS.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- MapLibre GL JS (hero map on homepage)
- Space Mono from Google Fonts
- Deploy: Vercel or Cloudflare Pages (static export)

## Conventions

- App Router with `src/app/` directory structure
- Client components only where browser APIs needed (map, nav active state)
- Dark-only theme (pure black background, blue accent `#4d7cff`)
- `@/` path alias maps to `./src/`
- All pages are statically generated (no server-side rendering needed)

## Structure

- `src/app/layout.tsx` — root layout with nav + footer
- `src/app/page.tsx` — Home (bio, hero map, quick facts)
- `src/app/projects/page.tsx` — Projects (Dubai EV Charging Resilience Index)
- `src/app/experience/page.tsx` — Experience (work timeline, education, skills)
- `src/components/nav.tsx` — sticky nav with 3-tab navigation
- `src/components/hero-map.tsx` — MapLibre GL JS map hero element
