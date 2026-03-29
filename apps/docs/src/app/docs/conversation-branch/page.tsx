import {
  ConversationBranchDemo,
  ConversationBranchBoundaryDemo,
} from "@/components/demos/conversation-branch-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable } from "@/components/props-table";

export default function ConversationBranchDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ConversationBranch</h1>
      <p>
        A compact navigation control for stepping through conversation branches
        (regenerated responses). Shows the current position and total count with
        previous/next arrows that disable at boundaries.
      </p>

      <ConversationBranchDemo />
      <ConversationBranchBoundaryDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ConversationBranch } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`const [branch, setBranch] = useState(1);
const total = 5;

<ConversationBranch
  current={branch}
  total={total}
  onPrevious={() => setBranch((b) => b - 1)}
  onNext={() => setBranch((b) => b + 1)}
/>`}
      />

      <h2>Inline with a message</h2>
      <CodeBlock
        lang="tsx"
        code={`<div className="flex items-center gap-2">
  <p>Here is my response...</p>
  <ConversationBranch current={2} total={3} />
</div>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "current", type: "number", description: "Current branch index, 1-indexed (required)" },
          { name: "total", type: "number", description: "Total number of branches (required)" },
          { name: "onPrevious", type: "() => void", description: "Called when left arrow is clicked" },
          { name: "onNext", type: "() => void", description: "Called when right arrow is clicked" },
        ]}
      />
    </article>
  );
}
