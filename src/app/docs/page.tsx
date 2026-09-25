import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getSectionDocs,
  getShortSection,
  getSidebar,
} from "@/lib/docs";
import { getSectionOverview } from "@/lib/sections";
import { INDEX_ROBOTS, OG_IMAGE, OG_IMAGE_SIZE } from "@/lib/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITLE = `Go Documentation — Browse All Topics`;
const DESCRIPTION = `Browse every section of the ${SITE_NAME} reference: fundamentals, core programming, concurrency, the standard library, testing, HTTP, REST APIs, databases, production and advanced Go.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: "/docs",
    locale: "en_US",
    images: [{ url: OG_IMAGE, alt: TITLE, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: INDEX_ROBOTS,
};

export default function DocsIndexPage() {
  const sections = getSidebar().map((section) => ({
    section,
    docs: getSectionDocs(section.slug),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/docs"),
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sections.length,
      itemListElement: sections.map(({ section }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: getShortSection(section.title),
        url: absoluteUrl(`/docs/${section.slug}`),
      })),
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Go Documentation
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        A structured Go reference, organized into {sections.length} sections.
        Start at the beginning or jump straight to a topic.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map(({ section, docs }) => {
          const overview = getSectionOverview(section.slug, section.title);
          return (
            <Link
              key={section.slug}
              href={`/docs/${section.slug}`}
              className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-700">
                {getShortSection(section.title)}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                {overview.summary}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                {docs.length} topics
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
