import Image from "next/image";
import Link from "next/link";
import { DocsSidebar } from "@/components/docs/sidebar";
import { MobileDocsNav } from "@/components/docs/mobile-nav";
import { getSidebar, getSiteTitle } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getSidebar();
  return (
    <div className="min-h-screen bg-white">
      {/* Top header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
          <div className="-ml-2 lg:hidden">
            <MobileDocsNav sections={sections} />
          </div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <Image
              src="/favicon.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              priority
            />
            {getSiteTitle()}
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Left sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 border-r border-slate-200 bg-slate-50 lg:block">
          <DocsSidebar sections={sections} />
        </aside>
        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
