import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getShortSection, getSiteTitle, getSidebar } from "@/lib/docs";

// Next.js already marks 404 responses as `noindex`; no explicit robots here so
// the page doesn't emit two conflicting robots meta tags.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  const sections = getSidebar();

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-4 py-20">
        <p className="flex items-center gap-2 font-semibold text-slate-900">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          {getSiteTitle()}
        </p>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          That page doesn&apos;t exist or may have moved. Every topic is
          reachable from the documentation index below.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Browse all documentation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Go to homepage
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Documentation sections
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/docs/${section.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700">
                    {getShortSection(section.title)}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
