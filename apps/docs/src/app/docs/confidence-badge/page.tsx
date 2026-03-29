import { ConfidenceBadgeDemo } from "@/components/demos/confidence-badge-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function ConfidenceBadgeDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ConfidenceBadge</h1>
      <p>
        Visual indicator for AI confidence levels. Available as a colored badge,
        a minimal dot, or inline text. The visual language for &quot;I&apos;m confident,&quot;
        &quot;I&apos;m uncertain,&quot; and &quot;you should verify this.&quot;
      </p>

      <ConfidenceBadgeDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ConfidenceBadge } from "@arc-lo/ui";`} />

      <h2>Variants</h2>
      <CodeBlock
        lang="tsx"
        code={`{/* Full badge with dot + label */}
<ConfidenceBadge level="high" />
<ConfidenceBadge level="medium" />
<ConfidenceBadge level="low" />
<ConfidenceBadge level="unknown" />

{/* Minimal dot */}
<ConfidenceBadge level="high" variant="dot" />

{/* Inline text */}
<ConfidenceBadge level="low" variant="inline" />`}
      />

      <h2>Custom labels</h2>
      <CodeBlock
        lang="tsx"
        code={`<ConfidenceBadge level="high" label="Verified" />
<ConfidenceBadge level="low" label="May be outdated" />`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "level", type: '"high" | "medium" | "low" | "unknown"', description: "Confidence level (required)" },
          { name: "variant", type: '"badge" | "dot" | "inline"', default: '"badge"', description: "Visual variant" },
          { name: "label", type: "string", description: "Override default label text" },
        ]}
      />

      <h2>Levels</h2>
      <InfoTable
        headers={["Level", "Color", "Default label"]}
        rows={[
          { cells: ["high", "Emerald", "High confidence"] },
          { cells: ["medium", "Amber", "Medium confidence"] },
          { cells: ["low", "Red", "Low confidence"] },
          { cells: ["unknown", "Gray", "Confidence unknown"] },
        ]}
      />
    </article>
  );
}
