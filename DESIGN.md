# Design system

One layout, many themes. Pages and components never contain a colour, radius,
shadow or font value. They reference **tokens**, and the tokens live in a
single theme folder. Swap the folder and the whole site changes.

```
src/themes/
├── index.ts              ← which theme is active (1 line)
├── types.ts              ← the contract every theme fulfils
└── studio/
    ├── theme.css         ← every value: palette → semantic (dark + light) → components
    └── index.ts          ← portrait mode + browser theme colours
src/app/globals.css       ← @imports the active theme.css (1 line)
src/styles/bridge.css     ← maps tokens onto Tailwind utilities (theme-agnostic)
src/styles/base.css       ← element defaults + .surface / .chrome / .rise primitives
src/lib/theme-script.ts   ← no-flash scheme script for <head>
src/lib/theme-mode.ts     ← useThemeMode() / setThemeMode()
```

## Current theme: Studio

Quiet and Apple-leaning. Solid surfaces, one accent, type doing the work.
No glows, gradients-as-decoration, shaders or page transitions.

### Palette

Four colours, used strictly. Everything else is a `color-mix()` of these.

| Token               | Hex       | Role                                                   |
| ------------------- | --------- | ------------------------------------------------------ |
| `--palette-night`   | `#0E2931` | Dark-mode background, light-mode text                  |
| `--palette-mist`    | `#E2E2E0` | Dark-mode text, light-mode background                  |
| `--palette-teal`    | `#2B7574` | Primary: button fills, active dots, focus, selection   |
| `--palette-crimson` | `#861211` | Errors only                                            |

`--shadow-ink` (black) and `--highlight-ink` (white) appear only inside
shadows, highlights and the light-mode surface lift.

### Light and dark

`html[data-theme]` picks the scheme. Light mode swaps background and text.
The head script applies the stored choice, or the system preference, before
first paint. `setThemeMode()` stores the choice and cross-fades with the View
Transitions API (instant under reduced motion).

Contrast rules (all WCAG AA or better):

- Text and muted/subtle tiers are mixes of text into background: muted 72/78%,
  subtle 58/68% (dark/light), all ≥ 4.5:1.
- Teal is never body text. `--ui-accent-text` lifts it toward mist in dark
  (6.4:1) and deepens it toward night in light (5.2:1) for links.
- Primary buttons use teal deepened 14% toward night so mist text reaches 4.5:1.
- Error text in dark mode lifts crimson toward mist (4.8:1); light mode uses
  crimson as is (7.7:1).

### Type

SF Pro on Apple devices (`-apple-system`, with optical sizes built in), Inter
(self-hosted by `next/font`, `opsz` axis) everywhere else. Semibold (600) for
headings and display, regular for body at 17px / 1.5.

Tracking is set per size, never one value: display -0.032em, headings
-0.022em, titles -0.014em, body -0.008em, small meta +0.004em with tabular
numerals (`.meta`).

**Two-tone headings.** Section headings put the title in full contrast and a
short muted sentence after it on the same line: "Selected projects. *Case
studies across product, design and code.*" Use `SectionHeading`'s `lead` prop.

### Materials

- `.surface`: solid raised panel (cards, forms, timeline entries). In light
  mode surfaces lift toward white, like paper on a grey desk.
- `.chrome`: translucent floating material for the nav capsules, with
  backdrop blur and saturation from one `--chrome-filter` token (the CSS
  pipeline drops `var()` nested inside `blur()`). Panels that sit over text
  use `--chrome-bg-heavy`. Reduced transparency makes both solid.

### Motion

- **One authored entrance:** `.rise` settles hero and page-header content
  into focus on load (fade + 14px lift + blur), staggered by `--i`.
- Press feedback lands on pointer-down: buttons scale to 0.97 in 100ms.
- Springs are critically damped (`bounce: 0`) everywhere except the nav's
  original per-icon flourishes.
- No scroll-triggered reveals, no hover glows.

## Navigation

- **Desktop:** three capsules across the top: socials (left, from `lg`), pages
  (centre), theme toggle (right).
- **Mobile:** one dock at the bottom: Home, About, Projects, Work, Connect and
  More. More opens a sheet that rises from the dock with Résumé, a Light/Dark
  segmented control and socials. When on /résumé, More shows the active pill.

## Component map

| Component           | Source                    | Themed by                       |
| ------------------- | ------------------------- | ------------------------------- |
| Floating navigation | RareUI Floating Navigation| `--nav-*`, `.chrome`            |
| Theme toggle        | Local                     | `--nav-*`                       |
| Secondary button    | RareUI Soft Button        | `--btn-soft-*` (per scheme)     |
| Primary button      | Local                     | `--btn-primary-*`               |
| Text link           | Local (`Button variant="link"`) | `--ui-accent-text`        |

## Making a new theme

1. Copy `src/themes/studio/` to `src/themes/<name>/`.
2. Change the values in `theme.css`. Keep every token name (in both the dark
   and light blocks); the bridge and components depend on them.
3. Rename the export in `<name>/index.ts`.
4. Point `src/app/globals.css` at `../themes/<name>/theme.css` and
   `src/themes/index.ts` at `./<name>`.

## Rules

- No hex, rgb or px colour values outside `src/themes/*/theme.css`.
- Components use Tailwind utilities from the bridge (`bg-surface`, `text-muted`,
  `text-accent-text`, `rounded-lg`) or `var(--token)` in arbitrary values.
- One radius per role: `--shape-lg` for tiles and panels, `--shape-md` for
  inputs and sheet rows, `--shape-pill` for controls.
- Translucency is structural (floating chrome only), never decoration.
- Every interactive element has a visible focus state and a 44px touch target
  on mobile.
- Motion respects `prefers-reduced-motion` (`.rise` becomes a plain fade, the
  theme cross-fade is skipped).
