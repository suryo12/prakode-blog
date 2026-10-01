import Link from "next/link";
import { site } from "@/lib/site";
import { SearchTrigger } from "./Search";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <span className="brand-mark" aria-hidden="true">
            p
          </span>
          <span className="brand-name">{site.name}</span>
        </Link>
        <nav className="topnav" aria-label="Main">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <a href={site.aboutUrl} className="topnav-ext">
            Portfolio<span aria-hidden="true"> ↗</span>
          </a>
          <SearchTrigger />
        </nav>
      </div>
    </header>
  );
}
