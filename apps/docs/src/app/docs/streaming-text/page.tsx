import {
  StreamingTextBasicDemo,
  StreamingTextStatesDemo,
} from "@/components/demos/streaming-text-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function StreamingTextDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>StreamingText</h1>
      <p>
        Token-by-token text rendering for AI responses. Handles the full
        lifecycle: pending, streaming, done, interrupted, error, and ratelimit.
      </p>

      <StreamingTextBasicDemo />
      <StreamingTextStatesDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { StreamingText } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Root stream={readableStream} speed={30}>
  <StreamingText.Content />
  <StreamingText.Cursor />
</StreamingText.Root>`}
      />

      <h2>With all parts</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Root
  stream={stream}
  speed={30}
  chunkSize="char"
  onDone={(text) => console.log("Done:", text)}
  onError={(err) => console.error(err)}
  onInterrupt={(partial) => console.log("Stopped at:", partial)}
>
  <StreamingText.Skeleton lines={3} />
  <StreamingText.Content />
  <StreamingText.Cursor char="▋" />
  <StreamingText.Stop>Stop generating</StreamingText.Stop>
  <StreamingText.ErrorFallback
    message="Something went wrong."
    onRetry={() => refetch()}
  />
  <StreamingText.RateLimit
    message="Rate limit reached."
    retryAfter={30}
  />
  <StreamingText.Toolbar>
    {/* FeedbackBar or custom buttons */}
  </StreamingText.Toolbar>
</StreamingText.Root>`}
      />

      <h2>With plain text (no stream)</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Root text="Hello, this will animate in." speed={25}>
  <StreamingText.Content />
  <StreamingText.Cursor />
</StreamingText.Root>`}
      />

      <h2>Custom rendering</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Content
  render={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
/>`}
      />

      <h2>Using the hook directly</h2>
      <CodeBlock
        lang="tsx"
        code={`import { useStreamingText } from "@arclo/react";

function CustomStreaming({ stream }) {
  const { displayedText, state, interrupt, skipAnimation } =
    useStreamingText({ stream, speed: 30 });

  return (
    <div>
      <p>{displayedText}</p>
      {state === "streaming" && (
        <button onClick={interrupt}>Stop</button>
      )}
      <button onClick={skipAnimation}>Skip animation</button>
    </div>
  );
}`}
      />

      <h2>States</h2>
      <InfoTable
        headers={["State", "Description", "Visible parts"]}
        rows={[
          { cells: ["pending", "Waiting for first token", "Skeleton, Cursor"] },
          { cells: ["streaming", "Tokens arriving", "Content, Cursor, Stop"] },
          { cells: ["done", "Stream complete", "Content, Toolbar"] },
          { cells: ["interrupted", "User stopped generation", "Content, Toolbar"] },
          { cells: ["error", "Network or model failure", "ErrorFallback"] },
          { cells: ["ratelimit", "Rate limit hit", "RateLimit"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "stream", type: "ReadableStream<string>", description: "Stream of text chunks" },
          { name: "text", type: "string", description: "Plain text (alternative to stream)" },
          { name: "speed", type: "number", default: "30", description: "Delay in ms between chunks" },
          { name: "chunkSize", type: '"char" | "word" | "line"', default: '"char"', description: "How to split text for animation" },
          { name: "onDone", type: "(text: string) => void", description: "Called when streaming completes" },
          { name: "onError", type: "(error: Error) => void", description: "Called on error" },
          { name: "onInterrupt", type: "(partialText: string) => void", description: "Called when user interrupts" },
        ]}
      />
    </article>
  );
}
