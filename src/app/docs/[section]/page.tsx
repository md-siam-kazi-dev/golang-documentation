import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  getSectionBySlugString,
  getSectionDocs,
  getShortSection,
  getSidebar,
} from "@/lib/docs";
import { getSectionOverview } from "@/lib/sections";
import {
  breadcrumbJsonLd,
  getSectionBreadcrumbs,
  getSeoDescription,
  INDEX_ROBOTS,
  NOINDEX_ROBOTS,
  OG_IMAGE,
  OG_IMAGE_SIZE,
  WEBSITE_ID,
} from "@/lib/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ section: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { section: string }[] {
  return getSidebar().map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlugString(sectionSlug);
  if (!section) return {};

  const overview = getSectionOverview(section.slug, section.title);
  const docs = getSectionDocs(section.slug);
  const indexable = docs.some((doc) => doc.indexable);
  const url = `/docs/${section.slug}`;

  return {
    title: overview.title,
    description: overview.summary,
    keywords: [getShortSection(section.title), `Go ${getShortSection(section.title)}`, "Go", "Golang"],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: overview.title,
      description: overview.summary,
      url,
      locale: "en_US",
      images: [{ url: OG_IMAGE, alt: overview.title, ...OG_IMAGE_SIZE }],
    },
    twitter: {
      card: "summary_large_image",
      title: overview.title,
      description: overview.summary,
      images: [OG_IMAGE],
    },
    robots: indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlugString(sectionSlug);
  if (!section) notFound();

  const overview = getSectionOverview(section.slug, section.title);
  const docs = getSectionDocs(section.slug);
  const indexable = docs.some((doc) => doc.indexable);
  const crumbs = getSectionBreadcrumbs(section.slug, section.title);

  const sections = getSidebar();
  const index = sections.findIndex((s) => s.slug === section.slug);
  const prevSection = index > 0 ? sections[index - 1] : null;
  const nextSection = index < sections.length - 1 ? sections[index + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: overview.title,
    description: overview.summary,
    url: absoluteUrl(`/docs/${section.slug}`),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: docs.length,
      itemListElement: docs.map((doc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: doc.title,
        url: absoluteUrl(`/docs/${doc.slug.join("/")}`),
      })),
    },
  };

  return (
    <article>
      {indexable && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd(crumbs)).replace(
                /</g,
                "\\u003c",
              ),
            }}
          />
        </>
      )}

      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {overview.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">{overview.summary}</p>

      {overview.outcomes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            What you&apos;ll learn
          </h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {overview.outcomes.map((outcome) => (
              <li key={outcome} className="leading-7 text-slate-700">
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Topics in this section ({docs.length})
        </h2>
        <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
          {docs.map((doc) => (
            <li key={doc.slug.join("/")}>
              <Link
                href={`/docs/${doc.slug.join("/")}`}
                className="group flex items-baseline justify-between gap-4 py-3"
              >
                <span className="min-w-0">
                  <span className="font-medium text-slate-900 transition-colors group-hover:text-indigo-700">
                    {doc.title}
                  </span>
                  {!doc.isPlaceholder && (
                    <span className="mt-1 block text-sm text-slate-500">
                      {getSeoDescription(doc, 130)}
                    </span>
                  )}
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="Section navigation"
        className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2"
      >
        {prevSection ? (
          <Link
            href={`/docs/${prevSection.slug}`}
            className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Previous section
            </span>
            <span className="mt-2 block font-semibold text-slate-900">
              {getShortSection(prevSection.title)}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextSection ? (
          <Link
            href={`/docs/${nextSection.slug}`}
            className="group rounded-lg border border-slate-200 p-4 text-right transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            <span className="flex items-center justify-end gap-1.5 text-sm font-medium text-slate-500">
              Next section
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-2 block font-semibold text-slate-900">
              {getShortSection(nextSection.title)}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
