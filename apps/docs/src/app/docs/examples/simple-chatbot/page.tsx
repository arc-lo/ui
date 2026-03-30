import fs from "fs";
import path from "path";
import { SimpleChatbotExample } from "@/components/examples/simple-chatbot-example";
import { ExampleSource } from "@/components/example-source";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/examples/simple-chatbot-example.tsx"),
  "utf-8",
);

export default function SimpleChatbotPage() {
  return (
    <article className="max-w-4xl">
      <div className="prose prose-gray mb-6">
        <h1>Simple Chatbot</h1>
        <p>A conversational AI assistant with streaming responses, suggested prompts, and feedback controls.</p>
      </div>
      <SimpleChatbotExample />
      <ExampleSource code={source} />
    </article>
  );
}
