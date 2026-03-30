"use client";

import { useState } from "react";
import { VideoGen } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const POSTER_URL =
  "https://placehold.co/1280x720/1a1a2e/ffffff?text=Video+Frame";

const liveCode = `<VideoGen.Root
  state={state}
  poster={poster}
  src={src}
  progress={progress}
  onRetry={() => setState("idle")}
  onDownload={() => console.log("download")}
  onPlay={() => console.log("play")}
>
  <VideoGen.Placeholder />
  <VideoGen.Thumbnail />
  <VideoGen.Player />
  <VideoGen.Progress />
  <VideoGen.PlayButton />
  <VideoGen.ErrorFallback message="Generation failed." />
  <VideoGen.Toolbar>
    <button onClick={onDownload}>Download</button>
  </VideoGen.Toolbar>
</VideoGen.Root>
<VideoGen.StageLabel />`;

type SimState = "idle" | "queued" | "processing" | "rendering" | "done" | "error";

export function VideoGenDemo() {
  const [state, setState] = useState<SimState>("idle");
  const [progress, setProgress] = useState(0);

  const advance = () => {
    const order: SimState[] = ["idle", "queued", "processing", "rendering", "done"];
    const idx = order.indexOf(state);
    if (idx < order.length - 1) {
      const next = order[idx + 1];
      setState(next);
      if (next === "processing") setProgress(42);
      else if (next === "rendering") setProgress(78);
      else setProgress(0);
    } else {
      setState("idle");
      setProgress(0);
    }
  };

  const triggerError = () => {
    setState("error");
    setProgress(0);
  };

  const activeProgress =
    state === "processing" || state === "rendering" ? progress : undefined;

  return (
    <DemoWrapper title="VideoGen — Interactive Demo" code={liveCode}>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={advance}
            className="rounded-full px-4 py-1 text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--arclo-accent, #1a1a1a)",
              color: "var(--arclo-accent-fg, #fff)",
            }}
          >
            {state === "done" ? "Reset" : "Next state"}
          </button>
          <button
            onClick={triggerError}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--docs-code-bg, #f3f4f6)",
              color: "var(--docs-body, #374151)",
            }}
          >
            Error
          </button>
          <span
            className="flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--docs-code-bg, #f3f4f6)",
              color: "var(--docs-muted, #9ca3af)",
            }}
          >
            state: {state}
          </span>
        </div>

        <div className="max-w-xl">
          <VideoGen.Root
            state={state}
            poster={POSTER_URL}
            src={state === "done" ? "" : null}
            progress={activeProgress}
            onRetry={() => {
              setState("idle");
              setProgress(0);
            }}
            onDownload={() => console.log("download")}
            onPlay={() => console.log("play")}
          >
            <VideoGen.Placeholder />
            <VideoGen.Thumbnail />
            <VideoGen.Player />
            <VideoGen.Progress />
            <VideoGen.PlayButton />
            <VideoGen.ErrorFallback message="Video generation failed." />
            <VideoGen.Toolbar>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--arclo-accent, #1a1a1a)",
                  color: "var(--arclo-accent-fg, #fff)",
                }}
                onClick={() => console.log("download")}
              >
                Download
              </button>
            </VideoGen.Toolbar>
          </VideoGen.Root>

          {/* StageLabel outside the dark container for visibility */}
          <div className="mt-2">
            <VideoGen.Root state={state} progress={activeProgress}>
              <VideoGen.StageLabel />
            </VideoGen.Root>
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}

export function VideoGenStatesDemo() {
  const [state, setState] = useState<SimState>("idle");

  const progressForState = (s: SimState) => {
    if (s === "processing") return 42;
    if (s === "rendering") return 78;
    return undefined;
  };

  return (
    <DemoWrapper title="VideoGen — All 6 States">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            ["idle", "queued", "processing", "rendering", "done", "error"] as SimState[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
              style={
                state === s
                  ? {
                      backgroundColor: "var(--docs-heading, #000)",
                      color: "var(--docs-card-bg, #fff)",
                    }
                  : {
                      backgroundColor: "var(--docs-code-bg, #f3f4f6)",
                      color: "var(--docs-muted, #6b7280)",
                    }
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="max-w-xl">
          <VideoGen.Root
            state={state}
            poster={POSTER_URL}
            src={state === "done" ? "" : null}
            progress={progressForState(state)}
            onRetry={() => setState("idle")}
            onPlay={() => console.log("play")}
          >
            <VideoGen.Placeholder />
            <VideoGen.Thumbnail />
            <VideoGen.Player />
            <VideoGen.Progress />
            <VideoGen.PlayButton />
            <VideoGen.ErrorFallback message="Video generation failed." />
          </VideoGen.Root>

          {/* StageLabel outside the dark container for visibility */}
          <div className="mt-2">
            <VideoGen.Root state={state} progress={progressForState(state)}>
              <VideoGen.StageLabel />
            </VideoGen.Root>
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}
