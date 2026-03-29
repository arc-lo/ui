import {
  FileAttachmentChipDemo,
  FileAttachmentCardDemo,
  FileAttachmentProgressDemo,
} from "@/components/demos/file-attachment-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function FileAttachmentDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>FileAttachment</h1>
      <p>
        Display file attachments as compact chips or richer cards with previews.
        Supports upload progress, type-specific icons, and a remove action.
      </p>

      <FileAttachmentChipDemo />
      <FileAttachmentCardDemo />
      <FileAttachmentProgressDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { FileAttachment } from "@arclo/react";`} />

      <h2>Chip variant (default)</h2>
      <CodeBlock
        lang="tsx"
        code={`<FileAttachment
  name="report.pdf"
  size="2.4 MB"
  type="pdf"
  onRemove={() => handleRemove()}
/>`}
      />

      <h2>Card variant with preview</h2>
      <CodeBlock
        lang="tsx"
        code={`<FileAttachment
  variant="card"
  name="screenshot.png"
  size="1.8 MB"
  type="image"
  preview="https://example.com/thumb.jpg"
  onRemove={() => handleRemove()}
/>`}
      />

      <h2>Upload progress</h2>
      <CodeBlock
        lang="tsx"
        code={`<FileAttachment
  name="upload.zip"
  size="24 MB"
  type="other"
  progress={65}
/>`}
      />

      <h2>Props</h2>
      <PropsTable
        props={[
          { name: "name", type: "string", description: "File name (required)" },
          { name: "size", type: "string", description: 'Human-readable file size, e.g. "2.4 MB"' },
          { name: "type", type: '"image" | "pdf" | "code" | "text" | "csv" | "other"', default: '"other"', description: "Determines the file icon" },
          { name: "preview", type: "string", description: "Image URL for thumbnail (card variant)" },
          { name: "progress", type: "number", description: "Upload progress 0-100, shows progress bar when present" },
          { name: "onRemove", type: "() => void", description: "Shows remove button when provided" },
          { name: "variant", type: '"chip" | "card"', default: '"chip"', description: "Display style" },
        ]}
      />

      <h2>File types</h2>
      <InfoTable
        headers={["Type", "Icon"]}
        rows={[
          { cells: ["image", "Image/landscape icon"] },
          { cells: ["pdf", "Document with P"] },
          { cells: ["code", "Document with angle brackets"] },
          { cells: ["text", "Document with lines"] },
          { cells: ["csv", "Document with grid"] },
          { cells: ["other", "Plain document"] },
        ]}
      />
    </article>
  );
}
