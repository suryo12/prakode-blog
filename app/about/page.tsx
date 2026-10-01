import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About this blog and ${site.author}.`,
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <article className="prose">
      <h1 className="serif page-title">About</h1>
      <p>
        Hi, I&apos;m <strong>{site.author}</strong>. I build and run backend,
        fleet and fintech platforms, and I also work as a technical project
        manager.
      </p>
      <p>
        This blog is my notebook: things I&apos;ve figured out, mistakes worth
        not repeating, and occasional research notes. If a post helped you (or
        you think I got something wrong), leave a comment under it.
      </p>
      <p>
        For the full story — experience, systems, publications, open source and
        education — see my portfolio at{" "}
        <a href={site.aboutUrl}>me.prakode.site</a>.
      </p>
    </article>
  );
}
