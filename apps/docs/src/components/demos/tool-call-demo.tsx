"use client";

import { useState, useCallback } from "react";
import { ToolCall } from "@arc-lo/ui";
import type { ToolCallStatus } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const liveCode = `<ToolCall.Root toolName="web_search" status={status} defaultOpen>
  <ToolCall.Header />
  <ToolCall.Input>
    {JSON.stringify({ query: "latest React 19 features" }, null, 2)}
  </ToolCall.Input>
  <ToolCall.Output>
    {JSON.stringify(results, null, 2)}
  </ToolCall.Output>
</ToolCall.Root>`;

const multiCode = `<div className="space-y-3">
  <ToolCall.Root toolName="read_file" status="success">
    <ToolCall.Header>
      <p className="text-xs text-gray-500">src/config.ts</p>
    </ToolCall.Header>
    <ToolCall.Input>{input}</ToolCall.Input>
    <ToolCall.Output>{output}</ToolCall.Output>
  </ToolCall.Root>

  <ToolCall.Root toolName="execute_code" status="running">
    <ToolCall.Header>
      <p className="text-xs text-gray-500">Running tests...</p>
    </ToolCall.Header>
  </ToolCall.Root>
</div>`;

export function ToolCallDemo() {
  const [status, setStatus] = useState<ToolCallStatus>("success");

  const simulate = useCallback(() => {
    setStatus("pending");
    setTimeout(() => setStatus("running"), 500);
    setTimeout(() => setStatus("success"), 2500);
  }, []);

  const simulateError = useCallback(() => {
    setStatus("pending");
    setTimeout(() => setStatus("running"), 500);
    setTimeout(() => setStatus("error"), 2000);
  }, []);

  return (
    <DemoWrapper title="ToolCall — Live Demo" code={liveCode}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={simulate}
            className="rounded-full bg-[#6C5CE7] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
          >
            Simulate success
          </button>
          <button
            onClick={simulateError}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            Simulate error
          </button>
        </div>

        <ToolCall.Root toolName="web_search" status={status} defaultOpen>
          <ToolCall.Header />
          <ToolCall.Input>
            {`{\n  "query": "latest React 19 features",\n  "max_results": 5\n}`}
          </ToolCall.Input>
          <ToolCall.Output>
            {status === "success"
              ? `[\n  {\n    "title": "React 19 Release Notes",\n    "url": "https://react.dev/blog/react-19",\n    "snippet": "React 19 introduces Actions, use() hook, and document metadata support..."\n  }\n]`
              : `Error: Request timeout after 30000ms`}
          </ToolCall.Output>
        </ToolCall.Root>
      </div>
    </DemoWrapper>
  );
}

export function ToolCallMultiDemo() {
  return (
    <DemoWrapper title="ToolCall — Multiple Tools" code={multiCode}>
      <div className="space-y-3">
        <ToolCall.Root toolName="read_file" status="success">
          <ToolCall.Header>
            <p className="text-xs text-gray-500 mt-0.5">src/config.ts</p>
          </ToolCall.Header>
          <ToolCall.Input>
            {`{ "path": "src/config.ts" }`}
          </ToolCall.Input>
          <ToolCall.Output>
            {`export const config = {\n  apiUrl: "https://api.example.com",\n  timeout: 5000\n}`}
          </ToolCall.Output>
        </ToolCall.Root>

        <ToolCall.Root toolName="execute_code" status="running">
          <ToolCall.Header>
            <p className="text-xs text-gray-500 mt-0.5">Running tests...</p>
          </ToolCall.Header>
        </ToolCall.Root>

        <ToolCall.Root toolName="create_file" status="pending">
          <ToolCall.Header>
            <p className="text-xs text-gray-500 mt-0.5">Waiting for previous step</p>
          </ToolCall.Header>
        </ToolCall.Root>
      </div>
    </DemoWrapper>
  );
}
