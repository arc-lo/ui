import {
  SuggestTopicsDemo,
  SuggestTopicsCompactDemo,
  SuggestTopicsMinimalDemo,
} from "@/components/demos/suggest-topics-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function SuggestTopicsDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>SuggestTopics</h1>
      <p>
        Starter prompt cards for empty chat states. The first thing users see
        when opening a new conversation — contextual suggestions that help them
        get started.
      </p>

      <SuggestTopicsDemo />
      <SuggestTopicsCompactDemo />
      <SuggestTopicsMinimalDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { SuggestTopics, TopicCard } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<SuggestTopics columns={2}>
  <TopicCard
    icon="✍️"
    title="Help me write a blog post"
    description="About AI design systems"
    onSelect={(title) => setPrompt(title)}
  />
  <TopicCard
    icon="🔍"
    title="Explain how transformers work"
    onSelect={(title) => setPrompt(title)}
  />
</SuggestTopics>`}
      />

      <h2>With ChatThread</h2>
      <CodeBlock
        lang="tsx"
        code={`function Chat() {
  const [messages, setMessages] = useState([]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h2 className="text-xl font-semibold">How can I help you?</h2>
        <SuggestTopics columns={2}>
          <TopicCard
            icon="✍️"
            title="Help me write"
            onSelect={(title) => sendMessage(title)}
          />
          <TopicCard
            icon="🔍"
            title="Research a topic"
            onSelect={(title) => sendMessage(title)}
          />
        </SuggestTopics>
      </div>
    );
  }

  return (
    <ChatThread.Root>
      <ChatThread.Messages>
        {messages.map(msg => (
          <ChatThread.Message key={msg.id} role={msg.role}>
            {msg.content}
          </ChatThread.Message>
        ))}
      </ChatThread.Messages>
    </ChatThread.Root>
  );
}`}
      />

      <h2>Parts</h2>
      <InfoTable
        headers={["Component", "Description"]}
        rows={[
          { cells: ["SuggestTopics", "Grid container with responsive columns"] },
          { cells: ["TopicCard", "Individual suggestion card with icon, title, description"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="SuggestTopics"
        props={[
          { name: "columns", type: "1 | 2 | 3", default: "2", description: "Number of grid columns (responsive)" },
        ]}
      />
      <PropsTable
        title="TopicCard"
        props={[
          { name: "title", type: "string", description: "Card title / prompt text (required)" },
          { name: "description", type: "string", description: "Optional subtitle" },
          { name: "icon", type: "ReactNode", description: "Optional icon (emoji, SVG, etc.)" },
          { name: "onSelect", type: "(title: string) => void", description: "Called when card is clicked" },
        ]}
      />
    </article>
  );
}
