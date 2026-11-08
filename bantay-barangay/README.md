# Bantay Barangay — Mockups

**Serbisyong Barangay, Isang Click Na Lang!**

Concept mockup images for *Bantay Barangay*, a proposed digital barangay services platform.
Palette follows the Philippine flag: blue `#0038A8`, red `#CE1126`, yellow `#FCD116`, white.

> **DEMO CONCEPT — Not an official government service.** Barangay Gapo, its officials,
> budgets, fees, phone numbers and residents are fictional.

## Images (`mockups/`)

| File | Size | Use |
|---|---|---|
| `overview.png` | 3840×2160 | Cover / banner collage (5 screens) |
| `admin.png` | 3200×2160 | Barangay admin console (desktop) |
| `01-welcome.png` … `13-finale.png` | 2160×2700 (4:5) | Facebook carousel posts |

Posts: 01 Welcome · 02 Dashboard · 03 Clearance form · 04 Tracking number · 05 Report road damage ·
06 Power outage tracking · 07 Budget · 08 Officials · 09 Health · 10 Emergency · 11 Bantay AI · 12 Senior Citizens · 13 Finale

## Re-render

```bash
npm install
npm run build
node render.mjs          # SCALE=2 for 2x output; needs Playwright + Chromium
```

Screens are React + Tailwind components in `src/mock/` (`screens.tsx`, `main.tsx`, `kit.tsx`).
