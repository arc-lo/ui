import {
  FeedbackBarDemo,
  FeedbackBarMinimalDemo,
} from "@/components/demos/feedback-bar-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function FeedbackBarDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>FeedbackBar</h1>
      <p>
        Response action toolbar with thumbs up/down feedback, copy to clipboard,
        and regenerate. The primary mechanism for users to signal response quality.
      </p>

      <FeedbackBarDemo />
      <FeedbackBarMinimalDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { FeedbackBar } from "@arclo/react";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<FeedbackBar.Root onFeedback={(value) => trackFeedback(value)}>
  <FeedbackBar.ThumbsUp />
  <FeedbackBar.ThumbsDown />
  <FeedbackBar.Copy text={responseText} />
  <FeedbackBar.Regenerate onRegenerate={() => regenerate()} />
</FeedbackBar.Root>`}
      />

      <h2>Default (no children)</h2>
      <CodeBlock
        lang="tsx"
        code={`{/* Renders ThumbsUp + ThumbsDown + Copy */}
<FeedbackBar.Root onFeedback={handleFeedback} />`}
      />

      <h2>With StreamingText</h2>
      <CodeBlock
        lang="tsx"
        code={`<StreamingText.Root stream={stream}>
  <StreamingText.Content />
  <StreamingText.Cursor />
  <StreamingText.Toolbar>
    <FeedbackBar.Root onFeedback={handleFeedback}>
      <FeedbackBar.ThumbsUp />
      <FeedbackBar.ThumbsDown />
      <FeedbackBar.Copy />
      <FeedbackBar.Regenerate onRegenerate={regenerate} />
    </FeedbackBar.Root>
  </StreamingText.Toolbar>
</StreamingText.Root>`}
      />

      <h2>Parts</h2>
      <InfoTable
        headers={["Part", "Description"]}
        rows={[
          { cells: ["Root", "Toolbar container with feedback state"] },
          { cells: ["ThumbsUp", "Toggle positive feedback"] },
          { cells: ["ThumbsDown", "Toggle negative feedback"] },
          { cells: ["Copy", "Copy text to clipboard with checkmark confirmation"] },
          { cells: ["Regenerate", "Trigger response regeneration"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "onFeedback", type: '(value: "up" | "down" | null) => void', description: "Called when feedback changes" },
        ]}
      />
    </article>
  );
}
