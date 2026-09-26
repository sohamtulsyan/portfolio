# Design system

One layout, many themes. Pages and components never contain a colour, radius,
shadow or font value. They reference **tokens**, and the tokens live in a
single theme folder. Swap the folder and the whole site changes.

```
src/themes/
├── index.ts              ← which theme is active (1 line)
├── types.ts              ← the contract every theme fulfils
└── neon-glass/
    ├── theme.css         ← every value: palette → semantic → components → effects
    └── index.ts          ← which effect components fill the layout's slots
src/app/globals.css       ← @imports the active theme.css (1 line)
src/styles/bridge.css     ← maps tokens onto Tailwind utilities (theme-agnostic)
src/styles/base.css       ← element defaults + .glass / .lit-edge primitives (theme-agnostic)
```

## Current theme: Neon Glass

Dark, glassy surfaces lit from within. The palette is used **strictly** (no
colours outside these five); "neon" comes from glow, blur and blend, never
from extra hues.

### Palette

| Token                | Hex       | Role                                               |
| -------------------- | --------- | -------------------------------------------------- |
| `--palette-charcoal` | `#353535` | Page background, loader background, text on light |
| `--palette-teal`     | `#3C6E71` | The light source: primary fills, glows, the wave   |
| `--palette-white`    | `#FFFFFF` | Primary text, active nav pill, hot highlights      |
| `--palette-mist`     | `#D9D9D9` | Secondary text, transition wash                    |
| `--palette-navy`     | `#284B63` | Depth: ambient bloom, portrait tint, wave shadows  |

`--shadow-ink` (`#000`) is used only inside shadows, never as a visible colour.

**Contrast rules.** Teal is too dark for text on charcoal (2.1:1), so it is
only ever a fill or a light. Text is white (12.3:1) or mist (8.7:1); the subtle
tier is mist at 72% (5.3:1). White text on a teal fill is 5.7:1.

### Layers in `theme.css`

1. **Palette**: the only hex values in the codebase.
2. **Semantic** (`--ui-*`): `bg`, `text`, `text-muted`, `text-subtle`, `accent`, `border`, `focus`, `selection`.
3. **Material**: `--glass-*` (frosted surfaces), `--glow-sm|md|lg` (neon halos), `--edge-gradient` (the lit hairline), `--ambient` (background blooms), `--shadow-*`.
4. **Shape / type / layout / motion**: `--shape-*`, `--type-*`, `--layout-*`, `--motion-*`.
5. **Components**: `--nav-*`, `--btn-primary-*`, `--btn-soft-*`, `--card-*`, `--chip-*`, `--field-*`, `--band-*`, `--portrait-*`.
6. **Effects** (read at runtime by WebGL): `--wave-*`, `--transition-*`, `--loader-*`.

### Type

Urbanist from Google Fonts, self-hosted by `next/font`. Bold (700) for
headings, ExtraBold (800) for the hero display, Regular (400) for body.

| Token                 | Size                          | Use                 |
| --------------------- | ----------------------------- | ------------------- |
| `--type-size-display` | clamp 3.25 → 6rem             | Hero name, 404      |
| `--type-size-3xl`     | clamp 2.4 → 4rem              | Page titles         |
| `--type-size-2xl`     | clamp 1.9 → 2.75rem           | Section headings    |
| `--type-size-xl`      | clamp 1.4 → 1.75rem           | Card titles         |
| `--type-size-lg`      | 1.25rem                       | Leads               |
| `--type-size-base`    | 1.0625rem                     | Body                |
| `--type-size-sm/xs`   | 0.9375 / 0.8125rem            | Meta, chips         |

Display tracking is -0.035em, headings -0.02em; body measure caps at 68ch.

### Signature moments

- **Hero**: the name set large with a teal text-glow, over the RareUI Liquid
  Wave. The wave blends with `screen`, so it adds light rather than paint.
- **Lit edge**: glass panels get a gradient hairline (white → teal → navy)
  that reads as the panel's edge catching light.
- **Route change**: SmoothUI's Zoom Wash shader covers the swap while the
  outgoing page blurs out.

Everything else stays quiet: no scroll-triggered fade-ins, no per-card
entrance animations.

## Component map

| Slot / component     | Source                         | Themed by                     |
| -------------------- | ------------------------------ | ----------------------------- |
| Floating navigation  | RareUI Floating Navigation     | `--nav-*`                     |
| Secondary button     | RareUI Soft Button             | `--btn-soft-*`                |
| Primary button       | Local                          | `--btn-primary-*`             |
| Hero background      | RareUI Liquid Wave (vendored)  | `--wave-*`                    |
| Page transition      | SmoothUI Zoom Wash shader      | `--transition-*`              |
| Bottom blur band     | SmoothUI Progressive Blur      | `--band-*`                    |
| Loader / splash      | React Bits Lattice Loader      | `--loader-*`                  |

Vendored files in `src/components/effects/vendor/` are kept unmodified so
they can be updated from upstream; theme them through props in their
wrappers (`HeroBackground.tsx`, `Loader.tsx`).

## Making a new theme

1. Copy `src/themes/neon-glass/` to `src/themes/<name>/`.
2. Change the values in `theme.css`. Keep every token name; the bridge and
   components depend on them.
3. In `<name>/index.ts`, rename the export and swap any slot for a
   different component (e.g. a new `HeroBackground`). Each slot's props are
   defined in `src/themes/types.ts`.
4. Point `src/app/globals.css` at `../themes/<name>/theme.css` and
   `src/themes/index.ts` at `./<name>`.

A pure colour refresh is step 2 alone: edit the palette block.

## Rules

- No hex, rgb or px colour values outside `src/themes/*/theme.css`.
- Components use Tailwind utilities from the bridge (`bg-bg`, `text-muted`,
  `rounded-lg`, `font-display`) or `var(--token)` in arbitrary values.
- One radius per role: `--shape-lg` for panels, `--shape-md` for inputs,
  `--shape-pill` for controls.
- Glass is structural (nav, panels, forms), not decoration.
- Every interactive element has a visible focus state and a 44px touch target.
- Motion respects `prefers-reduced-motion`: the wave and transition switch
  off, and the splash lifts without its fade.
