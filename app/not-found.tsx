import Link from "next/link";
import { SearchTrigger } from "@/components/Search";

export default function NotFound() {
  return (
    <section className="hero">
      <p className="eyebrow">404</p>
      <h1 className="serif">That page wandered off.</h1>
      <p className="lead">
        It may have moved or never existed. Try searching, or head back to the
        start.
      </p>
      <div className="hero-actions">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
        <Link href="/blog" className="btn btn-quiet">
          Browse the blog
        </Link>
      </div>
      <SearchTrigger large />
    </section>
  );
}
