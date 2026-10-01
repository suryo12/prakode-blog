import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: `${site.url}`, lastModified: posts[0]?.date },
    { url: `${site.url}/blog`, lastModified: posts[0]?.date },
    { url: `${site.url}/about` },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
    })),
    ...getAllTags().map(({ tag }) => ({
      url: `${site.url}/tags/${encodeURIComponent(tag)}`,
    })),
  ];
}
