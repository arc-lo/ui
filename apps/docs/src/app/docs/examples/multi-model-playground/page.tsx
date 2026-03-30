import fs from "fs";
import path from "path";
import { MultiModelPlaygroundExample } from "@/components/examples/multi-model-playground-example";
import { ExampleSource } from "@/components/example-source";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/examples/multi-model-playground-example.tsx"),
  "utf-8",
);

export default function MultiModelPlaygroundPage() {
  return (
    <article className="max-w-4xl">
      <div className="prose prose-gray mb-6">
        <h1>Multi-Model Playground</h1>
        <p>Compare multiple model responses side by side with token usage and feedback scoring.</p>
      </div>
      <MultiModelPlaygroundExample />
      <ExampleSource code={source} />
    </article>
  );
}
