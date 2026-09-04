"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { DocsSidebar } from "@/components/docs/sidebar";
import type { SidebarSection } from "@/lib/docs";

export function MobileDocsNav({ sections }: { sections: SidebarSection[] }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open documentation menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Documentation navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <span className="font-semibold text-slate-900">Documentation</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close documentation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50">
          <DocsSidebar sections={sections} onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
