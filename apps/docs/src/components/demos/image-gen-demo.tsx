"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ImageGen } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/512x512/6C5CE7/ffffff?text=Generated+Image";

const liveCode = `<ImageGen.Root
  state={state}
  src={src}
  alt="AI-generated image"
  aspectRatio="1/1"
  blurReveal
  onRetry={() => restart()}
  onDownload={() => downloadImage()}
>
  <ImageGen.Placeholder />
  <ImageGen.Preview />
  <ImageGen.Overlay />
  <ImageGen.Progress progress={progress} />
  <ImageGen.ErrorFallback message="Failed to generate image." />
  <ImageGen.Toolbar>
    <ImageGen.Download />
    <ImageGen.Retry />
  </ImageGen.Toolbar>
</ImageGen.Root>`;

type DemoState = "idle" | "pending" | "generating" | "done" | "error";

export function ImageGenDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [progress, setProgress] = useState(0);
  const [src, setSrc] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setState("idle");
    setProgress(0);
    setSrc(null);
  }, [cleanup]);

  const startGeneration = useCallback(() => {
    cleanup();
    setSrc(null);
    setProgress(0);
    setState("pending");

    setTimeout(() => {
      setState("generating");
      setSrc(PLACEHOLDER_IMAGE);
      let p = 0;
      intervalRef.current = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          cleanup();
          setState("done");
        }
      }, 50);
    }, 1000);
  }, [cleanup]);

  const triggerError = useCallback(() => {
    cleanup();
    setSrc(null);
    setProgress(0);
    setState("error");
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const buttons: { label: string; action: () => void; active: boolean }[] = [
    { label: "Idle", action: reset, active: state === "idle" },
    { label: "Generate", action: startGeneration, active: state === "pending" || state === "generating" },
    { label: "Done", action: () => { cleanup(); setSrc(PLACEHOLDER_IMAGE); setProgress(100); setState("done"); }, active: state === "done" },
    { label: "Error", action: triggerError, active: state === "error" },
  ];

  return (
    <DemoWrapper title="ImageGen — Live Demo" code={liveCode}>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: btn.active
                  ? "var(--docs-heading)"
                  : "var(--docs-code-bg)",
                color: btn.active
                  ? "var(--docs-bg)"
                  : "var(--docs-muted)",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--docs-code-bg)" }}
        >
          <div style={{ maxWidth: 320, margin: "0 auto" }}>
            <ImageGen.Root
              state={state}
              src={src}
              alt="AI-generated image"
              aspectRatio="1/1"
              blurReveal
              onRetry={startGeneration}
              onDownload={() => {
                if (src) window.open(src, "_blank");
              }}
            >
              <ImageGen.Placeholder />
              <ImageGen.Preview />
              <ImageGen.Overlay />
              <ImageGen.Progress progress={state === "generating" ? progress : undefined} />
              <ImageGen.ErrorFallback message="Failed to generate image." />
              <ImageGen.Toolbar>
                <ImageGen.Download />
                <ImageGen.Retry />
              </ImageGen.Toolbar>
            </ImageGen.Root>
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}

export function ImageGenStatesDemo() {
  const [state, setState] = useState<string>("idle");

  return (
    <DemoWrapper title="ImageGen — All 5 States">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["idle", "pending", "generating", "done", "error"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    state === s ? "var(--docs-heading)" : "var(--docs-code-bg)",
                  color:
                    state === s ? "var(--docs-bg)" : "var(--docs-muted)",
                }}
              >
                {s}
              </button>
            ),
          )}
        </div>

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--docs-code-bg)" }}
        >
          <div style={{ maxWidth: 320, margin: "0 auto" }}>
            <ImageGen.Root
              state={state as DemoState}
              src={state === "done" || state === "generating" ? PLACEHOLDER_IMAGE : null}
              alt="AI-generated image"
              aspectRatio="1/1"
              blurReveal
              onRetry={() => setState("pending")}
              onDownload={() => window.open(PLACEHOLDER_IMAGE, "_blank")}
            >
              <ImageGen.Placeholder />
              <ImageGen.Preview />
              <ImageGen.Overlay />
              <ImageGen.Progress progress={state === "generating" ? 45 : undefined} />
              <ImageGen.ErrorFallback message="Failed to generate image." />
              <ImageGen.Toolbar>
                <ImageGen.Download />
                <ImageGen.Retry />
              </ImageGen.Toolbar>
            </ImageGen.Root>
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
}
