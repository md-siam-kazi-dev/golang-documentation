import type { MetadataRoute } from "next";
import { getDocs } from "@/lib/docs";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getDocs();

  const lastModified = docs.reduce(
    (latest, doc) => (doc.lastModified > latest ? doc.lastModified : latest),
    new Date(0),
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  docs.forEach((doc, index) => {
    entries.push({
      url: absoluteUrl(`/docs/${doc.slug.join("/")}`),
      lastModified: doc.lastModified,
      changeFrequency: "monthly",
      priority: index === 0 ? 0.9 : 0.7,
    });
  });

  return entries;
}
