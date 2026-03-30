import {
  ImageGenDemo,
  ImageGenStatesDemo,
} from "@/components/demos/image-gen-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function ImageGenDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>ImageGen</h1>
      <p>
        AI image generation component with full lifecycle support: idle,
        pending, generating, done, and error. Features shimmer placeholders,
        progress bars, blur-reveal transitions, and a toolbar for download and
        retry actions.
      </p>

      <ImageGenDemo />
      <ImageGenStatesDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { ImageGen } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<ImageGen.Root
  state={state}
  src={imageSrc}
  alt="AI-generated image"
>
  <ImageGen.Placeholder />
  <ImageGen.Preview />
  <ImageGen.Progress progress={progress} />
  <ImageGen.ErrorFallback />
</ImageGen.Root>`}
      />

      <h2>With all parts</h2>
      <CodeBlock
        lang="tsx"
        code={`<ImageGen.Root
  state={state}
  src={imageSrc}
  alt="Generated landscape"
  aspectRatio="16/9"
  prompt="A serene mountain landscape at sunset"
  blurReveal
  onRetry={() => regenerate()}
  onDownload={() => saveImage()}
>
  <ImageGen.Placeholder />
  <ImageGen.Preview />
  <ImageGen.Overlay />
  <ImageGen.Progress progress={progress} />
  <ImageGen.ErrorFallback message="Generation failed. Please try again." />
  <ImageGen.Toolbar>
    <ImageGen.Download />
    <ImageGen.Retry />
  </ImageGen.Toolbar>
</ImageGen.Root>`}
      />

      <h2>States</h2>
      <InfoTable
        headers={["State", "Description", "Visible parts"]}
        rows={[
          { cells: ["idle", "No generation started", "Placeholder"] },
          { cells: ["pending", "Waiting for generation to begin", "Placeholder, Overlay, Progress"] },
          { cells: ["generating", "Image is being generated", "Preview (blurred), Overlay, Progress"] },
          { cells: ["done", "Generation complete", "Preview (clear), Toolbar"] },
          { cells: ["error", "Generation failed", "ErrorFallback"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "state", type: "ImageGenState", description: "Current generation state" },
          { name: "src", type: "string | null", description: "Image source URL" },
          { name: "alt", type: "string", description: "Alt text for the generated image" },
          { name: "aspectRatio", type: "string", default: '"1/1"', description: "CSS aspect ratio for the image container" },
          { name: "prompt", type: "string", description: "The generation prompt (for context)" },
          { name: "blurReveal", type: "boolean", default: "true", description: "Animate blur-to-clear transition on completion" },
          { name: "onRetry", type: "() => void", description: "Called when user clicks retry" },
          { name: "onDownload", type: "() => void", description: "Called when user clicks download" },
        ]}
      />
    </article>
  );
}
