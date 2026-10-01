# prakode.site — personal blog

Next.js (App Router) + MDX, exported as a fully static site. The portfolio lives
separately at `me.prakode.site`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static output in ./out
```

## Write a post

Create `content/posts/<slug>.mdx`:

```mdx
---
title: "Post title"
description: "Shown in lists and search results."
date: 2026-10-01
tags: [backend]
draft: true   # hidden from production builds until removed
---

Markdown here.
```

RSS (`/rss.xml`), sitemap and tag pages are generated automatically.

## Comments (Giscus)

Comments are stored in GitHub Discussions and stay hidden until configured.

1. The repo must be **public** and have **Discussions** enabled (Settings -> General).
2. Install the Giscus app on the repo: https://github.com/apps/giscus
   (choose "Only select repositories" and pick this repo). Without this step
   Giscus answers "giscus is not installed on this repository".
3. Put the repo/category IDs in `.env.production` (see `.env.example`). They
   are public identifiers, not secrets, so the file can be committed. The
   category should be **Announcements** so only maintainers and Giscus can
   open threads.
4. `npm run build`, then deploy.

## Visitor and read counter

`functions/api/*` runs on Cloudflare Pages Functions with a D1 database
(`schema.sql`, bound as `DB` in `wrangler.toml`). It stores only counters and
salted daily hashes (no IPs). The `SALT` secret is set with
`npx wrangler pages secret put SALT --project-name prakode-blog`.

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `out`
- Custom domain: `prakode.site` (keep `me.prakode.site` pointing at the portfolio)
