"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { giscus } from "@/lib/site";

export default function Comments({ term }: { term: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
    const onChange = (e: Event) =>
      setTheme((e as CustomEvent<"light" | "dark">).detail);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) return null;

  return (
    <section className="comments" aria-label="Comments">
      <h2>Comments</h2>
      <p className="muted small">
        Comments are powered by GitHub Discussions — sign in with GitHub to
        join the conversation.
      </p>
      <Giscus
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="specific"
        term={term}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
