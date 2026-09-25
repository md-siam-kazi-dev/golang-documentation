/**
 * Transfers authored markdown content from public/doc into src/content/docs.
 *
 * The SECTIONS config below drives which sidebar section(s) get transferred.
 * Source files in public/doc are authored as one file per concept, following
 * the structure of public/sidebar.json. Authoring conventions handled here:
 *   - A single file covers exactly one sidebar topic; when the sidebar topic
 *     title differs from the source filename (e.g. "Installation & Setup" vs
 *     "Installation and Setup.md", "If / Else" vs "If, Else If, and Else in
 *     Go.md") the mapping entry carries the exact sidebar topic title.
 *   - One file may cover TWO sidebar topics: split it at an H1 marker
 *     ("Variables and Constants.md" → "Variables" + "Constants").
 *   - Two files may cover ONE sidebar topic: merge the second file into the
 *     first and continue its section numbering ("Anonymous Functions in
 *     Go.md" + "Closures in Go.md" → "Anonymous Functions & Closures"). The
 *     second file's intro paragraph (leading prose before its first heading)
 *     and its trailing "## Summary" section are dropped when merging.
 *
 * An authored source file (which may use `#` H1 titles) is converted into a
 * frontmatter .mdx file by lowering the leading H1 to frontmatter `title`,
 * demoting the remaining H1 headings into `##`, and pre-pending frontmatter.
 * Topics without an authored source are left untouched (generated placeholders).
 *
 * Run: bun scripts/transfer-content.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, "public", "doc");
const contentRoot = join(root, "src", "content", "docs");

/**
 * Sections to transfer. `map` lists, per sidebar topic, the authored file(s)
 * that produce it. Extra options:
 *   - splitAt / takeSecondHalf: one file → two topics (split at an H1 line).
 *   - cutAt: processed "## Heading" line where the topic body should stop
 *     (drops that heading and everything after it).
 *   - merge: path of a second authored file appended to this topic, with its
 *     numbered H2 sections renumbered to continue the first part.
 *   - mergeCutAt: processed "## Heading" line where the merged file should
 *     stop (drops that heading and everything after it, e.g. its Summary).
 */
const SECTIONS = [
  {
    title: "Go - Fundamentals",
    map: [
      { file: "Introduction to Go.md", topic: "Introduction to Go" },
      { file: "Installation and Setup.md", topic: "Installation & Setup" },
      { file: "Your First Go Program.md", topic: "Your First Go Program" },
      { file: "Go Program Structure.md", topic: "Go Program Structure" },
      { file: "Variables and Constants.md", topic: "Variables", splitAt: "# Constants" },
      { file: "Variables and Constants.md", topic: "Constants", splitAt: "# Constants", takeSecondHalf: true },
      { file: "Data Types.md", topic: "Data Types" },
      { file: "Type Conversion in Go.md", topic: "Type Conversion" },
      { file: "Operators in Go.md", topic: "Operators" },
      { file: "Input and Output in Go.md", topic: "Input & Output" },
      { file: "If, Else If, and Else in Go.md", topic: "If / Else" },
      { file: "Switch Statements in Go.md", topic: "Switch" },
      { file: "For Loops in Go.md", topic: "For Loops" },
    ],
  },
  {
    title: "Go - Core Programming",
    map: [
      { file: "Functions in Go.md", topic: "Functions" },
      { file: "Multiple Return Values in Go.md", topic: "Multiple Return Values" },
      { file: "Variadic Functions in Go.md", topic: "Variadic Functions" },
      {
        file: "Anonymous Functions in Go.md",
        topic: "Anonymous Functions & Closures",
        cutAt: "## Summary",
        merge: "Closures in Go.md",
        mergeCutAt: "## Summary",
      },
      { file: "Arrays in Go.md", topic: "Arrays" },
      { file: "Slices in Go.md", topic: "Slices" },
      { file: "Strings in Go.md", topic: "Strings" },
      { file: "Runes and Bytes in Go.md", topic: "Runes & Bytes" },
      { file: "Maps in Go.md", topic: "Maps" },
      { file: "Structs in Go.md", topic: "Structs" },
      { file: "Pointers in Go.md", topic: "Pointers" },
      { file: "Methods in Go.md", topic: "Methods" },
      { file: "Packages in Go.md", topic: "Packages" },
      { file: "Go Modules.md", topic: "Go Modules" },
    ],
  },
  {
    title: "Go - Advanced Language Features",
    map: [
      { file: "interface.md", topic: "Interfaces" },
      { file: "empty-interface.md", topic: "Empty Interface" },
      { file: "type-assertion.md", topic: "Type Assertions" },
      { file: "type-switch.md", topic: "Type Switch" },
      { file: "embedding.md", topic: "Embedding" },
      { file: "error-handling.md", topic: "Error Handling" },
      { file: "custom-errors.md", topic: "Custom Error" },
      { file: "01-panic-and-recover.md", topic: "Panic & Recover" },
      { file: "02-defer.md", topic: "Defer" },
      { file: "03-generics.md", topic: "Generics" },
      { file: "04-generic-functions.md", topic: "Generic Functions" },
      { file: "05-generic-types.md", topic: "Generic Types" },
      { file: "06-reflection.md", topic: "Reflection" },
      { file: "07-unsafe-package.md", topic: "The unsafe Package" },
    ],
  },
];

/** Same slugify as sidebar/generator: used for topic->slug. */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Split source markdown in two at an H1 heading line (exclusive). */
function splitSource(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const idx = lines.findIndex((line) => line.trim() === heading);
  if (idx === -1) throw new Error(`Split heading "${heading}" not found`);
  return {
    first: lines.slice(0, idx).join("\n").trim(),
    second: lines.slice(idx).join("\n").trim(),
  };
}

/** Remove an initial H1 and promote any later H1s into H2. */
function demoteH1(markdown) {
  const lines = markdown.split(/\r?\n/);
  const firstH1 = lines.findIndex((line) => /^#\s+\S/.test(line));
  const body = lines.filter((_, i) => i !== firstH1);
  return body
    .map((line) => (line.startsWith("# ") ? `## ${line.slice(2)}` : line))
    .join("\n")
    .trim();
}

/** Read an authored file and return the topic markdown body. */
async function readTopicSource(entry) {
  const source = await readFile(join(sourceDir, entry.file), "utf8");
  const trimmed = source.trim();

  if (!entry.splitAt) return demoteH1(trimmed);

  const { first, second } = splitSource(trimmed, entry.splitAt);
  const part = entry.takeSecondHalf ? second : first;
  return demoteH1(part);
}

/** Drop a processed heading (e.g. "## Summary") and everything after it. */
function cutFromHeading(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const idx = lines.findIndex((line) => line.trim() === heading);
  if (idx === -1) throw new Error(`Cut heading "${heading}" not found`);
  return lines.slice(0, idx).join("\n").trim();
}

/** Highest number used by numbered headings (## 1., ## 2., ...) or 0. */
function lastSectionNumber(markdown) {
  let last = 0;
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(/^#{1,6}\s+(\d+)\.\s+/);
    if (m) last = Math.max(last, Number(m[1]));
  }
  return last;
}

/** Renumber consecutive "## N. Heading" sections starting at `start`. */
function renumberHeadings(markdown, start) {
  let n = start;
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const m = line.match(/^(#{1,6})\s+(\d+)\.\s+(.*)$/);
      if (!m) return line;
      return `${m[1]} ${n++}. ${m[3]}`;
    })
    .join("\n")
    .trim();
}

/** Remove leading intro paragraphs before the first heading. */
function stripIntro(markdown) {
  const lines = markdown.split(/\r?\n/);
  const firstHeading = lines.findIndex((line) => /^#{1,6}\s+/.test(line));
  if (firstHeading === -1) return "";
  return lines.slice(firstHeading).join("\n").trim();
}

/** Assemble a topic body, applying cut/merge transforms when configured. */
async function buildTopicBody(entry) {
  let body = await readTopicSource(entry);

  if (entry.cutAt) {
    body = cutFromHeading(body, entry.cutAt);
  }

  if (entry.merge) {
    const nextNumber = lastSectionNumber(body) + 1;
    let extra = await readTopicSource({ file: entry.merge });
    extra = stripIntro(extra);
    if (entry.mergeCutAt) {
      extra = cutFromHeading(extra, entry.mergeCutAt);
    }
    body = `${body}\n\n${renumberHeadings(extra, nextNumber)}`;
  }

  return body;
}

function frontmatter(sectionTitle, topic, description, order) {
  const title = topic.replaceAll('"', '\\"');
  const desc = description.replaceAll('"', '\\"');
  return [
    "---",
    `title: "${title}"`,
    `description: "${desc}"`,
    `order: ${order}`,
    `section: "${sectionTitle}"`,
    "---",
    "",
  ].join("\n");
}

/** Strip inline markdown (**bold**, `code`, [link](url)) from a description. */
function stripInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/`([^`]*)`/g, "$1") // `code` -> code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* -> italic
    .replace(/_([^_]+)_/g, "$1") // _emphasis_ -> emphasis
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const sidebar = JSON.parse(await readFile(join(root, "public", "sidebar.json"), "utf8"));

  let total = 0;
  for (const section of SECTIONS) {
    const level = sidebar.levels.find((l) => l.title === section.title);
    if (!level) {
      console.warn(`Section "${section.title}" not found in sidebar.json — skipping.`);
      continue;
    }

    const sectionSlug = slugify(section.title);
    const dir = join(contentRoot, sectionSlug);
    await mkdir(dir, { recursive: true });

    let count = 0;
    for (const [order, topic] of Object.values(level.topics).entries()) {
      const entry = section.map.find((e) => e.topic === topic);
      if (!entry) {
        console.warn(`[${section.title}] No source mapped for topic "${topic}" — skipping.`);
        continue;
      }

      const body = await buildTopicBody(entry);
      // Build a human description from the first non-empty paragraph.
      const firstPara = body
        .split(/\r?\n/)
        .find((line) => line.trim() && !line.startsWith("#") && !line.startsWith("```"))
        ?.trim() ?? "";
      const description = stripInlineMarkdown(firstPara).slice(0, 160);

      const filePath = join(dir, `${slugify(topic)}.mdx`);
      const output = [frontmatter(section.title, topic, description, order + 1), body, ""].join("\n");
      await writeFile(filePath, output);
      console.log(`[${section.title}] wrote ${filePath} (${body.length} chars)`);
      count++;
    }
    console.log(`[${section.title}] Transferred ${count} topics.`);
    total += count;
  }
  console.log(`Done. Transferred ${total} topics total.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
