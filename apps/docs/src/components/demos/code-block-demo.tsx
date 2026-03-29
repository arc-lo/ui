"use client";

import { CodeBlock } from "@arclo/react";
import { DemoWrapper } from "../demo-wrapper";

const basicCode = `import { CodeBlock } from "@arclo/react";

const code = \`import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\\\`/api/users/\\\${id}\\\`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  return { user, loading };
}\`;

<CodeBlock language="typescript" code={code} />`;

const lineNumbersCode = `import { CodeBlock } from "@arclo/react";

const code = \`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))\`;

<CodeBlock language="python" showLineNumbers code={code} />`;

const sampleTS = `import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/users/\${id}\`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  return { user, loading };
}`;

const samplePython = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))`;

export function CodeBlockBasicDemo() {
  return (
    <DemoWrapper title="CodeBlock — Basic" code={basicCode}>
      <CodeBlock
        language="typescript"
        code={sampleTS}
      />
    </DemoWrapper>
  );
}

export function CodeBlockLineNumbersDemo() {
  return (
    <DemoWrapper title="CodeBlock — Line Numbers" code={lineNumbersCode}>
      <CodeBlock
        language="python"
        showLineNumbers
        code={samplePython}
      />
    </DemoWrapper>
  );
}

export function CodeBlockScrollDemo() {
  const longCode = Array.from({ length: 30 }, (_, i) =>
    `// Line ${i + 1}: processing step ${i + 1}\nconst result_${i + 1} = await process(input_${i + 1});`
  ).join("\n");

  return (
    <DemoWrapper title="CodeBlock — Scrollable (maxHeight)" code={`<CodeBlock language="javascript" maxHeight="200px" showLineNumbers code={longCode} />`}>
      <CodeBlock
        language="javascript"
        maxHeight="200px"
        showLineNumbers
        code={longCode}
      />
    </DemoWrapper>
  );
}
