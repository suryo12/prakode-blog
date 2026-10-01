import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="footer-note">
          Thanks for reading. If something here helped, or I got it wrong, I&apos;d
          love to hear it in the comments.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <a href={site.aboutUrl}>Portfolio</a>
          <a href="/rss.xml">RSS</a>
        </nav>
        <p className="footer-copy">
          © {new Date().getFullYear()} {site.author}
        </p>
      </div>
    </footer>
  );
}
