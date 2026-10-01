import type { Metadata } from "next";
import PostList from "@/components/PostList";
import TagFilter from "@/components/TagFilter";
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
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}` },
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
      <header className="page-head">
        <h1 className="serif">#{tag}</h1>
        <p className="lead">
          {posts.length} {posts.length === 1 ? "post" : "posts"} on this topic.
        </p>
      </header>
      <TagFilter active={tag} />
      <PostList posts={posts} groupByYear />
    </>
  );
}
