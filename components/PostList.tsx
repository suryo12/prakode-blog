import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";

export default function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p className="muted">No posts yet.</p>;
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.slug}>
          <time className="mono muted small" dateTime={p.date}>
            {formatDate(p.date)}
          </time>
          <div>
            <h3>
              <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
            </h3>
            {p.description && <p className="muted">{p.description}</p>}
            <div className="tags">
              {p.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}/`}
                  className="chip"
                >
                  {t}
                </Link>
              ))}
              <span className="mono muted small">
                {p.readingMinutes} min read
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
