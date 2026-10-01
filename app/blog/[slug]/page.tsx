import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import Comments from "@/components/Comments";
import ReadingProgress from "@/components/ReadingProgress";
import { ViewCount } from "@/components/ViewCount";
import Toc from "@/components/Toc";
import { formatDate, getAllPosts, getHeadings, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.author],
      tags: post.tags,
    },
    keywords: [...post.tags, ...site.keywords.slice(0, 3)],
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const url = `${site.url}/blog/${post.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: site.language,
      keywords: post.tags.join(", "),
      wordCount: post.content.split(/\s+/).filter(Boolean).length,
      image: `${url}/opengraph-image`,
      author: { "@type": "Person", name: site.author, url: site.aboutUrl },
      publisher: { "@type": "Person", name: site.author, url: site.aboutUrl },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  const tagLinks = post.tags.map((t) => (
    <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="tag">
      #{t}
    </Link>
  ));

  return (
    <article className="article">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Desktop-only left rail: back link + details stay in view while reading */}
      <aside className="rail" aria-label="Post details">
        <Link href="/blog" className="rail-back">
          ← All posts
        </Link>
        <dl className="rail-meta">
          <div>
            <dt>Published</dt>
            <dd>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Reading time</dt>
            <dd>{post.readingMinutes} min</dd>
          </div>
          <div className="rail-views">
            <dt>Reads</dt>
            <dd>
              <ViewCount slug={post.slug} />
            </dd>
          </div>
          {post.tags.length > 0 && (
            <div>
              <dt>Topics</dt>
              <dd className="rail-tags">{tagLinks}</dd>
            </div>
          )}
        </dl>
      </aside>

      <header className="article-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/blog">← All posts</Link>
        </nav>
        <h1 className="serif">{post.title}</h1>
        {post.description && <p className="lead">{post.description}</p>}
        <div className="post-meta article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
          <ViewCount slug={post.slug} />
          {tagLinks}
        </div>
      </header>

      <aside className="side">
        <div className="side-toc">
          <Toc headings={getHeadings(post.content)} />
        </div>
        <div className="author-card">
          <div className="avatar avatar-sm" aria-hidden="true">
            SP
          </div>
          <div>
            <p className="author-name serif">{site.author}</p>
            <p className="author-bio">
              Software engineer &amp; technical project manager.{" "}
              <a href={site.aboutUrl}>More about me ↗</a>
            </p>
          </div>
        </div>
      </aside>

      <div className="prose article-body">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                [
                  rehypePrettyCode,
                  { theme: "github-light", keepBackground: false },
                ],
              ],
            },
          }}
        />
      </div>

      {(newer || older) && (
        <nav className="pager" aria-label="More posts">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="pager-link">
              <span className="pager-dir">← Older</span>
              <span className="pager-title serif">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/blog/${newer.slug}`} className="pager-link pager-next">
              <span className="pager-dir">Newer →</span>
              <span className="pager-title serif">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <div className="discussion">
        <Comments term={post.slug} />
      </div>
    </article>
  );
}
