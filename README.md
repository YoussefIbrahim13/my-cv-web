# Youssef Ibrahim — Portfolio

A bilingual (English / Arabic) single-page portfolio for **Youssef Ibrahim**, backend developer
(.NET 8 / ASP.NET Core). Six shipped systems, each presented as a flip card: the front is the
pitch, the back is the real architecture.

Built with React + Vite on the **Nocturne** design system, with a live canvas service-graph in the
hero and Vercel Web Analytics for visitor stats.

## Getting started

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | All content and layout — copy in `TEXT`, projects in `PROJECTS`, one arch diagram component per project. |
| `src/nocturne.css` | The Nocturne design system: tokens (`--color-*`, `--space-*`, `--radius-*`) and base type. Do not hard-code values these tokens already carry. |
| `src/portfolio.css` | The page layer built on those tokens. |
| `public/uploads/` | The CV PDF the nav and hero link to. |

## Editing content

Copy is data, not markup:

- **`TEXT.en` / `TEXT.ar`** — page-level prose. Both languages must define the same keys.
- **`PROJECTS`** — one entry per card. Each carries `en` / `ar` copy (`tag`, `sub`, `desc`, `note`),
  a `tech` tag list, the `repo` URL, and flags: `wide` (spans both grid columns), `alt` (uses the
  secondary accent), `titleSmall`.
- **`ARCH`** — maps a project `id` to its architecture-diagram component, rendered on the card back.

Tech names (`.NET 8`, `EF Core`, repo URLs) are deliberately kept out of `TEXT` since they read the
same in both languages.

The grid is two columns, so `wide` cards should stay in even numbers or sit at the ends — currently
Petzy opens the section and RecruitBot closes it, bracketing two rows of pairs.

## Architecture claims

Every diagram was checked against the actual repository before it was written — module counts,
worker responsibilities, rate limits and hosting models all reflect what the code does, not what
the pitch would prefer. If a repo changes shape, update the card with it.

## Analytics

`@vercel/analytics` is mounted in `App.jsx`. Enable **Web Analytics** in the Vercel project
dashboard and it reports visitors, page views, country, device, browser and referrer. It is
cookie-free, so no consent banner is required.
