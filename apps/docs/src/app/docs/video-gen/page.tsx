import {
  VideoGenDemo,
  VideoGenStatesDemo,
} from "@/components/demos/video-gen-demo";
import { CodeBlock } from "@/components/code-block";
import { PropsTable, InfoTable } from "@/components/props-table";

export default function VideoGenDocs() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>VideoGen</h1>
      <p>
        A compound component for rendering video generation progress. Handles
        the full lifecycle: idle, queued, processing, rendering, done, and error.
      </p>

      <VideoGenDemo />
      <VideoGenStatesDemo />

      <h2>Import</h2>
      <CodeBlock lang="tsx" code={`import { VideoGen } from "@arc-lo/ui";`} />

      <h2>Basic usage</h2>
      <CodeBlock
        lang="tsx"
        code={`<VideoGen.Root state="processing" poster={posterUrl} progress={42}>
  <VideoGen.Placeholder />
  <VideoGen.Thumbnail />
  <VideoGen.Player />
  <VideoGen.Progress />
  <VideoGen.StageLabel />
  <VideoGen.PlayButton />
  <VideoGen.ErrorFallback />
</VideoGen.Root>`}
      />

      <h2>With toolbar and callbacks</h2>
      <CodeBlock
        lang="tsx"
        code={`<VideoGen.Root
  state={state}
  src={videoUrl}
  poster={posterUrl}
  progress={progress}
  aspectRatio="16/9"
  duration={duration}
  prompt="A cat riding a skateboard"
  onRetry={() => regenerate()}
  onDownload={() => saveVideo()}
  onPlay={() => analytics.track("play")}
>
  <VideoGen.Placeholder />
  <VideoGen.Thumbnail />
  <VideoGen.Player autoPlay muted loop />
  <VideoGen.Progress />
  <VideoGen.StageLabel />
  <VideoGen.PlayButton />
  <VideoGen.ErrorFallback message="Generation failed." />
  <VideoGen.Toolbar>
    <button onClick={onDownload}>Download</button>
  </VideoGen.Toolbar>
</VideoGen.Root>`}
      />

      <h2>States</h2>
      <InfoTable
        headers={["State", "Description", "Visible parts"]}
        rows={[
          { cells: ["idle", "No generation in progress", "Placeholder"] },
          { cells: ["queued", "Waiting in generation queue", "Placeholder, Progress"] },
          { cells: ["processing", "Model is generating frames", "Thumbnail, Progress, StageLabel"] },
          { cells: ["rendering", "Final rendering / encoding", "Thumbnail, Progress, StageLabel"] },
          { cells: ["done", "Video ready for playback", "Player or Thumbnail, PlayButton, Toolbar"] },
          { cells: ["error", "Generation failed", "ErrorFallback"] },
        ]}
      />

      <h2>Props</h2>
      <PropsTable
        title="Root"
        props={[
          { name: "state", type: "VideoGenState", description: "Current generation state" },
          { name: "src", type: "string | null", description: "Video source URL when done" },
          { name: "poster", type: "string | null", description: "Thumbnail / poster image URL" },
          { name: "progress", type: "number", description: "Progress percentage (0-100)" },
          { name: "aspectRatio", type: "string", default: '"16/9"', description: "CSS aspect-ratio for the container" },
          { name: "duration", type: "number | null", description: "Video duration in seconds" },
          { name: "prompt", type: "string", description: "Generation prompt text" },
          { name: "onRetry", type: "() => void", description: "Called when retry is clicked in error state" },
          { name: "onDownload", type: "() => void", description: "Called when download is triggered" },
          { name: "onPlay", type: "() => void", description: "Called when play button is clicked" },
        ]}
      />
    </article>
  );
}
