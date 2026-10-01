import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { SearchTrigger } from "@/components/Search";
import TagFilter from "@/components/TagFilter";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "All posts on prakode.site, newest first.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <header className="page-head">
        <h1 className="serif">Writing</h1>
        <p className="lead">
          {posts.length} {posts.length === 1 ? "post" : "posts"}, newest first.
          Filter by topic or search to find something specific.
        </p>
      </header>
      <SearchTrigger large />
      <TagFilter />
      <PostList posts={posts} groupByYear />
    </>
  );
}
