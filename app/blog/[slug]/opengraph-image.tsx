import { ogSize, renderOg } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Blog post preview";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  return renderOg({
    title: post?.title ?? site.title,
    kicker: "prakode.site",
    footer: post
      ? `${site.author} · ${post.tags.map((t) => "#" + t).join("  ")}`
      : site.author,
  });
}
