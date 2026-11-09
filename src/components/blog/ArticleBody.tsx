import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import type { Root } from "mdast";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { cn } from "@/lib/utils";

const ALLOWED_TAGS = new Set(defaultSchema.tagNames);

// Text like Promise<T> parses as an HTML tag and would disappear when
// sanitized, so anything that isn't a tag we allow is shown as written.
function keepUnknownTagsAsText() {
  return (tree: Root) => {
    visit(tree, "html", (node) => {
      const tag = /^<\/?([a-z][\w-]*)/i.exec(node.value)?.[1]?.toLowerCase();
      if (tag && !ALLOWED_TAGS.has(tag)) Object.assign(node, { type: "text" });
    });
  };
}

const LINK_CLASS = "text-accent hover:underline";

const components: Components = {
  h1: ({ children }) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">{children}</h2>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-semibold mt-5 mb-2 text-foreground">{children}</h4>,
  p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="my-4 ml-6 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 ml-6 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="text-foreground/90 leading-relaxed mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-2 border-accent/40 text-muted italic">{children}</blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-4 p-4 rounded-lg bg-surface border border-border overflow-x-auto [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children }) => (
    <code className={cn("text-sm text-foreground/90 font-mono rounded bg-surface px-1.5 py-0.5", className)}>
      {children}
    </code>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") && !href.startsWith("//") ? (
      <Link href={href} className={LINK_CLASS}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {children}
      </a>
    ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-border px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
};

/** Renders a post written in Markdown, HTML or a mix of both, with unsafe HTML removed. */
export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl">
      <Markdown
        remarkPlugins={[remarkGfm, keepUnknownTagsAsText]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
