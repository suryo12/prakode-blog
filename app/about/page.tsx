import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About this blog and ${site.author}.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <article>
      <header className="page-head">
        <h1 className="serif">About this blog</h1>
      </header>
      <div className="prose">
        <p>
          Hi, I&apos;m <strong>{site.author}</strong>. I build and run backend,
          fleet and fintech platforms, and I also work as a technical project
          manager.
        </p>
        <p>
          This blog is my notebook: things I&apos;ve figured out, mistakes worth
          not repeating, and the occasional research note. I write at a relaxed
          pace and try to keep every post useful on its own.
        </p>
        <p>
          If a post helped you — or you think I got something wrong — leave a
          comment under it. I read them all.
        </p>
        <h2>Looking for the full story?</h2>
        <p>
          My experience, systems, publications, open-source work and education
          live on my portfolio at{" "}
          <a href={site.aboutUrl}>me.prakode.site</a>.
        </p>
        <p>
          <Link href="/blog">Browse the blog →</Link>
        </p>
      </div>
    </article>
  );
}
