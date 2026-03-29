import { MarkdownRendererDemo } from "@/components/demos/markdown-renderer-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function MarkdownRendererDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>MarkdownRenderer</h1>
      <p>
        Streaming-aware markdown renderer that handles headings, bold, italic,
        inline code, code blocks, lists, blockquotes, links, and horizontal rules.
        Designed to work with StreamingText for progressive rendering.
      </p>

      <MarkdownRendererDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { MarkdownRenderer } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<MarkdownRenderer content={markdownString} />`}
      />

      <h2>With StreamingText</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Root stream={stream}>
  <StreamingText.Content
    render={(text) => <MarkdownRenderer content={text} />}
  />
  <StreamingText.Cursor />
</StreamingText.Root>`}
      />

      <h2>Custom code block rendering</h2>
      <CodeBlock
        lang="tsx"
        code={`import { highlight } from "sugar-high";

<MarkdownRenderer
  content={markdown}
  renderCode={(code, lang) => (
    <div className="rounded-xl border bg-gray-50 overflow-hidden">
      {lang && (
        <div className="border-b bg-gray-100 px-4 py-1 text-xs">
          {lang}
        </div>
      )}
      <pre className="p-4 text-sm">
        <code
          dangerouslySetInnerHTML={{
            __html: highlight(code),
          }}
        />
      </pre>
    </div>
  )}
/>`}
      />

      <h2>Supported syntax</h2>
      <InfoTable
        headers={["Element", "Syntax", "Rendered as"]}
        rows={[
          { cells: ["Heading", "# H1, ## H2, ### H3", "<h1>–<h6>"] },
          { cells: ["Bold", "**text**", "<strong>"] },
          { cells: ["Italic", "*text*", "<em>"] },
          { cells: ["Inline code", "`code`", "<code>"] },
          { cells: ["Code block", "```lang\\ncode\\n```", "<pre><code>"] },
          { cells: ["Link", "[text](url)", "<a>"] },
          { cells: ["Unordered list", "- item", "<ul><li>"] },
          { cells: ["Ordered list", "1. item", "<ol><li>"] },
          { cells: ["Blockquote", "> text", "<blockquote>"] },
          { cells: ["Horizontal rule", "---", "<hr>"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "content", type: "string", description: "Markdown text to render (required)" },
          { name: "renderCode", type: "(code: string, lang?: string) => ReactNode", description: "Custom code block renderer" },
        ]}
      />
    </article>
  );
}
