import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BottomNav, TopNav } from "@/components/docs/pager";
import {
  getAdjacentDocs,
  getDocBySlug,
  getDocs,
} from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

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
  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await loadDoc(slug);
  if (!loaded) notFound();
  const { doc, Content } = loaded;
  const { prev, next } = getAdjacentDocs(doc.slug);

  return (
    <article>
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
