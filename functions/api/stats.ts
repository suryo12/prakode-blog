import { json, readCounts, type Env } from "./_lib";

/** GET /api/stats — current visitor and per-post read counts. */
export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    return json(await readCounts(env), {
      headers: { "cache-control": "public, max-age=60, s-maxage=60" },
    });
  } catch {
    return json({ visitors: 0, posts: {} });
  }
};

export const onRequest = () => json({ error: "method not allowed" }, { status: 405 });
