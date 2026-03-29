"use client";

import { useState } from "react";
import { ConversationBranch } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const basicCode = `<ConversationBranch
  current={current}
  total={5}
  onPrevious={() => setCurrent((c) => c - 1)}
  onNext={() => setCurrent((c) => c + 1)}
/>`;

export function ConversationBranchDemo() {
  const [current, setCurrent] = useState(2);
  const total = 5;

  return (
    <DemoWrapper title="ConversationBranch — Interactive" code={basicCode}>
      <div className="flex items-center gap-4">
        <ConversationBranch
          current={current}
          total={total}
          onPrevious={() => setCurrent((c) => Math.max(1, c - 1))}
          onNext={() => setCurrent((c) => Math.min(total, c + 1))}
        />
        <span className="text-xs text-gray-400">
          Navigate between {total} conversation branches
        </span>
      </div>
    </DemoWrapper>
  );
}

export function ConversationBranchBoundaryDemo() {
  return (
    <DemoWrapper title="ConversationBranch — Boundary States" code={`<ConversationBranch current={1} total={1} />`}>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <ConversationBranch current={1} total={3} />
          <span className="text-[10px] text-gray-400">At start</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ConversationBranch current={2} total={3} />
          <span className="text-[10px] text-gray-400">Middle</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ConversationBranch current={3} total={3} />
          <span className="text-[10px] text-gray-400">At end</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ConversationBranch current={1} total={1} />
          <span className="text-[10px] text-gray-400">Single</span>
        </div>
      </div>
    </DemoWrapper>
  );
}
