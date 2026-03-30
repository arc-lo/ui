import fs from "fs";
import path from "path";
import { CodingAgentExample } from "@/components/examples/coding-agent-example";
import { ExampleSource } from "@/components/example-source";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/examples/coding-agent-example.tsx"),
  "utf-8",
);

export default function CodingAgentPage() {
  return (
    <article className="max-w-4xl">
      <div className="prose prose-gray mb-6">
        <h1>Coding Agent</h1>
        <p>An agentic coding assistant with chain-of-thought reasoning, tool calls, and code output.</p>
      </div>
      <CodingAgentExample />
      <ExampleSource code={source} />
    </article>
  );
}
