import fs from "fs";
import path from "path";
import { ResearchAssistantExample } from "@/components/examples/research-assistant-example";
import { ExampleSource } from "@/components/example-source";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/examples/research-assistant-example.tsx"),
  "utf-8",
);

export default function ResearchAssistantPage() {
  return (
    <article className="max-w-4xl">
      <div className="prose prose-gray mb-6">
        <h1>Research Assistant</h1>
        <p>RAG-powered assistant that retrieves sources, shows inline citations, and displays confidence levels.</p>
      </div>
      <ResearchAssistantExample />
      <ExampleSource code={source} />
    </article>
  );
}
