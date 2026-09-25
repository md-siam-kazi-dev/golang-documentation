import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getShortSection, type Doc } from "@/lib/docs";

/**
 * Contextual links to concepts commonly learned alongside this page.
 * Curated cross-links first, then same-section siblings.
 */
export function RelatedTopics({
  docs,
  currentSection,
}: {
  docs: Doc[];
  currentSection: string;
}) {
  if (docs.length === 0) return null;

  return (
    <nav
      aria-label="Related topics"
      className="mt-12 border-t border-slate-200 pt-8"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        Related Topics
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {docs.map((doc) => (
          <li key={doc.slug.join("/")}>
            <Link
              href={`/docs/${doc.slug.join("/")}`}
              className="group flex items-start justify-between gap-2 rounded-lg border border-slate-200 p-3 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="min-w-0">
                <span className="block font-medium text-slate-900">
                  {doc.title}
                </span>
                {doc.slug[0] !== currentSection && (
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {getShortSection(doc.section)}
                  </span>
                )}
              </span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
