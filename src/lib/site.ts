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

/** Canonical production origin, used when no environment override is present. */
const PRODUCTION_SITE_URL = "https://golangdocumentation.vercel.app";

/**
 * Resolves the canonical origin for the site.
 *
 * Priority: explicit `NEXT_PUBLIC_SITE_URL` override, then the Vercel
 * production domain, then the known production origin. Preview deployment URLs
 * (`VERCEL_URL`) are deliberately excluded so previews canonicalize to
 * production instead of self-canonicalizing.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/\/+$/, "")}`;

  return PRODUCTION_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

/** Builds a fully-qualified URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
