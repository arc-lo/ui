import { useCallback, useEffect, useRef, useState } from "react";
import type { ChunkSize, StreamingState } from "../lib/types";

export interface UseStreamingTextOptions {
  /** ReadableStream of text chunks from an AI response */
  stream?: ReadableStream<string> | null;
  /** Plain text to stream (alternative to stream) */
  text?: string;
  /** Delay in ms between rendering chunks. Default: 30 */
  speed?: number;
  /** How to chunk the text for rendering. Default: "char" */
  chunkSize?: ChunkSize;
  /** Called when streaming completes */
  onDone?: (text: string) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Called when interrupted by user */
  onInterrupt?: (partialText: string) => void;
}

export interface UseStreamingTextReturn {
  /** The text rendered so far */
  displayedText: string;
  /** The full text received (may be ahead of displayedText during animation) */
  fullText: string;
  /** Current state of the streaming component */
  state: StreamingState;
  /** Stop streaming and rendering */
  interrupt: () => void;
  /** Reset to pending state */
  reset: () => void;
  /** Jump to showing all received text immediately */
  skipAnimation: () => void;
}

function chunkText(text: string, mode: ChunkSize): string[] {
  switch (mode) {
    case "char":
      return text.split("");
    case "word":
      return text.match(/\S+\s*/g) ?? [text];
    case "line":
      return text.match(/[^\n]*\n?/g)?.filter(Boolean) ?? [text];
  }
}

export function useStreamingText({
  stream,
  text,
  speed = 30,
  chunkSize = "char",
  onDone,
  onError,
  onInterrupt,
}: UseStreamingTextOptions): UseStreamingTextReturn {
  const [displayedText, setDisplayedText] = useState("");
  const [fullText, setFullText] = useState("");
  const [state, setState] = useState<StreamingState>("pending");

  const bufferRef = useRef<string[]>([]);
  const drainingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interruptedRef = useRef(false);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const speedRef = useRef(speed);
  const fullTextRef = useRef("");
  const onDoneRef = useRef(onDone);
  const onErrorRef = useRef(onError);
  const onInterruptRef = useRef(onInterrupt);

  // Keep refs in sync
  speedRef.current = speed;
  onDoneRef.current = onDone;
  onErrorRef.current = onError;
  onInterruptRef.current = onInterrupt;

  // Single drain loop — only one runs at a time
  const startDraining = useCallback(() => {
    if (drainingRef.current) return;
    drainingRef.current = true;

    function tick() {
      if (bufferRef.current.length === 0) {
        drainingRef.current = false;
        return;
      }

      const chunk = bufferRef.current.shift()!;
      setDisplayedText((prev) => prev + chunk);

      timerRef.current = setTimeout(tick, speedRef.current);
    }

    tick();
  }, []);

  // Read from stream
  useEffect(() => {
    if (!stream) return;

    // Reset state for new stream
    interruptedRef.current = false;
    drainingRef.current = false;
    bufferRef.current = [];
    fullTextRef.current = "";
    setDisplayedText("");
    setFullText("");
    setState("streaming");

    let cancelled = false;
    let reader: ReadableStreamDefaultReader<string>;

    try {
      reader = stream.getReader();
    } catch {
      // Stream already locked (e.g. React strict mode double-mount)
      return;
    }

    readerRef.current = reader;

    async function read() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (cancelled || interruptedRef.current) break;
          if (done) {
            // Wait for buffer to drain, then mark done
            const waitForDrain = () => {
              if (cancelled) return;
              if (bufferRef.current.length === 0 && !drainingRef.current) {
                setState("done");
                onDoneRef.current?.(fullTextRef.current);
              } else {
                setTimeout(waitForDrain, 50);
              }
            };
            waitForDrain();
            return;
          }
          const chunks = chunkText(value, chunkSize);
          bufferRef.current.push(...chunks);
          fullTextRef.current += value;
          setFullText(fullTextRef.current);
          startDraining();
        }
      } catch (err) {
        if (!cancelled && !interruptedRef.current) {
          setState("error");
          onErrorRef.current?.(
            err instanceof Error ? err : new Error(String(err)),
          );
        }
      }
    }

    read();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      drainingRef.current = false;
      reader.cancel().catch(() => {});
    };
  }, [stream, chunkSize, startDraining]);

  // Handle plain text prop
  useEffect(() => {
    if (text == null || stream) return;

    interruptedRef.current = false;
    drainingRef.current = false;
    bufferRef.current = [];
    fullTextRef.current = text;
    setDisplayedText("");
    setFullText(text);
    setState("streaming");

    const chunks = chunkText(text, chunkSize);
    bufferRef.current = chunks;
    startDraining();

    const waitForDrain = () => {
      if (bufferRef.current.length === 0 && !drainingRef.current) {
        setState("done");
        onDoneRef.current?.(text);
      } else {
        setTimeout(waitForDrain, 50);
      }
    };
    setTimeout(waitForDrain, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      drainingRef.current = false;
    };
  }, [text, stream, chunkSize, startDraining]);

  const interrupt = useCallback(() => {
    interruptedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    drainingRef.current = false;
    readerRef.current?.cancel().catch(() => {});
    bufferRef.current = [];
    setState("interrupted");
    setDisplayedText((t) => {
      onInterruptRef.current?.(t);
      return t;
    });
  }, []);

  const reset = useCallback(() => {
    interruptedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    drainingRef.current = false;
    bufferRef.current = [];
    fullTextRef.current = "";
    setDisplayedText("");
    setFullText("");
    setState("pending");
  }, []);

  const skipAnimation = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    drainingRef.current = false;
    bufferRef.current = [];
    setDisplayedText(fullTextRef.current);
  }, []);

  return { displayedText, fullText, state, interrupt, reset, skipAnimation };
}
