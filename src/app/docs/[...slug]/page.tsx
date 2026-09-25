import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BottomNav, TopNav } from "@/components/docs/pager";
import {
  getAdjacentDocs,
  getDocBySlug,
  getDocs,
} from "@/lib/docs";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const OG_IMAGE = absoluteUrl("/opengraph-image");
const OG_IMAGE_SIZE = { width: 1200, height: 630 };

function docUrl(slug: string[]): string {
  return `/docs/${slug.join("/")}`;
}

function docKeywords(title: string, section: string): string[] {
  return [title, `Go ${title}`, section, "Go", "Golang"];
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
  return {
    title: doc.title,
    description: doc.description,
    keywords: docKeywords(doc.title, doc.section),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: doc.title,
      description: doc.description,
      url,
      locale: "en_US",
      section: doc.section,
      images: [{ url: OG_IMAGE, alt: doc.title, ...OG_IMAGE_SIZE }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await loadDoc(slug);
  if (!loaded) notFound();
  const { doc, Content } = loaded;
  const { prev, next } = getAdjacentDocs(doc.slug);
  const url = absoluteUrl(docUrl(doc.slug));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    url,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Docs",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: doc.title,
        item: url,
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <span className="text-slate-400">Docs</span>
          </li>
          <li aria-hidden="true" className="text-slate-300">
            /
          </li>
          <li>
            <span className="text-slate-400">{doc.section}</span>
          </li>
          <li aria-hidden="true" className="text-slate-300">
            /
          </li>
          <li aria-current="page" className="font-medium text-slate-700">
            {doc.title}
          </li>
        </ol>
      </nav>

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

      {/* Bottom expanded prev/next */}
      <BottomNav prev={prev} next={next} />
    </article>
  );
}
