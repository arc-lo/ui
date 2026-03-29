import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

/* ─── Types ───────────────────────────────────────────────────────── */

export type ToolCallStatus = "pending" | "running" | "success" | "error";

/* ─── Context ─────────────────────────────────────────────────────── */

interface ToolCallContextValue {
  status: ToolCallStatus;
  toolName: string;
  isOpen: boolean;
  toggle: () => void;
}

const ToolCallContext = createContext<ToolCallContextValue | null>(null);

function useToolCallContext() {
  const ctx = useContext(ToolCallContext);
  if (!ctx) {
    throw new Error("ToolCall parts must be used within <ToolCall.Root>");
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface ToolCallRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of the tool being called */
  toolName: string;
  /** Current status */
  status?: ToolCallStatus;
  /** Whether result is expanded by default. Default: false */
  defaultOpen?: boolean;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, ToolCallRootProps>(
  (
    {
      toolName,
      status = "pending",
      defaultOpen = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggle = useCallback(() => setIsOpen((o) => !o), []);

    return (
      <ToolCallContext.Provider value={{ status, toolName, isOpen, toggle }}>
        <div
          ref={ref}
          data-status={status}
          className={cn(
            "arclo-tool-call rounded-xl border overflow-hidden transition-all",
            status === "pending" && "border-gray-200 bg-gray-50/50",
            status === "running" && "border-blue-200 bg-blue-50/30",
            status === "success" && "border-emerald-200 bg-emerald-50/30",
            status === "error" && "border-red-200 bg-red-50/30",
            className,
          )}
          {...props}
        >
          {children ?? (
            <>
              <Header />
            </>
          )}
        </div>
      </ToolCallContext.Provider>
    );
  },
);
Root.displayName = "ToolCall.Root";

/* ─── Header ──────────────────────────────────────────────────────── */

export interface ToolCallHeaderProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const Header = forwardRef<HTMLButtonElement, ToolCallHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { status, toolName, isOpen, toggle } = useToolCallContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className={cn(
          "arclo-tool-call-header flex w-full items-center gap-3 px-4 py-3 text-left text-sm cursor-pointer hover:bg-gray-50/50 transition-colors",
          className,
        )}
        {...props}
      >
        {/* Status icon */}
        <span className="shrink-0">
          {status === "pending" && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
            </span>
          )}
          {status === "running" && (
            <svg
              className="h-5 w-5 animate-spin text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="60"
                strokeDashoffset="20"
                strokeLinecap="round"
              />
            </svg>
          )}
          {status === "success" && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-3 w-3 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
          {status === "error" && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-3 w-3 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
            </span>
          )}
        </span>

        {/* Tool name + status label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gray-700 truncate">
              {toolName}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                status === "pending" && "bg-gray-100 text-gray-500",
                status === "running" && "bg-blue-100 text-blue-600",
                status === "success" && "bg-emerald-100 text-emerald-600",
                status === "error" && "bg-red-100 text-red-600",
              )}
            >
              {status === "pending" && "Queued"}
              {status === "running" && "Running"}
              {status === "success" && "Done"}
              {status === "error" && "Failed"}
            </span>
          </div>
          {children}
        </div>

        {/* Chevron */}
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  },
);
Header.displayName = "ToolCall.Header";

/* ─── Input (tool arguments) ──────────────────────────────────────── */

export interface ToolCallInputProps extends HTMLAttributes<HTMLDivElement> {
  /** Label for the input section. Default: "Input" */
  label?: string;
}

export const Input = forwardRef<HTMLDivElement, ToolCallInputProps>(
  ({ label = "Input", children, className, ...props }, ref) => {
    const { isOpen } = useToolCallContext();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-tool-call-input border-t border-gray-100 px-4 py-3",
          className,
        )}
        {...props}
      >
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600 overflow-x-auto">
          {children}
        </div>
      </div>
    );
  },
);
Input.displayName = "ToolCall.Input";

/* ─── Output (tool result) ────────────────────────────────────────── */

export interface ToolCallOutputProps extends HTMLAttributes<HTMLDivElement> {
  /** Label for the output section. Default: "Output" */
  label?: string;
}

export const Output = forwardRef<HTMLDivElement, ToolCallOutputProps>(
  ({ label = "Output", children, className, ...props }, ref) => {
    const { isOpen, status } = useToolCallContext();

    if (!isOpen || status === "pending" || status === "running") return null;

    return (
      <div
        ref={ref}
        className={cn(
          "arclo-tool-call-output border-t border-gray-100 px-4 py-3",
          className,
        )}
        {...props}
      >
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div
          className={cn(
            "rounded-lg p-3 font-mono text-xs overflow-x-auto",
            status === "success" && "bg-emerald-50 text-emerald-800",
            status === "error" && "bg-red-50 text-red-800",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
Output.displayName = "ToolCall.Output";
