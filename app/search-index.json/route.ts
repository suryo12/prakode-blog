import { getAllPosts, toPlainText } from "@/lib/posts";

export const dynamic = "force-static";

export function GET() {
  const entries = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    date: p.date,
    text: toPlainText(p.content).slice(0, 6000),
  }));
  return Response.json(entries);
}
