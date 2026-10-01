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

1. Push this project to a **public** GitHub repo.
2. In the repo: Settings → General → enable **Discussions**; create a category
   named `Comments` (type: Announcements, so only Giscus can open threads).
3. Install the app: https://github.com/apps/giscus
4. Open https://giscus.app, enter the repo, choose "Specific term" mapping,
   and copy the `data-repo-id` and `data-category-id` values.
5. Copy `.env.example` to `.env.local` (and add the same variables in the
   Cloudflare Pages build settings), then fill in the four values.

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `out`
- Custom domain: `prakode.site` (keep `me.prakode.site` pointing at the portfolio)
