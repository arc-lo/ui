import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

/* ─── Types ───────────────────────────────────────────────────────── */

interface ParsedBlock {
  type: "paragraph" | "heading" | "code" | "list" | "blockquote" | "hr";
  content: string;
  level?: number; // heading level
  lang?: string; // code language
  items?: string[]; // list items
  ordered?: boolean;
}

/* ─── Parser ──────────────────────────────────────────────────────── */

function parseMarkdown(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: "hr", content: "" });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        content: headingMatch[2],
        level: headingMatch[1].length,
      });
      i++;
      continue;
    }

    // Fenced code block
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      const lang = codeMatch[1] || undefined;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: "code",
        content: codeLines.join("\n"),
        lang,
      });
      i++; // skip closing ```
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") });
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ""));
        i++;
      }
      blocks.push({ type: "list", content: "", items, ordered: false });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push({ type: "list", content: "", items, ordered: true });
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", content: paraLines.join("\n") });
    }
  }

  return blocks;
}

/* ─── Inline formatting ───────────────────────────────────────────── */

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Process bold, italic, code, and links
  const regex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <em key={match.index} className="italic">
          {match[4]}
        </em>,
      );
    } else if (match[5]) {
      // Inline code
      parts.push(
        <code
          key={match.index}
          className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.85em] font-mono text-gray-800"
        >
          {match[6]}
        </code>,
      );
    } else if (match[7]) {
      // Link
      parts.push(
        <a
          key={match.index}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6C5CE7] underline underline-offset-2 hover:text-[#5A4BD1]"
        >
          {match[8]}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/* ─── Component ───────────────────────────────────────────────────── */

export interface MarkdownRendererProps extends HTMLAttributes<HTMLDivElement> {
  /** Markdown text to render */
  content: string;
  /** Custom code block renderer */
  renderCode?: (code: string, lang?: string) => ReactNode;
}

export const MarkdownRenderer = forwardRef<
  HTMLDivElement,
  MarkdownRendererProps
>(({ content, renderCode, className, ...props }, ref) => {
  const blocks = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div
      ref={ref}
      className={cn(
        "arclo-markdown space-y-4 text-sm leading-relaxed text-gray-700",
        className,
      )}
      {...props}
    >
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
            return (
              <Tag
                key={i}
                className={cn(
                  "font-semibold text-gray-900",
                  block.level === 1 && "text-2xl",
                  block.level === 2 && "text-xl",
                  block.level === 3 && "text-lg",
                  (block.level ?? 4) >= 4 && "text-base",
                )}
              >
                {renderInline(block.content)}
              </Tag>
            );
          }

          case "paragraph":
            return (
              <p key={i}>{renderInline(block.content)}</p>
            );

          case "code":
            if (renderCode) {
              return (
                <div key={i}>{renderCode(block.content, block.lang)}</div>
              );
            }
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                {block.lang && (
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    {block.lang}
                  </div>
                )}
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
                  <code className="font-mono text-gray-800">
                    {block.content}
                  </code>
                </pre>
              </div>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={cn(
                  "space-y-1 pl-6",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items?.map((item, j) => (
                  <li key={j} className="text-gray-700">
                    {renderInline(item)}
                  </li>
                ))}
              </Tag>
            );
          }

          case "blockquote":
            return (
              <blockquote
                key={i}
                className="border-l-3 border-gray-300 pl-4 text-gray-500 italic"
              >
                {renderInline(block.content)}
              </blockquote>
            );

          case "hr":
            return <hr key={i} className="border-gray-200" />;

          default:
            return null;
        }
      })}
    </div>
  );
});
MarkdownRenderer.displayName = "MarkdownRenderer";
