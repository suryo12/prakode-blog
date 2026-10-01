import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>
          © {new Date().getFullYear()} {site.author}
        </span>
        <span>
          <a href={site.aboutUrl}>Portfolio</a> · <a href="/rss.xml">RSS</a>
        </span>
      </div>
    </footer>
  );
}
