import Link from "next/link";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  return (
    <>
      <section className="hero">
        <p className="mono eyebrow">&gt; prakode.site</p>
        <h1 className="serif">
          Notes on building software that has to keep running.
        </h1>
        <p className="lead muted">
          I&apos;m {site.author} — a software engineer and technical project
          manager. This is where I write about backend engineering, fleet and
          fintech platforms, and what I learn along the way.{" "}
          <a href={site.aboutUrl}>More about me ↗</a>
        </p>
      </section>

      <section>
        <div className="section-head">
          <h2 className="mono">Latest posts</h2>
          <Link href="/blog/" className="mono small">
            all posts →
          </Link>
        </div>
        <PostList posts={posts} />
      </section>
    </>
  );
}
