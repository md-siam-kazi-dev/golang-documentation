# Product Requirements Document (PRD)
## Documentation Website — Next.js + MDX

**Version:** 1.0
**Status:** Draft
**Owner:** [Your Name]
**Last Updated:** September 3, 2026

---

## 1. Overview

### 1.1 Purpose
Build a fast, SEO-optimized documentation website using Next.js. Content is authored in Markdown/MDX and stored directly in the codebase (git-based, no CMS/database). UI components are built with shadcn/ui. The site uses a single light theme only.

### 1.2 Goals
- Excellent SEO performance via static site generation (SSG)
- Simple, git-based content authoring workflow (no backend, no database)
- Clean, accessible, consistent UI using shadcn/ui components
- Easy page-to-page navigation via Previous/Next controls at both the top and bottom of each doc page

### 1.3 Non-Goals
- No dark mode / theme switcher (light theme only, by explicit requirement)
- No headless CMS or database-backed content in v1
- No user authentication or gated content in v1
- No multi-language (i18n) support in v1 (can be considered later)

---

## 2. Target Users

| User Type | Need |
|---|---|
| Developers reading docs | Fast page loads, clear navigation, good search, readable content |
| Content authors / maintainers | Easy to add/edit docs via Markdown files and PRs, no CMS login needed |
| Search engines / SEO crawlers | Fully rendered static HTML, proper meta tags, sitemap, structured navigation |

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | SSG via `generateStaticParams`, ISR optional later |
| Content format | Markdown / MDX (`.md` / `.mdx`) | Stored in-repo under `/content/docs` |
| Content parsing | `contentlayer2` (or `next-mdx-remote` + `gray-matter`) | Parses frontmatter + MDX into typed data at build time |
| UI components | shadcn/ui (Radix + Tailwind CSS) | Buttons, nav, cards, sidebar, breadcrumbs, search dialog |
| Styling | Tailwind CSS | Light theme only, custom color tokens (see §6) |
| Syntax highlighting | `rehype-pretty-code` or `shiki` | Code blocks in docs |
| Search | `flexsearch` or `pagefind` (static, client-side) | No backend search service needed |
| Deployment | Vercel (or any static/Node host) | Static export or standard Next.js build |
| Icons | `lucide-react` | Pairs natively with shadcn/ui |

---

## 4. Content Architecture

### 4.1 Storage
All documentation content lives in the repository as `.md` / `.mdx` files — no database, no backend API.

```
/content
  /docs
    /getting-started
      index.mdx
      installation.mdx
      configuration.mdx
    /guides
      routing.mdx
      deployment.mdx
    /api-reference
      overview.mdx
      endpoints.mdx
  meta.json          # defines sidebar order/grouping per section
```

### 4.2 Frontmatter Schema
Each `.mdx` file starts with YAML frontmatter:

```yaml
---
title: "Installation"
description: "How to install and set up the project."
order: 2
section: "Getting Started"
slug: "getting-started/installation"
---
```

| Field | Type | Required | Purpose |
|---|---|---|---|
| `title` | string | Yes | Page `<title>` and H1 |
| `description` | string | Yes | Meta description for SEO |
| `order` | number | Yes | Sort order within section (drives Prev/Next) |
| `section` | string | Yes | Sidebar grouping label |
| `slug` | string | Yes | URL path |

### 4.3 Navigation Order (for Prev/Next)
- Doc order is derived from `meta.json` per section + `order` field within each file.
- Build step generates a **flattened, ordered list** of all doc pages at build time.
- Each page's Prev/Next targets are computed by index position (`i-1`, `i+1`) in that flattened list.
- If a page is first in the list → Previous button is hidden/disabled.
- If a page is last in the list → Next button is hidden/disabled.

### 4.4 Routing
- App Router dynamic segment: `/app/docs/[...slug]/page.tsx`
- `generateStaticParams()` reads all content files and pre-renders every doc page at build time.
- `generateMetadata()` reads frontmatter to output per-page `<title>`, `<meta description>`, Open Graph tags, and canonical URL.

---

## 5. Core Features

### 5.1 Documentation Page Layout
- **Left sidebar**: collapsible tree navigation grouped by section, current page highlighted
- **Main content area**: rendered MDX content (max readable width, e.g. `~720px`)
- **Right sidebar (optional, v1.1)**: "On this page" table of contents (auto-generated from headings)
- **Top of page**: breadcrumb + Previous/Next navigation bar
- **Bottom of page**: Previous/Next navigation cards (larger, with page titles + direction labels)

### 5.2 Previous / Next Navigation (Explicit Requirement)
Two instances per doc page:

**Top navigation (compact):**
- Positioned directly above/near the page title or breadcrumb
- Small button pair: `← Previous` / `Next →`
- Built with shadcn/ui `Button` (`variant="ghost"` or `variant="outline"`, `size="sm"`)

**Bottom navigation (expanded):**
- Positioned at the end of the article content, above the footer
- Two-column card layout: left card = Previous page (with title + description), right card = Next page
- Built with shadcn/ui `Card` + `Button`, using `lucide-react` `ArrowLeft` / `ArrowRight` icons

Behavior:
- Both nav instances use the same computed prev/next data (single source of truth, no duplicate logic)
- Disabled/hidden state at the start and end of the doc sequence
- Fully keyboard-navigable and accessible (proper `aria-label`s: "Previous: Installation", "Next: Configuration")

### 5.3 Search
- Static, client-side search index generated at build time (e.g. `pagefind` — indexes the built HTML directly, works great with SSG)
- Triggered via shadcn/ui `Command` (`cmdk`-based) dialog, keyboard shortcut `⌘K` / `Ctrl K`

### 5.4 Sidebar Navigation
- Built with shadcn/ui primitives (`Accordion` or custom tree using `Collapsible`)
- Auto-generated from `meta.json` + frontmatter — no manual link maintenance
- Active route highlighting

### 5.5 Code Blocks
- Syntax highlighting via `shiki`/`rehype-pretty-code`
- Copy-to-clipboard button on each code block (shadcn/ui `Button` + `lucide-react` `Copy`/`Check` icons)

### 5.6 SEO Requirements
- Per-page `<title>` and `<meta description>` from frontmatter
- `sitemap.xml` auto-generated (`app/sitemap.ts`) from all content routes
- `robots.txt` configured
- Open Graph + Twitter card meta tags per page
- Semantic HTML (proper heading hierarchy from MDX)
- Canonical URLs
- Fast Core Web Vitals via SSG (no client-side data fetching for content)

---

## 6. Design System

### 6.1 Theme
- **Light theme only** — no dark mode toggle, no `prefers-color-scheme` switching in v1
- Built on shadcn/ui + Tailwind CSS design tokens (CSS variables), just with a single fixed light palette

### 6.2 Suggested Color Palette

A clean, neutral, developer-docs-friendly palette with one accent color for links/active states/buttons.

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#0F172A` (slate-900) | Primary text |
| `--muted` | `#F1F5F9` (slate-100) | Sidebar background, code block background |
| `--muted-foreground` | `#64748B` (slate-500) | Secondary text, descriptions |
| `--border` | `#E2E8F0` (slate-200) | Dividers, card borders |
| `--primary` | `#4F46E5` (indigo-600) | Links, active nav item, primary buttons |
| `--primary-foreground` | `#FFFFFF` | Text on primary buttons |
| `--accent` | `#EEF2FF` (indigo-50) | Hover states, active sidebar item background |
| `--card` | `#FFFFFF` | Card backgrounds (Prev/Next cards) |
| `--destructive` | `#DC2626` (red-600) | Error/warning callouts only |
| `--success` | `#16A34A` (green-600) | Success callouts only |

This maps cleanly onto shadcn/ui's default CSS variable structure (`globals.css`) — just fix the values and remove/ignore the `.dark` class block entirely so no dark variant ships.

### 6.3 Typography
- Font: `Inter` or `Geist Sans` (system fallback stack)
- Monospace (code): `Geist Mono` or `JetBrains Mono`
- Base body size: `16px`, line-height `1.7` for readability

---

## 7. Page Inventory (v1)

| Page | Route | Notes |
|---|---|---|
| Home / Landing | `/` | Hero, intro, CTA to docs |
| Docs index | `/docs` | Redirects or shows first doc page |
| Doc content pages | `/docs/[...slug]` | Dynamic, generated from `/content/docs` |
| 404 | `/not-found` | Custom styled 404 with link back to docs |

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Lighthouse Performance | 95+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 95+ |
| Build type | Fully static (SSG); ISR optional if content needs to update without full rebuild |
| Browser support | Latest 2 versions of major browsers |
| Responsive | Mobile, tablet, desktop breakpoints (sidebar collapses to drawer on mobile) |

---

## 9. Content Authoring Workflow

1. Author creates/edits `.mdx` file under `/content/docs/...`
2. Adds required frontmatter (`title`, `description`, `order`, `section`, `slug`)
3. Opens PR → preview deployment (e.g. Vercel preview) generated automatically
4. Reviewer checks rendered preview, including Prev/Next order
5. Merge → production build regenerates static pages, sitemap, and search index

---

## 10. Milestones

| Phase | Scope |
|---|---|
| M1 — Foundation | Next.js + Tailwind + shadcn/ui setup, light theme tokens, MDX pipeline working |
| M2 — Content Structure | Frontmatter schema, sidebar generation, dynamic routing, flattened doc order |
| M3 — Navigation | Top + bottom Previous/Next components, breadcrumbs, TOC |
| M4 — Search & Polish | Static search index, code block copy button, 404 page |
| M5 — SEO & Launch | Sitemap, robots.txt, OG tags, Lighthouse audit, deploy |

---

## 11. Open Questions

- Do we need versioned docs (e.g. `v1`, `v2`) in the future, or is this always a single current version?
- Should the right-side "on this page" TOC be included in v1 or deferred to v1.1?
- Any analytics requirement (e.g. Plausible, Vercel Analytics) for tracking which doc pages are most visited?