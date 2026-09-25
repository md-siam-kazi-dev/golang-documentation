import type { MetadataRoute } from "next";
import { getDocs, getSectionDocs, getSidebar } from "@/lib/docs";
import { absoluteUrl } from "@/lib/site";

function latest(dates: Date[]): Date {
  return dates.reduce((a, b) => (b > a ? b : a), new Date(0));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getDocs();
  const sidebar = getSidebar();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latest(docs.map((doc) => doc.lastModified)),
    },
    {
      url: absoluteUrl("/docs"),
      lastModified: latest(docs.map((doc) => doc.lastModified)),
    },
  ];

  // Section hub pages, but only once the section has real content.
  for (const section of sidebar) {
    const sectionDocs = getSectionDocs(section.slug);
    if (!sectionDocs.some((doc) => doc.indexable)) continue;
    entries.push({
      url: absoluteUrl(`/docs/${section.slug}`),
      lastModified: latest(sectionDocs.map((doc) => doc.lastModified)),
    });
  }

  // Canonical, indexable documentation pages only. Placeholder pages are
  // noindexed, so they are deliberately excluded.
  for (const doc of docs) {
    if (!doc.indexable) continue;
    entries.push({
      url: absoluteUrl(`/docs/${doc.slug.join("/")}`),
      lastModified: doc.lastModified,
    });
  }

  return entries;
}
