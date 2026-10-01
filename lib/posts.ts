import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function readPost(file: string): Post {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    // gray-matter parses bare YAML dates into Date objects
    date: new Date(data.date ?? Date.now()).toISOString().slice(0, 10),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => process.env.NODE_ENV !== "production" || !p.draft)
    .sort((a, b) =>
      a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1,
    );
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts())
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export type Heading = { id: string; text: string; depth: 2 | 3 };

/** Plain text of a markdown/MDX body: used for the search index. */
export function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^[#>\-*+\s]+/gm, "")
    .replace(/[*_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** h2/h3 headings with the same ids rehype-slug generates. */
export function getHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const body = md.replace(/```[\s\S]*?```/g, "");
  const out: Heading[] = [];
  for (const m of body.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)) {
    const text = toPlainText(m[2]);
    out.push({ id: slugger.slug(text), text, depth: m[1].length as 2 | 3 });
  }
  return out;
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
