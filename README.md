# Soham Tulsyan: portfolio

Next.js 16 (App Router, static export) · Tailwind v4 · Notion as CMS ·
hosted on GitHub Pages with a custom domain.

Pages: Home, About, Projects (+ a case study per project), Work, Résumé
(download), Connect.

## How it fits together

```
Notion databases ──(npm run sync, at build time)──▶ src/content/generated/snapshot.json
                                                   public/cms/*  (images, résumé PDF)
                                                        │
                                               next build (output: "export")
                                                        │
                                                      out/  ──▶ GitHub Pages
```

GitHub Pages only serves static files, so Notion is read **at build time**.
`scripts/sync-content.ts` pulls every database and page body, then
downloads Notion-hosted files into `public/cms/` (Notion's file links expire
after an hour). The site renders from that snapshot.

## Local development

```bash
npm install
cp .env.example .env.local   # add NOTION_TOKEN to load real content
npm run dev                  # runs sync first, then next dev
```

Without `NOTION_TOKEN`, `npm run dev` shows clearly marked **sample
content** so you can work on layout. Production builds never show sample
content.

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run sync`      | Pull content from Notion into the snapshot    |
| `npm run dev`       | Sync, then start the dev server               |
| `npm run build`     | Sync, then export the static site to `out/`   |
| `npm run preview`   | Serve `out/` locally                          |
| `npm run lint`      | ESLint                                        |
| `npm run typecheck` | TypeScript                                    |

## Notion setup (one time)

Content lives in **Portfolio Website Content** in Notion, which has five
databases: Profile, Projects, Work, Socials, and Inbox (unused, safe to
delete).

1. Create an internal integration at https://www.notion.so/my-integrations
   (read-only access is enough) and copy its secret.
2. In Notion, open **Portfolio Website Content** → `•••` → **Connections**
   and add the integration.
3. Put the secret in `.env.local` as `NOTION_TOKEN` and, for deploys, in the
   GitHub repo (see below).

The page itself explains what each column does. Don't rename columns; the
site reads them by name (`src/lib/notion/fetch.ts`). Data source IDs are in
`src/lib/notion/config.ts` and can be overridden with env vars.

## Deploying to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Secrets and variables → Actions**:
   - Secret `NOTION_TOKEN`: the integration secret.
   - Variable `SITE_URL`: e.g. `https://sohamtulsyan.com` (canonical URLs,
     sitemap, OG tags).
   - Variable `FORM_ENDPOINT` (optional): see *Contact form*.
4. **Settings → Pages → Custom domain**: enter your domain, then add the
   DNS records GitHub shows (`A` records, or `ALIAS`, for an apex domain; a
   `CNAME` for a subdomain). Tick **Enforce HTTPS** once the certificate is
   issued.

`.github/workflows/deploy.yml` builds and deploys:

- on every push to `main`,
- daily at 03:00 UTC (picks up Notion edits),
- on demand: **Actions → Deploy to GitHub Pages → Run workflow**,
- on a `repository_dispatch` event of type `notion-update`, so a Notion
  automation or Zapier/Make webhook can trigger a rebuild:

  ```bash
  curl -X POST -H "Authorization: Bearer <github-token>" \
    https://api.github.com/repos/<owner>/<repo>/dispatches \
    -d '{"event_type":"notion-update"}'
  ```

The build fails loudly if `NOTION_TOKEN` is missing or Notion errors, so a
bad token never ships an empty site.

## Contact form

A static site can't keep a Notion token secret, so the Connect form posts
JSON (`name`, `email`, `message`) to a form service. Create a form at
Formspree (or Web3Forms, Getform, etc.) and set its endpoint as the
`FORM_ENDPOINT` repo variable (`NEXT_PUBLIC_FORM_ENDPOINT` locally). Until
then, the form opens the visitor's email app with the message pre-filled,
addressed to the Profile email.

## Theming

See [DESIGN.md](DESIGN.md). In short: every value lives in
`src/themes/<theme>/theme.css`, effect components are chosen in
`src/themes/<theme>/index.ts`, and switching themes means changing one
import in `src/app/globals.css` and one in `src/themes/index.ts`.

## Portrait

The hero uses `public/images/portrait.jpg` until a **Photo** is added to the
Notion Profile. Once you have a background-removed PNG, upload it to Notion
(or replace the file) and set `hero.portrait` to `"cutout"` in
`src/themes/neon-glass/index.ts`. The portrait then stands on the hero floor
with a glow instead of sitting in a glass frame.

## Credits

Floating Navigation, Soft Button and Liquid Wave from
[RareUI](https://rareui.in); Zoom Wash transition and Progressive Blur from
[SmoothUI](https://smoothui.dev); Lattice Loader from
[React Bits](https://reactbits.dev).
