/**
 * Generates demo .mdx content files under content/docs from public/sidebar.json.
 *
 * Run: bun scripts/generate-content.mjs
 * Regenerating is safe: existing files are overwritten only if the file content changes.
 */
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sidebarPath = join(root, "public", "sidebar.json");
const contentRoot = join(root, "src", "content", "docs");

/** Slugify a section title: lowercase, non-alnum -> "-", collapse dashes, trim. */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Write a demo MDX file for a topic. */
async function writeTopicMdx(dir, fileIndex, sectionTitle, topicTitle, demoBody) {
  const slug = slugify(topicTitle);
  const body = [
    "---",
    `title: "${topicTitle.replaceAll('"', '\\"')}"`,
    `description: "Learn about ${topicTitle.toLowerCase()} in Go."`,
    `order: ${fileIndex}`,
    `section: "${sectionTitle.replaceAll('"', '\\"')}"`,
    `slug: "${slug}"`,
    "draft: true",
    "---",
    "",
    demoBody.trim(),
    "",
  ].join("\n");
  const filePath = join(dir, `${slug}.mdx`);
  const existing = await readFile(filePath, "utf8").catch(() => null);
  if (existing !== body) {
    await writeFile(filePath, body);
    console.log(`wrote ${filePath}`);
  }
}

function introParagraph(topicTitle) {
  return `${topicTitle} is a core concept in Go. This page explains what it is, why it matters, and how to apply it in your programs. The content below is placeholder material to get started — replace it with the full write-up.`;
}

function sectionBodyLines(topicTitle) {
  return [
    `## Overview`,
    ``,
    `${topicTitle} fits into everyday Go development. Below is an outline of the key ideas and a small, runnable example.`,
    ``,
    `## Key Concepts`,
    ``,
    `- Understand the core idea behind ${topicTitle.toLowerCase()}.`,
    `- Learn the syntax and idiomatic patterns Go provides.`,
    `- See how it composes with the rest of the language.`,
    `- Know the common pitfalls and how to avoid them.`,
    ``,
    `## Example`,
    ``,
    `\`\`\`go`,
    `package main`,
    ``,
    `import "fmt"`,
    ``,
    `func main() {`,
    `\tfmt.Println("Hello from ${topicTitle}")`,
    `}`,
    `\`\`\``,
    ``,
    `## Next Steps`,
    ``,
    `- Experiment with the example and change parts of it to build intuition.`,
    `- Review related topics in the sidebar for adjacent material.`,
    `- Practice by applying ${topicTitle.toLowerCase()} to a small project.`,
    ``,
  ].join("\n");
}

async function main() {
  const sidebar = JSON.parse(await readFile(sidebarPath, "utf8"));
  const seen = new Set();

  for (const level of sidebar.levels) {
    const sectionSlug = slugify(level.title);
    const dir = join(contentRoot, sectionSlug);

    // Clean topic files that no longer exist in the sidebar.
    const existingFiles = await readdir(dir).catch(() => []);
    // Ensure the section directory exists before writing topic files.
    await mkdir(dir, { recursive: true });
    const wantedNames = new Set();
    for (const [fileIndex, topicTitle] of Object.values(level.topics).entries()) {
      const topicSlug = slugify(topicTitle);
      const safe = `${sectionSlug}/${topicSlug}`;
      if (seen.has(safe)) {
        console.warn(`duplicate slug, skipping: ${safe}`);
        continue;
      }
      seen.add(safe);
      wantedNames.add(`${topicSlug}.mdx`);
      const demoBody =
        fileIndex % 2 === 0
          ? [introParagraph(topicTitle), "", sectionBodyLines(topicTitle)].join("\n")
          : sectionBodyLines(topicTitle);
      await writeTopicMdx(dir, fileIndex + 1, level.title, topicTitle, demoBody);
    }
    for (const file of existingFiles) {
      if (!wantedNames.has(file) && file.endsWith(".mdx")) {
        await unlink(join(dir, file));
        console.log(`removed stale ${join(dir, file)}`);
      }
    }
  }

  console.log("Done generating content.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
