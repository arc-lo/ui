import { ChatThreadDemo, ChatThreadAvatarDemo } from "@/components/demos/chat-thread-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function ChatThreadDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ChatThread</h1>
      <p>
        The conversation container that ties all arclo components together.
        A compound component for rendering chat UIs with user, assistant,
        and system messages — complete with avatars, timestamps, and
        auto-scrolling.
      </p>

      <ChatThreadDemo />
      <ChatThreadAvatarDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ChatThread } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<ChatThread.Root>
  <ChatThread.Messages>
    <ChatThread.UserMessage name="You">
      Hello!
    </ChatThread.UserMessage>
    <ChatThread.AssistantMessage name="Claude">
      Hi there! How can I help?
    </ChatThread.AssistantMessage>
    <ChatThread.ScrollAnchor />
  </ChatThread.Messages>
</ChatThread.Root>`}
      />

      <h2>With all parts</h2>
      <CodeBlock
        lang="tsx"
        code={`<ChatThread.Root className="h-[600px]">
  <ChatThread.Messages>
    <ChatThread.SystemMessage>
      New conversation started
    </ChatThread.SystemMessage>

    <ChatThread.UserMessage
      name="You"
      timestamp="2:34 PM"
      avatar={<Avatar src="/me.jpg" />}
    >
      Can you analyze this code?
    </ChatThread.UserMessage>

    <ChatThread.AssistantMessage
      name="Claude"
      timestamp="2:34 PM"
      avatar={<ClaudeIcon />}
    >
      <ThinkingBlock.Root state="done">
        <ThinkingBlock.Trigger>Analyzing</ThinkingBlock.Trigger>
        <ThinkingBlock.Content>...</ThinkingBlock.Content>
      </ThinkingBlock.Root>

      <StreamingText.Root stream={stream}>
        <StreamingText.Content />
        <StreamingText.Cursor />
      </StreamingText.Root>

      <FeedbackBar.Root onFeedback={handleFeedback}>
        <FeedbackBar.ThumbsUp />
        <FeedbackBar.ThumbsDown />
        <FeedbackBar.Copy />
      </FeedbackBar.Root>
    </ChatThread.AssistantMessage>

    <ChatThread.ScrollAnchor />
  </ChatThread.Messages>
</ChatThread.Root>`}
      />

      <h2>Using the generic Message</h2>
      <CodeBlock
        lang="tsx"
        code={`// UserMessage, AssistantMessage, SystemMessage are
// convenience wrappers around Message with role pre-set.
<ChatThread.Message role="user" name="You">
  Same as ChatThread.UserMessage
</ChatThread.Message>`}
      />

      <h2>Sub-components</h2>
      <InfoTable
        headers={["Part", "Description"]}
        rows={[
          { cells: ["Root", "Flex column container for the entire thread"] },
          { cells: ["Messages", "Scrollable area that holds all messages"] },
          { cells: ["Message", "Generic message with explicit role prop"] },
          { cells: ["UserMessage", "Right-aligned message with accent background"] },
          { cells: ["AssistantMessage", "Left-aligned message with subtle border"] },
          { cells: ["SystemMessage", "Centered, muted, smaller informational text"] },
          { cells: ["ScrollAnchor", "Auto-scrolls to bottom when new messages arrive"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "children", type: "ReactNode", description: "Thread content (Messages, etc.)" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        title="Messages"
        props={[
          { name: "children", type: "ReactNode", description: "Message components" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        title="Message / UserMessage / AssistantMessage / SystemMessage"
        props={[
          { name: "role", type: '"user" | "assistant" | "system"', description: "Message role (pre-set on convenience wrappers)" },
          { name: "avatar", type: "ReactNode", description: "Avatar element (icon, image, initials)" },
          { name: "name", type: "string", description: "Display name for the author" },
          { name: "timestamp", type: "string", description: "Timestamp string" },
          { name: "children", type: "ReactNode", description: "Message content — any arclo components work here" },
        ]}
      />

      <PropsTable
        title="ScrollAnchor"
        props={[
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />
    </article>
  );
}
