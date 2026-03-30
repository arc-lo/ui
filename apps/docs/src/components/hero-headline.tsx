"use client";

import { useState, useEffect, useId } from "react";
import { StreamingText } from "@arc-lo/ui";

const DESCRIPTION =
  "18 primitives every AI product needs — streaming, prompts, confidence, feedback, citations, refusals, thinking blocks, tool calls, markdown, status indicators, token usage, model selection, source cards, and chat threads. Built on Radix conventions. Themeable. Works with shadcn/ui.";

export function HeroHeadline() {
  const id = useId().replace(/:/g, "");
  const [showDesc, setShowDesc] = useState(false);
  const [descDone, setDescDone] = useState(false);

  useEffect(() => {
    // Start description streaming after title animation finishes (~2s)
    const t = setTimeout(() => setShowDesc(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes hero-sweep-${id} {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
`,
        }}
      />

      {/* Title with sweep animation */}
      <h1
        className="hero-animate-1 text-4xl font-bold tracking-tight sm:text-5xl"
        style={{ color: "var(--docs-heading)" }}
      >
        {"AI-native components".split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation: `hero-sweep-${id} 2s ease-in-out infinite`,
              animationDelay: `${i * 0.06}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <br />
        <span style={{ color: "var(--arclo-accent, #1a1a1a)" }}>
          {"for React".split("").map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                animation: `hero-sweep-${id} 2s ease-in-out infinite`,
                animationDelay: `${(i + 20) * 0.06}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </h1>

      {/* Description with streaming text */}
      <div className="hero-animate-2 mt-6 text-lg leading-relaxed" style={{ color: "var(--docs-body)" }}>
        {showDesc ? (
          <StreamingText.Root
            text={DESCRIPTION}
            speed={15}
            chunkSize="word"
            onDone={() => setDescDone(true)}
          >
            <StreamingText.Content />
            <StreamingText.Cursor />
          </StreamingText.Root>
        ) : (
          <span style={{ opacity: 0.2 }}>{DESCRIPTION}</span>
        )}
      </div>
    </>
  );
}
