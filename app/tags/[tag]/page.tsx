import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/PostList";
import { getAllPosts, getAllTags } from "@/lib/posts";

type Params = { tag: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);
  return {
    title: `#${tag}`,
    description: `Posts tagged ${tag}.`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}/` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const tag = decodeURIComponent((await params).tag);
  const posts = getAllPosts().filter((p) => p.tags.includes(tag));
  return (
    <>
      <p className="mono muted small">
        <Link href="/blog/">← all posts</Link>
      </p>
      <h1 className="serif page-title">#{tag}</h1>
      <PostList posts={posts} />
    </>
  );
}
