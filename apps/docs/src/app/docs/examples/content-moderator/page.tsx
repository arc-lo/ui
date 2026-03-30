import fs from "fs";
import path from "path";
import { ContentModeratorExample } from "@/components/examples/content-moderator-example";
import { ExampleSource } from "@/components/example-source";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/examples/content-moderator-example.tsx"),
  "utf-8",
);

export default function ContentModeratorPage() {
  return (
    <article className="max-w-4xl">
      <div className="prose prose-gray mb-6">
        <h1>Content Moderator</h1>
        <p>A safety-focused interface where the AI classifies content and gracefully handles refusals.</p>
      </div>
      <ContentModeratorExample />
      <ExampleSource code={source} />
    </article>
  );
}
