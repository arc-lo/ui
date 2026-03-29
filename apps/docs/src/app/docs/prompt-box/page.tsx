import {
  PromptBoxBasicDemo,
  PromptBoxFullDemo,
} from "@/components/demos/prompt-box-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function PromptBoxDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>PromptBox</h1>
      <p>
        AI prompt input with auto-growing textarea, context chips, suggestion
        pills, and Enter-to-submit. The primary interface between human intent
        and model output.
      </p>

      <PromptBoxBasicDemo />
      <PromptBoxFullDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { PromptBox } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<PromptBox.Root onSubmit={(value) => sendToAI(value)}>
  <PromptBox.Input />
  <PromptBox.Footer>
    <PromptBox.SubmitButton />
  </PromptBox.Footer>
</PromptBox.Root>`}
      />

      <h2>With chips and suggestions</h2>
      <CodeBlock
        lang="tsx"
        code={`<PromptBox.Root onSubmit={handleSubmit} isSubmitting={loading}>
  <PromptBox.Chips>
    <PromptBox.Chip onRemove={() => removeModel()}>
      GPT-4
    </PromptBox.Chip>
    <PromptBox.Chip onRemove={() => removeFile()}>
      report.pdf
    </PromptBox.Chip>
  </PromptBox.Chips>
  <PromptBox.Input placeholder="Ask about your document..." />
  <PromptBox.Suggestions
    suggestions={[
      "Summarize the key findings",
      "What are the risks?",
      "Compare with last quarter",
    ]}
  />
  <PromptBox.Footer>
    <PromptBox.SubmitButton />
  </PromptBox.Footer>
</PromptBox.Root>`}
      />

      <h2>Controlled value</h2>
      <CodeBlock
        lang="tsx"
        code={`const [prompt, setPrompt] = useState("");

<PromptBox.Root
  value={prompt}
  onValueChange={setPrompt}
  onSubmit={handleSubmit}
>
  <PromptBox.Input />
  <PromptBox.Footer>
    <PromptBox.SubmitButton />
  </PromptBox.Footer>
</PromptBox.Root>`}
      />

      <h2>Parts</h2>
      <InfoTable
        headers={["Part", "Description"]}
        rows={[
          { cells: ["Root", "Form wrapper with context provider"] },
          { cells: ["Input", "Auto-growing textarea (1–8 rows)"] },
          { cells: ["Chips", "Container for context chips above input"] },
          { cells: ["Chip", "Individual removable context chip"] },
          { cells: ["Footer", "Bottom row for submit button and extras"] },
          { cells: ["SubmitButton", "Submit button (disabled when empty or submitting)"] },
          { cells: ["Suggestions", "Contextual suggestion pills"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "value", type: "string", description: "Controlled value" },
          { name: "defaultValue", type: "string", default: '""', description: "Uncontrolled default" },
          { name: "onSubmit", type: "(value: string) => void", description: "Called on submit" },
          { name: "onValueChange", type: "(value: string) => void", description: "Called on change" },
          { name: "isSubmitting", type: "boolean", default: "false", description: "Shows loading state" },
          { name: "disabled", type: "boolean", default: "false", description: "Disables the entire box" },
        ]}
      />
    </article>
  );
}
