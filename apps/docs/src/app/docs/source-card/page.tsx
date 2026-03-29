import {
  SourceCardFullDemo,
  SourceCardCompactDemo,
} from "@/components/demos/source-card-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function SourceCardDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>SourceCard</h1>
      <p>
        RAG retrieval result card showing source title, content preview,
        relevance score, and optional link. Available in full and compact
        variants for different layout needs.
      </p>

      <SourceCardFullDemo />
      <SourceCardCompactDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { SourceCard } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<SourceCard
  title="React Server Components"
  url="https://react.dev/reference/rsc/server-components"
  content="Server Components allow you to write UI that can be rendered on the server."
  relevance={0.95}
/>

{/* Compact variant */}
<SourceCard
  variant="compact"
  title="React Documentation"
  url="https://react.dev"
  content="The library for web and native user interfaces."
  relevance={0.72}
/>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "title", type: "string", description: "Source document title (required)" },
          { name: "url", type: "string", description: "Link to the source" },
          { name: "content", type: "string", description: "Preview text content (required)" },
          { name: "relevance", type: "number", description: "Relevance score from 0 to 1 (required)" },
          { name: "variant", type: '"compact" | "full"', default: '"full"', description: "Display variant" },
        ]}
      />

      <h2>Relevance levels</h2>
      <InfoTable
        headers={["Range", "Color", "Label"]}
        rows={[
          { cells: ["0.8 - 1.0", "Emerald", "High"] },
          { cells: ["0.5 - 0.79", "Amber", "Medium"] },
          { cells: ["0 - 0.49", "Red", "Low"] },
        ]}
      />
    </article>
  );
}
