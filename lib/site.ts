export const site = {
  name: "prakode",
  title: "Prakode — Notes by Suryo Prakoso Putra",
  description:
    "Personal blog of Suryo Prakoso Putra: notes on backend engineering, fleet platforms, fintech systems and things learned along the way.",
  url: "https://prakode.site",
  author: "Suryo Prakoso Putra",
  aboutUrl: "https://me.prakode.site",
  language: "en",
};

export const giscus = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Comments",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
};
