"use client";

import { useState } from "react";
import { RefusalCard } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const allTypesCode = `<RefusalCard
  type="safety"
  reason="I can't help with that request for safety reasons."
  suggestions={["Learn about content moderation", "Best practices for safe AI"]}
  onSuggestionClick={(s) => submitPrompt(s)}
/>

<RefusalCard type="capability" reason="I can't access external URLs." />
<RefusalCard type="policy" reason="That falls outside my usage policy." />
<RefusalCard type="context" reason="I don't have enough context." />`;

const customCode = `<RefusalCard type="capability" reason="I can't generate images directly.">
  <div className="mt-3 rounded-md bg-white/60 p-3 text-xs">
    <p className="font-medium mb-1">Alternatives:</p>
    <ul className="list-disc pl-4 space-y-1">
      <li>Use DALL-E or Midjourney for image generation</li>
      <li>I can describe the image you want in detail</li>
      <li>I can write SVG code for simple graphics</li>
    </ul>
  </div>
</RefusalCard>`;

export function RefusalCardDemo() {
  const [lastSuggestion, setLastSuggestion] = useState("");

  return (
    <DemoWrapper title="RefusalCard — All Types" code={allTypesCode}>
      <div className="space-y-4">
        <RefusalCard
          type="safety"
          reason="I can't help with that request for safety reasons."
          suggestions={[
            "Learn about content moderation",
            "Best practices for safe AI",
          ]}
          onSuggestionClick={setLastSuggestion}
        />

        <RefusalCard
          type="capability"
          reason="I can't access external URLs or browse the internet."
          suggestions={[
            "Paste the content directly",
            "Upload the file instead",
          ]}
          onSuggestionClick={setLastSuggestion}
        />

        <RefusalCard
          type="policy"
          reason="That request falls outside my usage policy."
          suggestions={[
            "Rephrase your request",
            "Ask about something else",
          ]}
          onSuggestionClick={setLastSuggestion}
        />

        <RefusalCard
          type="context"
          reason="I don't have enough context to give a good answer. Could you share more details?"
          suggestions={[
            "What specific part do you need help with?",
            "Can you provide an example?",
          ]}
          onSuggestionClick={setLastSuggestion}
        />

        {lastSuggestion && (
          <p className="text-xs text-gray-500">
            Clicked suggestion: &quot;{lastSuggestion}&quot;
          </p>
        )}
      </div>
    </DemoWrapper>
  );
}

export function RefusalCardCustomDemo() {
  return (
    <DemoWrapper title="RefusalCard — Custom Content" code={customCode}>
      <RefusalCard type="capability" reason="I can't generate images directly.">
        <div className="mt-3 rounded-md bg-white/60 p-3 text-xs text-gray-600">
          <p className="font-medium mb-1">Alternatives:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use DALL-E or Midjourney for image generation</li>
            <li>I can describe the image you want in detail</li>
            <li>I can write SVG code for simple graphics</li>
          </ul>
        </div>
      </RefusalCard>
    </DemoWrapper>
  );
}
