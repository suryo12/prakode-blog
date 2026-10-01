import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";

function Card({ p, featured }: { p: PostMeta; featured?: boolean }) {
  return (
    <li className={featured ? "card card-featured" : "card"}>
      {featured && <span className="card-badge">Latest</span>}
      <h3 className="card-title serif">
        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
      </h3>
      {p.description && <p className="card-desc">{p.description}</p>}
      <div className="card-meta">
        <time dateTime={p.date}>{formatDate(p.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{p.readingMinutes} min read</span>
        {p.tags.map((t) => (
          <Link
            key={t}
            href={`/tags/${encodeURIComponent(t)}`}
            className="tag"
          >
            #{t}
          </Link>
        ))}
      </div>
    </li>
  );
}

export default function PostList({
  posts,
  groupByYear = false,
  featureFirst = false,
}: {
  posts: PostMeta[];
  groupByYear?: boolean;
  featureFirst?: boolean;
}) {
  if (posts.length === 0)
    return <p className="empty">Nothing here yet — check back soon.</p>;

  if (!groupByYear)
    return (
      <ul className="card-grid">
        {posts.map((p, i) => (
          <Card key={p.slug} p={p} featured={featureFirst && i === 0} />
        ))}
      </ul>
    );

  const years = new Map<string, PostMeta[]>();
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    years.set(y, [...(years.get(y) ?? []), p]);
  }
  return (
    <>
      {[...years].map(([year, items]) => (
        <section key={year} className="year-group" aria-label={year}>
          <h2 className="year">{year}</h2>
          <ul className="card-grid">
            {items.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
