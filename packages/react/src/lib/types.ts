export type StreamingState =
  | "pending"
  | "streaming"
  | "done"
  | "interrupted"
  | "error"
  | "ratelimit";

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export type ChunkSize = "char" | "word" | "line";

export type ImageGenState = "idle" | "pending" | "generating" | "done" | "error";

export type VideoGenState = "idle" | "queued" | "processing" | "rendering" | "done" | "error";
