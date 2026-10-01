import type { Heading } from "@/lib/posts";

export default function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <details className="toc" open>
      <summary>In this post</summary>
      <nav aria-label="Table of contents">
        <ol>
          {headings.map((h) => (
            <li key={h.id} className={h.depth === 3 ? "toc-sub" : undefined}>
              <a href={`#${h.id}`}>{h.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
