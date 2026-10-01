import { countOnce, json, looksLikeBot, originAllowed, purgeOld, readCounts, type Env } from "./_lib";

const SLUG = /^[a-z0-9][a-z0-9-]{0,100}$/;

/** POST /api/view  { slug?: string } — count one daily-unique visit (and read). */
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!originAllowed(request)) return json({ error: "forbidden" }, { status: 403 });

  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: unknown };
    if (typeof body.slug === "string") slug = body.slug;
  } catch {
    /* no body = site-level visit only */
  }

  // Bots still get the current numbers, they just don't change them.
  if (!looksLikeBot(request)) {
    try {
      await countOnce(env, request, "site", "site");

      if (slug && SLUG.test(slug)) {
        // Only count slugs that are real pages, so nobody can pollute the table.
        const page = await env.ASSETS.fetch(new URL(`/blog/${slug}`, request.url));
        if (page.ok) await countOnce(env, request, `post:${slug}`, `post:${slug}`);
      }

      if (Math.random() < 0.02) await purgeOld(env);
    } catch {
      /* never break the page over analytics */
    }
  }

  try {
    return json(await readCounts(env), { headers: { "cache-control": "no-store" } });
  } catch {
    return json({ visitors: 0, posts: {} });
  }
};

export const onRequest = () => json({ error: "method not allowed" }, { status: 405 });
