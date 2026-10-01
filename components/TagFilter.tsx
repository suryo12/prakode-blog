import Link from "next/link";
import { getAllTags } from "@/lib/posts";

/** "All" plus one pill per topic; the active one is highlighted. */
export default function TagFilter({ active }: { active?: string }) {
  const tags = getAllTags();
  if (tags.length === 0) return null;
  return (
    <nav className="topics" aria-label="Topics">
      <Link
        href="/blog"
        className="pill"
        aria-current={active ? undefined : "page"}
      >
        All
      </Link>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="pill"
          aria-current={active === tag ? "page" : undefined}
        >
          {tag} <span className="pill-count">{count}</span>
        </Link>
      ))}
    </nav>
  );
}
