import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <p className="mono eyebrow">&gt; 404</p>
      <h1 className="serif">Page not found</h1>
      <p className="muted">
        That page doesn&apos;t exist (or moved). <Link href="/">Go home →</Link>
      </p>
    </section>
  );
}
