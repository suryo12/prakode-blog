"use client";

import { useSyncExternalStore } from "react";
import { formatCount, getSnapshot, subscribe } from "@/lib/stats";

/** "1,234 reads" for a post. Renders nothing until a real number is available. */
export function ViewCount({ slug }: { slug: string }) {
  const stats = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const n = stats?.posts[slug];
  if (!n) return null;
  return (
    <span className="views">
      {formatCount(n)} {n === 1 ? "read" : "reads"}
    </span>
  );
}

/** Total visitors across the whole site, for the footer. */
export function SiteVisitors() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, () => null);
  if (!stats || !stats.visitors) return null;
  return (
    <span className="visitors">
      {formatCount(stats.visitors)} {stats.visitors === 1 ? "visitor" : "visitors"}
    </span>
  );
}
