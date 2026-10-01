import Link from "next/link";
import PostList from "@/components/PostList";
import { SearchTrigger } from "@/components/Search";
import TagFilter from "@/components/TagFilter";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Hello, I&apos;m Suryo</p>
        <h1 className="serif">
          Calm notes on building software that keeps running.
        </h1>
        <p className="lead">
          I&apos;m a software engineer and technical project manager. Here I
          write about backend engineering, fleet and fintech platforms, and the
          lessons I pick up along the way. Grab a coffee and stay a while.
        </p>
        <div className="hero-actions">
          <Link href="/blog" className="btn btn-primary">
            Read the blog
          </Link>
          <a href={site.aboutUrl} className="btn btn-quiet">
            About me <span aria-hidden="true">↗</span>
          </a>
        </div>
        <SearchTrigger large />
      </section>

      <section className="block" aria-labelledby="latest">
        <div className="block-head">
          <h2 id="latest" className="block-title">
            Latest writing
          </h2>
          <Link href="/blog" className="block-link">
            All posts →
          </Link>
        </div>
        <PostList posts={posts.slice(0, 6)} />
      </section>

      <section className="block" aria-labelledby="topics">
        <div className="block-head">
          <h2 id="topics" className="block-title">
            Browse by topic
          </h2>
        </div>
        <TagFilter />
      </section>
    </>
  );
}
