"use client";

import { useState, useCallback, useRef } from "react";
import {
  StreamingText,
  FeedbackBar,
  PromptBox,
  ModelSelector,
  TokenUsage,
  ConfidenceBadge,
} from "@arc-lo/ui";
import type { ModelOption, ConfidenceLevel } from "@arc-lo/ui";

/* ── Model options ──────────────────────────────────────────────────── */

const MODELS: ModelOption[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    description: "Fast and balanced",
    badge: "Fast",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    description: "Most capable reasoning",
    badge: "New",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI flagship model",
  },
];

/* ── Sample responses ───────────────────────────────────────────────── */

const RESPONSE_A =
  "Quantum computing leverages quantum mechanical phenomena — specifically superposition and entanglement — to process information.\n\nUnlike classical bits (0 or 1), quantum bits (qubits) can exist in a superposition of both states simultaneously. When multiple qubits are entangled, measuring one instantly constrains the others, enabling parallel exploration of solution spaces.\n\nThis gives quantum computers exponential speedup for specific problem classes: integer factorization (Shor's algorithm), unstructured search (Grover's algorithm), and quantum simulation of molecular systems.\n\nKey challenges remain: decoherence, error correction overhead, and the need for near-absolute-zero operating temperatures.";

const RESPONSE_B =
  "Think of a regular computer like a person reading a maze — they try one path at a time until they find the exit.\n\nA quantum computer is more like pouring water into the maze. The water flows down every path at once, and the first stream to reach the exit reveals the solution.\n\nThis works because of two special properties:\n\n1. **Superposition** — Imagine a coin spinning in the air. It's not heads or tails yet — it's both possibilities at once. Quantum bits work the same way.\n\n2. **Entanglement** — Now imagine two spinning coins that are magically linked. No matter how far apart they are, when one lands on heads, the other instantly lands on tails.\n\nThese properties let quantum computers explore many solutions simultaneously, making them incredibly powerful for certain puzzles — like designing new medicines or cracking codes — that would take regular computers millions of years.";

/* ── Types ──────────────────────────────────────────────────────────── */

interface PanelState {
  modelId: string;
  response: string;
  streaming: boolean;
  done: boolean;
  confidence: ConfidenceLevel;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

/* ── Component ──────────────────────────────────────────────────────── */

export function MultiModelPlaygroundExample() {
  const [prompt, setPrompt] = useState("Explain quantum computing in simple terms");
  const [isComparing, setIsComparing] = useState(false);

  const [panelA, setPanelA] = useState<PanelState>({
    modelId: "claude-sonnet",
    response: "",
    streaming: false,
    done: false,
    confidence: "high",
    inputTokens: 0,
    outputTokens: 0,
    cost: 0,
  });

  const [panelB, setPanelB] = useState<PanelState>({
    modelId: "claude-opus",
    response: "",
    streaming: false,
    done: false,
    confidence: "high",
    inputTokens: 0,
    outputTokens: 0,
    cost: 0,
  });

  const timerA = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerB = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCompare = useCallback(() => {
    if (!prompt.trim() || isComparing) return;

    setIsComparing(true);

    // Reset panels and start streaming after a brief delay
    setPanelA((p) => ({
      ...p,
      response: "",
      streaming: false,
      done: false,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
    }));
    setPanelB((p) => ({
      ...p,
      response: "",
      streaming: false,
      done: false,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
    }));

    // Model A starts after 400ms (faster model)
    timerA.current = setTimeout(() => {
      setPanelA((p) => ({
        ...p,
        response: RESPONSE_A,
        streaming: true,
        confidence: "high",
        inputTokens: 142,
        outputTokens: 287,
        cost: 0.0043,
      }));
    }, 400);

    // Model B starts after 900ms (slower model)
    timerB.current = setTimeout(() => {
      setPanelB((p) => ({
        ...p,
        response: RESPONSE_B,
        streaming: true,
        confidence: "medium",
        inputTokens: 142,
        outputTokens: 341,
        cost: 0.0118,
      }));
    }, 900);
  }, [prompt, isComparing]);

  const handleDoneA = useCallback(() => {
    setPanelA((p) => ({ ...p, streaming: false, done: true }));
    // Check if B is also done
    setPanelB((prev) => {
      if (prev.done) setIsComparing(false);
      return prev;
    });
  }, []);

  const handleDoneB = useCallback(() => {
    setPanelB((p) => ({ ...p, streaming: false, done: true }));
    // Check if A is also done
    setPanelA((prev) => {
      if (prev.done) setIsComparing(false);
      return prev;
    });
  }, []);

  // When both panels finish streaming, stop comparing
  if (panelA.done && panelB.done && isComparing) {
    setIsComparing(false);
  }

  return (
    <div
      className="min-h-[600px] rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--arclo-border, #e5e7eb)",
        backgroundColor: "var(--arclo-surface, #ffffff)",
      }}
    >
      {/* ── Prompt area ─────────────────────────────────────────── */}
      <div
        className="border-b p-4"
        style={{ borderColor: "var(--arclo-border, #e5e7eb)" }}
      >
        <PromptBox.Root
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleCompare}
          isSubmitting={isComparing}
        >
          <PromptBox.Input placeholder="Enter a prompt to compare models..." />
          <PromptBox.Footer>
            <span
              className="text-xs"
              style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
            >
              Enter to compare
            </span>
            <PromptBox.SubmitButton />
          </PromptBox.Footer>
        </PromptBox.Root>

        <button
          type="button"
          onClick={handleCompare}
          disabled={isComparing || !prompt.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
          style={{
            backgroundColor: "var(--arclo-accent, #1a1a1a)", color: "var(--arclo-accent-fg, #ffffff)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Compare
        </button>
      </div>

      {/* ── Side-by-side panels ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Panel A */}
        <ModelPanel
          label="Model A"
          panel={panelA}
          onModelChange={(id) => setPanelA((p) => ({ ...p, modelId: id }))}
          onStreamDone={handleDoneA}
          streamSpeed={16}
        />

        {/* Panel B */}
        <ModelPanel
          label="Model B"
          panel={panelB}
          onModelChange={(id) => setPanelB((p) => ({ ...p, modelId: id }))}
          onStreamDone={handleDoneB}
          streamSpeed={24}
          isRight
        />
      </div>
    </div>
  );
}

/* ── Model Panel ────────────────────────────────────────────────────── */

interface ModelPanelProps {
  label: string;
  panel: PanelState;
  onModelChange: (id: string) => void;
  onStreamDone: () => void;
  streamSpeed: number;
  isRight?: boolean;
}

function ModelPanel({
  label,
  panel,
  onModelChange,
  onStreamDone,
  streamSpeed,
  isRight,
}: ModelPanelProps) {
  const hasContent = panel.streaming || panel.done;

  return (
    <div
      className="flex flex-col p-4"
      style={{
        borderLeft: isRight ? "1px solid var(--arclo-border, #e5e7eb)" : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--arclo-text-secondary, #6b7280)" }}
        >
          {label}
        </span>
        <ModelSelector
          models={MODELS}
          value={panel.modelId}
          onChange={onModelChange}
        />
      </div>

      {/* Response area */}
      <div
        className="flex-1 min-h-[200px] rounded-lg border p-4"
        style={{
          borderColor: "var(--arclo-border, #e5e7eb)",
          backgroundColor: "var(--arclo-surface-secondary, #f9fafb)",
          color: "var(--arclo-text, #1a1a1a)",
        }}
      >
        {!hasContent && (
          <p
            className="text-sm italic"
            style={{ color: "var(--arclo-text-muted, #9ca3af)" }}
          >
            Response will appear here...
          </p>
        )}

        {panel.streaming && (
          <StreamingText.Root
            text={panel.response}
            speed={streamSpeed}
            chunkSize="word"
            onDone={onStreamDone}
          >
            <StreamingText.Content className="whitespace-pre-wrap text-sm leading-relaxed" />
            <StreamingText.Cursor />
          </StreamingText.Root>
        )}

        {panel.done && !panel.streaming && (
          <div
            className="whitespace-pre-wrap text-sm leading-relaxed"
            style={{ color: "var(--arclo-text, #1a1a1a)" }}
          >
            {panel.response}
          </div>
        )}
      </div>

      {/* Metrics row */}
      {hasContent && (
        <div className="mt-3 space-y-3">
          <TokenUsage
            inputTokens={panel.inputTokens}
            outputTokens={panel.outputTokens}
            maxTokens={4096}
            cost={panel.cost}
          />

          <div className="flex items-center justify-between">
            <ConfidenceBadge level={panel.confidence} />
            <FeedbackBar.Root>
              <FeedbackBar.ThumbsUp />
              <FeedbackBar.ThumbsDown />
              <FeedbackBar.Copy text={panel.response} />
            </FeedbackBar.Root>
          </div>
        </div>
      )}
    </div>
  );
}
