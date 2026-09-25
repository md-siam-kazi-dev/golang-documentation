import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type SidebarTopic = {
  title: string;
  slug: string; // URL slug within the section, e.g. "variables"
};

export type SidebarSection = {
  title: string;
  slug: string; // URL slug for the section folder, e.g. "go-fundamentals"
  topics: SidebarTopic[];
};

export type Doc = {
  /** Full route slug array, e.g. ["go-fundamentals", "variables"]. */
  slug: string[];
  /** Path relative to the content root, e.g. "go-fundamentals/variables.mdx". */
  file: string;
  title: string;
  description: string;
  order: number;
  section: string;
  /** File modification time, used for sitemap `lastModified`. */
  lastModified: Date;
  /** Markdown body without frontmatter. */
  body: string;
  /** True while the page still holds auto-generated placeholder content. */
  isPlaceholder: boolean;
  /** Whether the page should be indexed by search engines. */
  indexable: boolean;
};

const CONTENT_ROOT = join(process.cwd(), "src", "content", "docs");

/**
 * Signatures emitted by scripts/generate-content.mjs. Both variants are
 * covered: even-indexed files carry the intro paragraph, odd-indexed files
 * carry the section body. When a real write-up replaces the placeholder, these
 * disappear and the page becomes indexable again automatically.
 */
const PLACEHOLDER_MARKERS = [
  "placeholder material to get started",
  "fits into everyday Go development. Below is an outline of the key ideas",
];

/** Strips the "Go - " prefix from a section title (e.g. for breadcrumbs). */
export function getShortSection(section: string): string {
  return section.replace(/^Go\s*-\s*/, "");
}

function readSidebarJson() {
  const raw = readFileSync(
    join(process.cwd(), "public", "sidebar.json"),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    title?: string;
    levels: { title: string; topics: Record<string, string> }[];
  };
  return parsed;
}

/** Slugify identical to scripts/generate-content.mjs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readDocFile(file: string): {
  title: string;
  description: string;
  order: number;
  draft: boolean;
  body: string;
} {
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatter: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (kv) frontmatter[kv[1]] = kv[2].replace(/^"|"$/g, "");
    }
  }
  const body = match ? source.slice(match[0].length).trim() : source.trim();
  return {
    title: frontmatter.title ?? "",
    description: frontmatter.description ?? "",
    order: Number(frontmatter.order ?? 0),
    draft: frontmatter.draft === "true",
    body,
  };
}

export const getSiteTitle = cache(() => {
  return readSidebarJson().title ?? "Go Documentation";
});

export const getSidebar = cache((): SidebarSection[] => {
  const sidebar = readSidebarJson();
  const sections: SidebarSection[] = [];

  for (const level of sidebar.levels) {
    const sectionSlug = slugify(level.title);
    const topics = Object.values(level.topics).map((topicTitle) => ({
      title: topicTitle,
      slug: slugify(topicTitle),
    }));
    sections.push({ title: level.title, slug: sectionSlug, topics });
  }
  return sections;
});

export const getDocs = cache((): Doc[] => {
  const sidebar = getSidebar();
  const sectionIndex = new Map(sidebar.map((section, i) => [section.slug, i]));
  const docs: Doc[] = [];

  for (const section of sidebar) {
    const sectionDir = join(CONTENT_ROOT, section.slug);
    for (const topic of section.topics) {
      const filePath = join(sectionDir, `${topic.slug}.mdx`);
      const fm = readDocFile(filePath);
      const isPlaceholder =
        fm.draft ||
        PLACEHOLDER_MARKERS.some((marker) => fm.body.includes(marker));
      docs.push({
        slug: [section.slug, topic.slug],
        file: `${section.slug}/${topic.slug}.mdx`,
        title: fm.title || topic.title,
        description: fm.description,
        order: fm.order,
        section: section.title,
        lastModified: statSync(filePath).mtime,
        body: fm.body,
        isPlaceholder,
        indexable: !isPlaceholder,
      });
    }
  }

  // Sort by (section order, then doc order) to mirror the flattened prev/next chain.
  docs.sort((a, b) => {
    const aSection = sectionIndex.get(a.slug[0]) ?? 0;
    const bSection = sectionIndex.get(b.slug[0]) ?? 0;
    if (aSection !== bSection) return aSection - bSection;
    return a.order - b.order;
  });
  return docs;
});

/** Only pages with real, authored content. */
export const getIndexableDocs = cache((): Doc[] => {
  return getDocs().filter((doc) => doc.indexable);
});

export function getSectionBySlugString(
  sectionSlug: string,
): SidebarSection | undefined {
  return getSidebar().find((section) => section.slug === sectionSlug);
}

/** All docs belonging to one section, in sidebar order. */
export function getSectionDocs(sectionSlug: string): Doc[] {
  return getDocs().filter((doc) => doc.slug[0] === sectionSlug);
}

function docKey(doc: Doc): string {
  return doc.slug.join("/");
}

export function getDocBySlug(slug: string[]): Doc | undefined {
  return getDocs().find(
    (doc) =>
      doc.slug.length === slug.length &&
      doc.slug.every((part, i) => part === slug[i]),
  );
}

export function getDocByKey(key: string): Doc | undefined {
  return getDocs().find((doc) => docKey(doc) === key);
}

/** Returns prev/next docs for navigation, or null at the ends. */
export function getAdjacentDocs(slug: string[]): {
  prev: Doc | null;
  next: Doc | null;
} {
  const docs = getDocs();
  const index = docs.findIndex(
    (doc) =>
      doc.slug.length === slug.length &&
      doc.slug.every((part, i) => part === slug[i]),
  );
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? docs[index - 1] : null,
    next: index < docs.length - 1 ? docs[index + 1] : null,
  };
}

/** Titles shared by more than one page (used to disambiguate SEO titles). */
export const getDuplicateTitles = cache((): Set<string> => {
  const counts = new Map<string, number>();
  for (const doc of getDocs()) {
    counts.set(doc.title, (counts.get(doc.title) ?? 0) + 1);
  }
  return new Set(
    [...counts.entries()].filter(([, count]) => count > 1).map(([t]) => t),
  );
});
