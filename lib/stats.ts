// Tiny client-side store for visitor / read counts served by /api (Cloudflare D1).
// Everything fails silently: if the API is unreachable (local dev, offline, blocked),
// no numbers are shown and the site works exactly the same.

export type Stats = { visitors: number; posts: Record<string, number> };

let current: Stats | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: Stats) {
  current = next;
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSnapshot(): Stats | null {
  return current;
}

export function loadStats(): Promise<void> {
  loading ??= fetch("/api/stats")
    .then((r) => (r.ok ? (r.json() as Promise<Stats>) : null))
    .then((data) => {
      if (data && !current) set(data);
    })
    .catch(() => {});
  return loading;
}

/** Report this page view (once per tab session per page) and refresh the numbers. */
export async function track(slug?: string): Promise<void> {
  const key = `tracked:${slug ?? "site"}`;
  try {
    if (sessionStorage.getItem(key)) return void (await loadStats());
  } catch {
    /* storage blocked: just count, the server de-duplicates anyway */
  }
  try {
    const res = await fetch("/api/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(slug ? { slug } : {}),
    });
    if (!res.ok) return void (await loadStats());
    set((await res.json()) as Stats);
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  } catch {
    /* ignore */
  }
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
