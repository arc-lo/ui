import { CitationInlineDemo } from "@/components/demos/citation-inline-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";

export default function CitationInlineDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>CitationInline</h1>
      <p>
        Inline source attribution with hover preview. Three variants for
        different density needs: superscript, bracket, and pill.
      </p>

      <CitationInlineDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { CitationInline, CitationGroup } from "@arc-lo/ui";`} />

      <h2>Variants</h2>
      <CodeBlock
        lang="tsx"
        code={`{/* Superscript (default) — like academic papers */}
The earth is round
<CitationInline
  index={1}
  href="https://example.com/source"
  sourceTitle="NASA Earth Facts"
  preview="Earth is the third planet from the Sun..."
/>

{/* Bracket — like Wikipedia */}
<CitationInline index={2} variant="bracket" />

{/* Pill — compact colored circle */}
<CitationInline index={3} variant="pill" />`}
      />

      <h2>With hover preview</h2>
      <CodeBlock
        lang="tsx"
        code={`<CitationInline
  index={1}
  href="https://arxiv.org/abs/2301.00001"
  sourceTitle="Attention Is All You Need"
  preview={
    <p>
      We propose a new simple network architecture, the Transformer,
      based solely on attention mechanisms...
    </p>
  }
/>`}
      />

      <h2>Grouping citations</h2>
      <CodeBlock
        lang="tsx"
        code={`This claim is well-supported
<CitationGroup>
  <CitationInline index={1} sourceTitle="Source A" />
  <CitationInline index={2} sourceTitle="Source B" />
  <CitationInline index={3} sourceTitle="Source C" />
</CitationGroup>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "index", type: "number", description: "Citation index number (required)" },
          { name: "href", type: "string", description: "Link URL" },
          { name: "sourceTitle", type: "string", description: "Shown in preview tooltip" },
          { name: "preview", type: "ReactNode", description: "Hover preview content" },
          { name: "variant", type: '"superscript" | "bracket" | "pill"', default: '"superscript"', description: "Display style" },
        ]}
      />
    </article>
  );
}
