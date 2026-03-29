export type StreamingState =
  | "pending"
  | "streaming"
  | "done"
  | "interrupted"
  | "error"
  | "ratelimit";

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export type ChunkSize = "char" | "word" | "line";
