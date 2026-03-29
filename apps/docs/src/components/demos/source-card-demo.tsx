"use client";

import { SourceCard } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const fullCode = `import { SourceCard } from "@arclo/react";

<SourceCard
  title="React Server Components"
  url="https://react.dev/reference/rsc/server-components"
  content="Server Components allow you to write UI that can be rendered and optionally cached on the server. They run only on the server and have zero impact on bundle size."
  relevance={0.95}
/>

<SourceCard
  title="Next.js Documentation"
  url="https://nextjs.org/docs"
  content="Next.js is a React framework for building full-stack web applications. You use React Components to build UIs."
  relevance={0.68}
/>

<SourceCard
  title="Webpack Module Federation"
  content="Module Federation allows a JavaScript application to dynamically load code from another application at runtime."
  relevance={0.32}
/>`;

const compactCode = `<SourceCard
  variant="compact"
  title="React Server Components"
  url="https://react.dev/reference/rsc/server-components"
  content="Server Components allow you to write UI..."
  relevance={0.95}
/>`;

export function SourceCardFullDemo() {
  return (
    <DemoWrapper title="SourceCard — Full Variant" code={fullCode}>
      <div className="space-y-3 max-w-lg">
        <SourceCard
          title="React Server Components"
          url="https://react.dev/reference/rsc/server-components"
          content="Server Components allow you to write UI that can be rendered and optionally cached on the server. They run only on the server and have zero impact on bundle size."
          relevance={0.95}
        />
        <SourceCard
          title="Next.js Documentation"
          url="https://nextjs.org/docs"
          content="Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations."
          relevance={0.68}
        />
        <SourceCard
          title="Webpack Module Federation"
          content="Module Federation allows a JavaScript application to dynamically load code from another application at runtime. This enables micro-frontend architectures."
          relevance={0.32}
        />
      </div>
    </DemoWrapper>
  );
}

export function SourceCardCompactDemo() {
  return (
    <DemoWrapper title="SourceCard — Compact Variant" code={compactCode}>
      <div className="space-y-2 max-w-lg">
        <SourceCard
          variant="compact"
          title="React Server Components"
          url="https://react.dev/reference/rsc/server-components"
          content="Server Components allow you to write UI that can be rendered on the server."
          relevance={0.95}
        />
        <SourceCard
          variant="compact"
          title="Next.js Documentation"
          url="https://nextjs.org/docs"
          content="Next.js is a React framework for building full-stack web applications."
          relevance={0.68}
        />
        <SourceCard
          variant="compact"
          title="Webpack Module Federation"
          content="Module Federation allows dynamic code loading from another application."
          relevance={0.32}
        />
      </div>
    </DemoWrapper>
  );
}
