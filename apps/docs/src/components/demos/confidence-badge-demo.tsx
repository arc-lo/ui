"use client";

import { ConfidenceBadge } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const code = `import { ConfidenceBadge } from "@arc-lo/ui";

{/* Badge variant */}
<ConfidenceBadge level="high" />
<ConfidenceBadge level="medium" />
<ConfidenceBadge level="low" />
<ConfidenceBadge level="unknown" />

{/* Dot variant */}
<ConfidenceBadge level="high" variant="dot" />

{/* Inline variant */}
<ConfidenceBadge level="high" variant="inline" />

{/* Custom labels */}
<ConfidenceBadge level="high" label="Verified" />
<ConfidenceBadge level="low" label="Needs review" />`;

export function ConfidenceBadgeDemo() {
  return (
    <DemoWrapper title="ConfidenceBadge — All Variants" code={code}>
      <div className="space-y-8">
        <div>
          <p className="mb-3 text-xs font-medium text-gray-500">Badge (default)</p>
          <div className="flex flex-wrap gap-3">
            <ConfidenceBadge level="high" />
            <ConfidenceBadge level="medium" />
            <ConfidenceBadge level="low" />
            <ConfidenceBadge level="unknown" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-gray-500">Dot</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm">
              <ConfidenceBadge level="high" variant="dot" /> Verified fact
            </span>
            <span className="flex items-center gap-2 text-sm">
              <ConfidenceBadge level="medium" variant="dot" /> Likely correct
            </span>
            <span className="flex items-center gap-2 text-sm">
              <ConfidenceBadge level="low" variant="dot" /> Uncertain
            </span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-gray-500">Inline</p>
          <div className="space-y-2 text-sm">
            <p>
              The earth is approximately 4.5 billion years old.{" "}
              <ConfidenceBadge level="high" variant="inline" />
            </p>
            <p>
              The population of this city is around 2.3 million.{" "}
              <ConfidenceBadge level="medium" variant="inline" label="Approximate" />
            </p>
            <p>
              This feature was likely introduced in version 3.2.{" "}
              <ConfidenceBadge level="low" variant="inline" />
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-gray-500">Custom labels</p>
          <div className="flex flex-wrap gap-3">
            <ConfidenceBadge level="high" label="Verified" />
            <ConfidenceBadge level="medium" label="May be outdated" />
            <ConfidenceBadge level="low" label="Needs review" />
            <ConfidenceBadge level="unknown" label="No data" />
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}
