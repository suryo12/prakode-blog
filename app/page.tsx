import Link from "next/link";
import PostList from "@/components/PostList";
import { SearchTrigger } from "@/components/Search";
import TagFilter from "@/components/TagFilter";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
      inLanguage: site.language,
      author: { "@id": `${site.aboutUrl}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${site.aboutUrl}/#person`,
      name: site.author,
      url: site.aboutUrl,
      jobTitle: "Software Engineer & Technical Project Manager",
      sameAs: [site.aboutUrl, site.github],
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Hello, I&apos;m Suryo</p>
          <h1 className="serif">
            Calm notes on building software that keeps running.
          </h1>
          <p className="lead">
            I&apos;m a software engineer and technical project manager. Here I
            write about backend engineering, fleet and fintech platforms, and
            the lessons I pick up along the way. Grab a coffee and stay a
            while.
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
        </div>

        <aside className="profile" aria-label="About the author">
          <div className="avatar" aria-hidden="true">
            SP
          </div>
          <h2 className="serif">{site.author}</h2>
          <p>
            Software engineer &amp; technical project manager, building
            backend, fleet and fintech platforms.
          </p>
          <div className="profile-links">
            <a href={site.aboutUrl}>Portfolio ↗</a>
            <a href="/rss.xml">RSS feed</a>
          </div>
        </aside>
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
        <PostList posts={posts.slice(0, 7)} featureFirst />
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
