import { TokenUsageDemo } from "@/components/demos/token-usage-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";

export default function TokenUsageDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>TokenUsage</h1>
      <p>
        Visual token and cost meter showing input tokens, output tokens, and
        total usage against a maximum budget. The bar color shifts from blue to
        amber to red as usage increases.
      </p>

      <TokenUsageDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { TokenUsage } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<TokenUsage
  inputTokens={4200}
  outputTokens={1800}
  maxTokens={8192}
/>

{/* With cost */}
<TokenUsage
  inputTokens={12000}
  outputTokens={8500}
  maxTokens={32000}
  cost={0.0312}
/>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "inputTokens", type: "number", description: "Number of input tokens used (required)" },
          { name: "outputTokens", type: "number", description: "Number of output tokens used (required)" },
          { name: "maxTokens", type: "number", description: "Maximum token budget (required)" },
          { name: "cost", type: "number", description: "Cost in dollars" },
        ]}
      />
    </article>
  );
}
