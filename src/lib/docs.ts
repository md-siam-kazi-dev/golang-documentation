import { readFileSync } from "node:fs";
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
};

const CONTENT_ROOT = join(process.cwd(), "src", "content", "docs");

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

function readFrontmatter(file: string): {
  title: string;
  description: string;
  order: number;
} {
  const source = readFileSync(file, "utf8");
  const match = source.match(
    /^---\r?\n([\s\S]*?)\r?\n---/,
  );
  const frontmatter: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (kv) frontmatter[kv[1]] = kv[2].replace(/^"|"$/g, "");
    }
  }
  return {
    title: frontmatter.title ?? "",
    description: frontmatter.description ?? "",
    order: Number(frontmatter.order ?? 0),
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
  const docs: Doc[] = [];
  for (const section of getSidebar()) {
    const sectionDir = join(CONTENT_ROOT, section.slug);
    for (const topic of section.topics) {
      const filePath = join(sectionDir, `${topic.slug}.mdx`);
      const fm = readFrontmatter(filePath);
      docs.push({
        slug: [section.slug, topic.slug],
        file: `${section.slug}/${topic.slug}.mdx`,
        title: fm.title || topic.title,
        description: fm.description,
        order: fm.order,
        section: section.title,
      });
    }
  }
  // Sort by (section order, then doc order) to mirror the flattened prev/next chain.
  docs.sort((a, b) => {
    const aSection = getSidebar().findIndex((s) => s.slug === a.slug[0]);
    const bSection = getSidebar().findIndex((s) => s.slug === b.slug[0]);
    if (aSection !== bSection) return aSection - bSection;
    return a.order - b.order;
  });
  return docs;
});

export function getDocBySlug(slug: string[]): Doc | undefined {
  return getDocs().find(
    (doc) =>
      doc.slug.length === slug.length &&
      doc.slug.every((part, i) => part === slug[i]),
  );
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

/** Find which section a given slug belongs to (for sidebar highlight). */
export function getSectionBySlug(slug: string[]): SidebarSection | undefined {
  const sectionSlug = slug[0];
  return getSidebar().find((section) => section.slug === sectionSlug);
}
