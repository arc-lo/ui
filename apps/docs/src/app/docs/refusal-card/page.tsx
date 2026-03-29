import {
  RefusalCardDemo,
  RefusalCardCustomDemo,
} from "@/components/demos/refusal-card-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function RefusalCardDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>RefusalCard</h1>
      <p>
        Graceful handling of declined AI requests. Shows the reason, categorizes
        by type, and offers alternative prompts — turning rejection into guidance.
      </p>

      <RefusalCardDemo />
      <RefusalCardCustomDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { RefusalCard } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<RefusalCard
  type="safety"
  reason="I can't help with that request."
  suggestions={[
    "Tell me about safety best practices",
    "How does content moderation work?",
  ]}
  onSuggestionClick={(s) => submitPrompt(s)}
/>`}
      />

      <h2>Types</h2>
      <CodeBlock
        lang="tsx"
        code={`{/* Safety — red accent, shield icon */}
<RefusalCard type="safety" />

{/* Capability — amber accent, lightning icon */}
<RefusalCard
  type="capability"
  reason="I can't access external URLs."
/>

{/* Policy — orange accent, clipboard icon */}
<RefusalCard
  type="policy"
  reason="That falls outside my usage policy."
/>

{/* Context — blue accent, search icon */}
<RefusalCard
  type="context"
  reason="I don't have enough context."
/>`}
      />

      <h2>With custom content</h2>
      <CodeBlock
        lang="tsx"
        code={`<RefusalCard type="capability" reason="I can't generate images.">
  <p className="mt-2 text-sm text-gray-500">
    Try using DALL-E or Midjourney for image generation.
  </p>
</RefusalCard>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "type", type: '"safety" | "capability" | "policy" | "context"', default: '"capability"', description: "Refusal category" },
          { name: "reason", type: "string", description: "Why the request was refused" },
          { name: "suggestions", type: "string[]", description: "Alternative prompt suggestions" },
          { name: "onSuggestionClick", type: "(suggestion: string) => void", description: "Called when user clicks a suggestion" },
          { name: "icon", type: "ReactNode", description: "Override default icon" },
        ]}
      />

      <h2>Refusal types</h2>
      <InfoTable
        headers={["Type", "Color", "Icon", "Use case"]}
        rows={[
          { cells: ["safety", "Red", "Shield", "Harmful content requests"] },
          { cells: ["capability", "Amber", "Lightning", "Feature not supported"] },
          { cells: ["policy", "Orange", "Clipboard", "Usage policy violation"] },
          { cells: ["context", "Blue", "Search", "Insufficient information"] },
        ]}
      />
    </article>
  );
}
