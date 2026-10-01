"use client";

import Giscus from "@giscus/react";
import { giscus } from "@/lib/site";

export default function Comments({ term }: { term: string }) {
  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) return null;

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="serif">
        Join the conversation
      </h2>
      <p className="comments-note">
        Questions, corrections or your own experience — all welcome. Comments
        use GitHub Discussions, so you&apos;ll sign in with GitHub.
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
        theme="noborder_light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
