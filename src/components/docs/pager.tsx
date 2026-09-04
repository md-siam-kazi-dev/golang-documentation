import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Doc } from "@/lib/docs";

function hrefFor(doc: Doc): string {
  return `/docs/${doc.slug.join("/")}`;
}

/** Compact Previous/Next pair shown at the top of a doc page. */
export function TopNav({ prev, next }: { prev: Doc | null; next: Doc | null }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b pb-4">
      {prev ? (
        <Link
          href={hrefFor(prev)}
          aria-label={`Previous: ${prev.title}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={hrefFor(next)}
          aria-label={`Next: ${next.title}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

/** Expanded Previous/Next cards shown at the bottom of a doc page. */
export function BottomNav({ prev, next }: { prev: Doc | null; next: Doc | null }) {
  return (
    <div className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={hrefFor(prev)}
          aria-label={`Previous: ${prev.title}`}
          className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="mt-2 block font-semibold text-slate-900">{prev.title}</span>
          <span className="mt-1 line-clamp-2 block text-sm text-slate-500">
            {prev.description}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={hrefFor(next)}
          aria-label={`Next: ${next.title}`}
          className="group rounded-lg border border-slate-200 p-4 text-right transition-colors hover:border-indigo-300 hover:bg-indigo-50"
        >
          <span className="flex items-center justify-end gap-1.5 text-sm font-medium text-slate-500">
            Next
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 block font-semibold text-slate-900">{next.title}</span>
          <span className="mt-1 line-clamp-2 block text-sm text-slate-500">
            {next.description}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
