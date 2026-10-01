import { ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = site.title;

export default function Image() {
  return renderOg({
    title: "Calm notes on building software that keeps running.",
    kicker: "prakode.site",
    footer: `by ${site.author}`,
  });
}
