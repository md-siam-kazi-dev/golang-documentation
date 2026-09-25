import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { BottomNav, TopNav } from "@/components/docs/pager";
import { RelatedTopics } from "@/components/docs/related-topics";
import {
  getAdjacentDocs,
  getDocBySlug,
  getDocs,
  getShortSection,
} from "@/lib/docs";
import {
  breadcrumbJsonLd,
  getDocBreadcrumbs,
  getRelatedDocs,
  getSeoDescription,
  getSeoKeywords,
  getSeoTitle,
  INDEX_ROBOTS,
  NOINDEX_ROBOTS,
  OG_IMAGE,
  OG_IMAGE_SIZE,
} from "@/lib/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function docUrl(slug: string[]): string {
  return `/docs/${slug.join("/")}`;
}

async function loadDoc(slug: string[]) {
  const doc = getDocBySlug(slug);
  if (!doc) return null;
  try {
    // Import the matching MDX module (compiled by @next/mdx).
    const { default: Content } = await import(`@/content/docs/${doc.file}`);
    return { doc, Content };
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};

  const url = docUrl(doc.slug);
  const title = getSeoTitle(doc);
  const description = getSeoDescription(doc);

  return {
    title,
    description,
    keywords: getSeoKeywords(doc),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_US",
      section: getShortSection(doc.section),
      images: [{ url: OG_IMAGE, alt: title, ...OG_IMAGE_SIZE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: doc.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await loadDoc(slug);
  if (!loaded) notFound();
  const { doc, Content } = loaded;
  const { prev, next } = getAdjacentDocs(doc.slug);
  const related = getRelatedDocs(doc.slug.join("/"));
  const crumbs = getDocBreadcrumbs(doc);

  // Structured data only for pages with real content — placeholder pages are
  // noindexed and shouldn't claim to be articles.
  const articleJsonLd = doc.indexable
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: doc.title,
        description: getSeoDescription(doc),
        url: absoluteUrl(docUrl(doc.slug)),
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
      }
    : null;

  return (
    <article>
      {articleJsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
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

      {/* Top compact prev/next */}
      <TopNav prev={prev} next={next} />

      {/* Page title (frontmatter title as H1) */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {doc.title}
      </h1>

      {/* Rendered MDX */}
      <div className="mt-6">
        <Content />
      </div>

      <RelatedTopics docs={related} currentSection={doc.slug[0]} />

      {/* Bottom expanded prev/next */}
      <BottomNav prev={prev} next={next} />
    </article>
  );
}
