"use client";

import { useState, useEffect, useCallback } from "react";
import { StatusIndicator } from "@arc-lo/ui";
import type { StatusIndicatorState } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const allStatesCode = `<StatusIndicator state="idle" />
<StatusIndicator state="thinking" />
<StatusIndicator state="streaming" />
<StatusIndicator state="tool-calling" />
<StatusIndicator state="error" />`;

const customCode = `<StatusIndicator state="thinking" label="Mulling..." color="amber" />
<StatusIndicator state="thinking" label="Reasoning..." color="purple" />
<StatusIndicator state="streaming" label="Generating..." color="blue" />
<StatusIndicator
  state="thinking"
  label="Searching..."
  color="blue"
  icon={<SearchIcon />}
/>`;

export function StatusIndicatorDemo() {
  const [state, setState] = useState<StatusIndicatorState>("thinking");

  return (
    <DemoWrapper title="StatusIndicator — All States" code={allStatesCode}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(
            ["idle", "thinking", "streaming", "tool-calling", "error"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                state === s
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center rounded-xl bg-gray-900 py-8">
          <StatusIndicator state={state} className="text-base" />
        </div>

        <div className="flex items-center justify-center rounded-xl bg-white border border-gray-200 py-8">
          <StatusIndicator state={state} className="text-base" />
        </div>
      </div>
    </DemoWrapper>
  );
}

export function StatusIndicatorCycleDemo() {
  const [state, setState] = useState<StatusIndicatorState>("idle");

  const simulate = useCallback(() => {
    setState("thinking");
    setTimeout(() => setState("tool-calling"), 2000);
    setTimeout(() => setState("streaming"), 4000);
    setTimeout(() => setState("idle"), 7000);
  }, []);

  return (
    <DemoWrapper title="StatusIndicator — Lifecycle Simulation">
      <div className="space-y-4">
        <button
          onClick={simulate}
          className="rounded-full bg-[#6C5CE7] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
        >
          Simulate AI response lifecycle
        </button>

        <div className="flex items-center gap-4 rounded-xl bg-gray-900 px-6 py-4">
          <StatusIndicator state={state} />
        </div>

        <p className="text-xs text-gray-500">
          Cycles: idle → thinking → tool-calling → streaming → idle
        </p>
      </div>
    </DemoWrapper>
  );
}

export function StatusIndicatorCustomDemo() {
  return (
    <DemoWrapper title="StatusIndicator — Custom Labels & Colors" code={customCode}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-6">
          <StatusIndicator state="thinking" label="Mulling..." color="amber" />
          <StatusIndicator state="thinking" label="Reasoning..." color="purple" />
          <StatusIndicator state="streaming" label="Generating..." color="blue" />
          <StatusIndicator
            state="thinking"
            label="Searching..."
            color="blue"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />
          <StatusIndicator state="error" label="Rate limited" />
        </div>
      </div>
    </DemoWrapper>
  );
}
