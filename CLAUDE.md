# radleyciego.com

Personal research + professional portfolio site. Built with Astro 4, vanilla CSS, zero JS.

## Todo

### High Priority
- [ ] Add one result visual per project page (feature importance plot for mobility-resilience, spatial join map for outage-detection)
- [ ] Add "Download PDF" link on resume page
- [ ] Add tech badge to footer (e.g. "Built with Astro · Hosted on Netlify")

### Medium
- [ ] Add privacy-respecting analytics (Plausible or similar) to understand recruiter behavior
- [ ] Add responsive image handling for project screenshots
- [ ] Add meta tags for social sharing (Open Graph)

### Low
- [ ] Contact form (or mailto link enhancement)
- [ ] 301 redirects if pages are renamed
- [ ] Sitemap.xml for search indexing

## Conventions

- Pure CSS, no Tailwind or UI frameworks
- System font stack (no Google Fonts)
- All pages are static HTML — zero JS bundle
- Theme: dark/light via CSS custom properties on `:root` / `[data-theme="dark"]`
- One `.astro` file per route in `src/pages/`
- Deploy: push to master → Netlify auto-deploys
