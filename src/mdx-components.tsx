import type { ReactElement, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { CopyButton } from "@/components/docs/copy-button";

type MdxProps = Record<string, unknown>;

/** Terminal-style languages get a dark header + dark body. */
const TERMINAL_LANGS = new Set(["bash", "sh", "shell", "zsh", "powershell", "console", "terminal"]);
const OUTPUT_LANGS = new Set(["text", "txt", "output"]);

// --- Lightweight Go syntax highlighting (VS Code Dark+ palette) ---
const GO_TOKEN_RE =
  /(\/\/.*)|("(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*')|(\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?\b)|(\b(?:package|import|func|var|const|type|struct|interface|map|chan|go|defer|return|if|else|for|range|switch|case|default|break|continue|fallthrough|select|goto|nil|true|false|iota)\b)|(\b(?:bool|string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|byte|rune|float32|float64|complex64|complex128|error|any|comparable)\b)|([+\-*/%&|^<>=!]+)|([A-Za-z_][A-Za-z0-9_]*)/g;

const GO_COLORS = {
  comment: { color: "#6A9955", fontStyle: "italic" },
  string: { color: "#CE9178" },
  number: { color: "#B5CEA8" },
  keyword: { color: "#569CD6" },
  type: { color: "#4EC9B0" },
  operator: { color: "#dcdcaa" },
  variable: { color: "#9CDCFE" },
} as const;

/** Tokenize one Go code string into colored spans (variables/values/signs). */
function highlightGo(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  const lines = code.split("\n");

  for (let l = 0; l < lines.length; l++) {
    if (l > 0) out.push("\n");
    const line = lines[l];
    GO_TOKEN_RE.lastIndex = 0;
    let last = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = GO_TOKEN_RE.exec(line))) {
      const full = match[0];
      if (match.index > last) out.push(line.slice(last, match.index));

      let style: { color: string; fontStyle?: string } | undefined;
      if (match[1]) style = GO_COLORS.comment;        // // comment
      else if (match[2]) style = GO_COLORS.string;    // "string" `raw` 'rune'
      else if (match[3]) style = GO_COLORS.number;    // 21 / 3.14
      else if (match[4]) style = GO_COLORS.keyword;   // func, var, if...
      else if (match[5]) style = GO_COLORS.type;      // int, string, error...
      else if (match[6]) style = GO_COLORS.operator;  // := = + >= && ...
      else if (match[7]) {
        // Identifier: treat as a variable when followed by := or = (a sign).
        const rest = line.slice(match.index + full.length);
        style = /^\s*:=(?!=)|^\s*=(?![=<>~])/.test(rest) ? GO_COLORS.variable : undefined;
      }

      if (style) {
        out.push(
          <span key={`${l}-${key}`} style={style}>
            {full}
          </span>,
        );
      } else {
        out.push(full);
      }
      key++;
      last = match.index + full.length;
    }
    if (last < line.length) out.push(line.slice(last));
  }
  return out;
}

/** Extract the language from a code element's className="language-x". */
function getLanguage(children: ReactNode): string {
  const child = Array.isArray(children) ? children[0] : children;
  if (child && typeof child === "object" && "props" in child) {
    const props = (child as ReactElement<{ className?: string }>).props;
    const match = props.className?.match(/language-([\w-]+)/);
    if (match) return match[1];
  }
  return "";
}

/** Pull the raw text content out of a code block (for the copy button). */
function getCodeText(children: ReactNode): string {
  const child = Array.isArray(children) ? children[0] : children;
  if (child && typeof child === "object" && "props" in child) {
    const props = (child as ReactElement<{ children?: ReactNode }>).props;
    return extractText(props.children);
  }
  return extractText(children);
}

function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

/** Full code block: a header bar (language + copy) above the scrollable pre. */
function CodeBlock({ children, ...rest }: { children?: ReactNode } & MdxProps) {
  const language = getLanguage(children ?? null);
  const code = getCodeText(children ?? null);

  const isGo = language === "go";
  const isTerminal = TERMINAL_LANGS.has(language);
  const isText = OUTPUT_LANGS.has(language) || !language;

  // VS Code–style dark editor header label.
  const headerLabel = isGo ? "main.go" : isTerminal ? "Terminal" : isText ? "Output" : language;

  const bodyClass = isGo
    ? "bg-[#1e1e1e] text-[#d4d4d4]"
    : isTerminal
      ? "bg-slate-950 text-green-400"
      : "bg-white text-slate-800";

  const headerClass = isGo
    ? "bg-[#252526] text-[#cccccc]"
    : isTerminal
      ? "bg-slate-800 text-slate-200"
      : "border-b border-slate-200 bg-slate-100 text-slate-600";

  const copyTone = isGo || isTerminal ? "dark" : "light";

  return (
    <div className="group/code my-6 overflow-hidden rounded-lg border border-slate-200">
      {/* Header bar */}
      <div className={`flex items-center justify-between gap-3 px-4 py-2 ${headerClass}`}>
        <span
          className={`flex items-center gap-2 text-xs font-medium tracking-wider ${
            isGo ? "" : "uppercase"
          }`}
        >
          {isGo && (
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
          )}
          {isTerminal && (
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </span>
          )}
          {headerLabel}
        </span>
        <CopyButton text={code} tone={copyTone} />
      </div>

      {/* Code body */}
      <pre
        {...rest}
        className={`overflow-x-auto p-4 font-mono text-sm leading-6 ${bodyClass}`}
      >
        {isGo ? highlightGo(code) : children}
      </pre>
    </div>
  );
}

const components = {
  a: (props: MdxProps) => <a {...props} className="text-indigo-600 underline-offset-4 hover:underline" />,
  h1: (props: MdxProps) => <h1 {...props} className="scroll-m-20 text-3xl font-bold tracking-tight text-slate-900" />,
  h2: (props: MdxProps) => <h2 {...props} className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight text-slate-900" />,
  h3: (props: MdxProps) => <h3 {...props} className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-slate-900" />,
  h4: (props: MdxProps) => <h4 {...props} className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight text-slate-900" />,
  p: (props: MdxProps) => <p {...props} className="leading-7 text-slate-700 [&:not(:first-child)]:mt-5" />,
  ul: (props: MdxProps) => <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />,
  ol: (props: MdxProps) => <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />,
  li: (props: MdxProps) => <li {...props} className="leading-7 text-slate-700" />,
  blockquote: (props: MdxProps) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-indigo-600 pl-6 italic text-slate-700"
    />
  ),
  // Inline code (single backticks) — no language-* class.
  code: (props: MdxProps) => {
    const isBlock = typeof props.className === "string" && /language-/.test(props.className);
    if (isBlock) {
      // Inside a fenced block: the <pre> wrapper owns all chrome/background.
      return <code {...props} className="font-mono text-[0.875em]" />;
    }
    return (
      <code
        {...props}
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.875em] text-slate-900"
      />
    );
  },
  // Fenced code blocks.
  pre: (props: MdxProps) => <CodeBlock {...props} />,
  table: (props: MdxProps) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-left text-sm" />
    </div>
  ),
  thead: (props: MdxProps) => <thead {...props} className="border-b border-slate-200" />,
  tbody: (props: MdxProps) => <tbody {...props} className="divide-y divide-slate-200" />,
  th: (props: MdxProps) => (
    <th {...props} className="px-3 py-2 font-semibold text-slate-900" />
  ),
  td: (props: MdxProps) => <td {...props} className="px-3 py-2 text-slate-700" />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
