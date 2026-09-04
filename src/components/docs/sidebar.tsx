"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarSection } from "@/lib/docs";

export function DocsSidebar({
  sections,
  onNavigate,
}: {
  sections: SidebarSection[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeKey = pathname.replace(/^\/docs\//, "");

  return (
    <nav aria-label="Documentation" className="flex h-full flex-col gap-1 overflow-y-auto py-6 pr-4">
      {sections.map((section) => (
        <div key={section.slug} className="mb-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {section.title}
          </p>
          <ul className="space-y-1 border-l border-slate-200">
            {section.topics.map((topic) => {
              const href = `/docs/${section.slug}/${topic.slug}`;
              const isActive = activeKey === `${section.slug}/${topic.slug}`;
              return (
                <li key={topic.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={`block border-l-2 px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-700"
                        : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {topic.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
