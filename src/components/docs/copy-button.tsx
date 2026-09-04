"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const isDark = tone === "dark";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
      title="Copy code"
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
        isDark
          ? "border-slate-600/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          : "border-slate-300/60 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900"
      }`}
    >
      {copied ? (
        <>
          <Check className={`h-3.5 w-3.5 ${isDark ? "text-green-400" : "text-green-600"}`} />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
