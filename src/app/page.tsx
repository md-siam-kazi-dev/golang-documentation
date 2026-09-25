import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDocs, getSidebar, getSiteTitle } from "@/lib/docs";
import { INDEX_ROBOTS } from "@/lib/seo";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

const HOME_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: INDEX_ROBOTS,
};

export default function Home() {
  const first = getDocs()[0];
  const sections = getSidebar();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="flex items-center gap-2 font-semibold text-slate-900">
            <Image
              src="/favicon.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              priority
            />
            {getSiteTitle()}
          </span>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start reading
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Go Documentation
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Learn Go from first principles to production systems
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A structured, hands-on reference covering fundamentals, concurrency,
            the standard library, REST APIs, databases, and distributed systems —
            one topic at a time.
          </p>
          {first && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/docs/${first.slug.join("/")}`}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Get started with {first.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Browse all sections
              </Link>
            </div>
          )}
        </div>

        <section className="mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Documentation sections
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              return (
                <Link
                  key={section.slug}
                  href={`/docs/${section.slug}`}
                  className="group rounded-lg border border-slate-200 p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <h3 className="font-semibold text-slate-900">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {section.topics.length} topics
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                    Browse section
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
