export const SITE_NAME = "Golang Documentation";

export const SITE_TAGLINE =
  "Learn Go from first principles to production systems";

export const SITE_DESCRIPTION =
  "A structured Go programming guide — fundamentals, concurrency, the standard library, REST APIs, databases, and production systems.";

export const SITE_KEYWORDS = [
  "Go",
  "Golang",
  "Go Documentation",
  "Golang Documentation",
  "Go Doc",
  "Golang Doc",
  "Go Tutorial",
  "Golang Tutorial",
  "Go programming language",
  "learn Go",
  "Go examples",
];

/**
 * Resolves the canonical origin for the site.
 *
 * Priority: explicit `NEXT_PUBLIC_SITE_URL` override, then the Vercel
 * production/preview domain, then localhost for local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** Builds a fully-qualified URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
