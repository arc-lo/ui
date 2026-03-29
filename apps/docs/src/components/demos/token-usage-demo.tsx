"use client";

import { TokenUsage } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const code = `import { TokenUsage } from "@arc-lo/ui";

{/* Low usage */}
<TokenUsage
  inputTokens={1200}
  outputTokens={800}
  maxTokens={8192}
/>

{/* Medium usage */}
<TokenUsage
  inputTokens={12000}
  outputTokens={8500}
  maxTokens={32000}
  cost={0.0312}
/>

{/* High usage */}
<TokenUsage
  inputTokens={85000}
  outputTokens={42000}
  maxTokens={128000}
  cost={0.1845}
/>`;

export function TokenUsageDemo() {
  return (
    <DemoWrapper title="TokenUsage — Usage Levels" code={code}>
      <div className="space-y-4 max-w-md">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Low usage</p>
          <TokenUsage
            inputTokens={1200}
            outputTokens={800}
            maxTokens={8192}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Medium usage (with cost)
          </p>
          <TokenUsage
            inputTokens={12000}
            outputTokens={8500}
            maxTokens={32000}
            cost={0.0312}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            High usage (with cost)
          </p>
          <TokenUsage
            inputTokens={85000}
            outputTokens={42000}
            maxTokens={128000}
            cost={0.1845}
          />
        </div>
      </div>
    </DemoWrapper>
  );
}
