// Shared helpers for the Pages Functions under /api. Not a route (no onRequest export).

export interface D1Result {
  meta: { changes: number };
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
export interface Env {
  DB: D1Database;
  ASSETS: { fetch(request: Request | string | URL): Promise<Response> };
  SALT?: string;
}

const ALLOWED_HOSTS = [/^prakode\.site$/, /^www\.prakode\.site$/, /^([a-z0-9-]+\.)?prakode-blog\.pages\.dev$/, /^localhost$/, /^127\.0\.0\.1$/];
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python-requests|httpclient/i;

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json; charset=utf-8", ...(init.headers ?? {}) },
  });
}

export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

export function looksLikeBot(request: Request): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  return ua.length < 10 || BOT.test(ua);
}

export async function fingerprint(request: Request, env: Env, scope: string): Promise<string> {
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const ua = request.headers.get("user-agent") ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${env.SALT ?? "dev"}|${day}|${scope}|${ip}|${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Increment `key` once per fingerprint per day. Returns true if it counted. */
export async function countOnce(
  env: Env,
  request: Request,
  scope: string,
  key: string,
): Promise<boolean> {
  const h = await fingerprint(request, env, scope);
  const day = new Date().toISOString().slice(0, 10);
  const seen = await env.DB.prepare("INSERT OR IGNORE INTO seen (h, day) VALUES (?, ?)")
    .bind(h, day)
    .run();
  if (seen.meta.changes === 0) return false;
  await env.DB.prepare(
    "INSERT INTO stats (key, count) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET count = count + 1",
  )
    .bind(key)
    .run();
  return true;
}

export async function readCounts(env: Env): Promise<{ visitors: number; posts: Record<string, number> }> {
  const { results } = await env.DB.prepare("SELECT key, count FROM stats").all<{
    key: string;
    count: number;
  }>();
  const posts: Record<string, number> = {};
  let visitors = 0;
  for (const r of results) {
    if (r.key === "site") visitors = r.count;
    else if (r.key.startsWith("post:")) posts[r.key.slice(5)] = r.count;
  }
  return { visitors, posts };
}

export async function purgeOld(env: Env): Promise<void> {
  const cutoff = new Date(Date.now() - 3 * 86400_000).toISOString().slice(0, 10);
  await env.DB.prepare("DELETE FROM seen WHERE day < ?").bind(cutoff).run();
}
