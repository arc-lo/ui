import {
  CodeBlockBasicDemo,
  CodeBlockLineNumbersDemo,
  CodeBlockScrollDemo,
} from "@/components/demos/code-block-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";

export default function CodeBlockDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>CodeBlock</h1>
      <p>
        A styled code container with a language badge, copy-to-clipboard button,
        optional line numbers, and scrollable overflow. Designed for displaying
        code snippets in AI chat UIs.
      </p>

      <CodeBlockBasicDemo />
      <CodeBlockLineNumbersDemo />
      <CodeBlockScrollDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { CodeBlock } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<CodeBlock
  language="typescript"
  code={\`const x = 42;
console.log(x);\`}
/>`}
      />

      <h2>With line numbers</h2>
      <CodeBlock
        lang="tsx"
        code={`<CodeBlock
  language="python"
  showLineNumbers
  code={pythonCode}
/>`}
      />

      <h2>Custom max height</h2>
      <CodeBlock
        lang="tsx"
        code={`<CodeBlock
  language="json"
  maxHeight="200px"
  code={longJsonString}
/>`}
      />

      <h2>With copy callback</h2>
      <CodeBlock
        lang="tsx"
        code={`<CodeBlock
  code={snippet}
  onCopy={() => toast("Copied!")}
/>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "code", type: "string", description: "The code string to display (required)" },
          { name: "language", type: "string", description: "Language label shown in the header" },
          { name: "showLineNumbers", type: "boolean", default: "false", description: "Show line numbers" },
          { name: "maxHeight", type: "string", default: '"400px"', description: "Max height before scrolling" },
          { name: "onCopy", type: "() => void", description: "Called when copy button is clicked" },
        ]}
      />
    </article>
  );
}
