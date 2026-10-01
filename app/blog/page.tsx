import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/PostList";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "All posts on prakode.site.",
  alternates: { canonical: "/blog/" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return (
    <>
      <h1 className="serif page-title">Blog</h1>
      {tags.length > 0 && (
        <div className="tags tag-cloud">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="chip"
            >
              {tag} <span className="muted">{count}</span>
            </Link>
          ))}
        </div>
      )}
      <PostList posts={posts} />
    </>
  );
}
