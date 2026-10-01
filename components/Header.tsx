import Link from "next/link";
import { site } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <b>{site.name}</b>.site
        </Link>
        <nav className="topnav" aria-label="Main">
          <Link href="/blog/">blog</Link>
          <Link href="/about/">about</Link>
          <a href={site.aboutUrl}>me ↗</a>
          <a href="/rss.xml">rss</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
