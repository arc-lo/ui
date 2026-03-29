import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── Context ─────────────────────────────────────────────────────── */

interface PromptBoxContextValue {
  value: string;
  setValue: (v: string) => void;
  submit: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

const PromptBoxContext = createContext<PromptBoxContextValue | null>(null);

export function usePromptBoxContext() {
  const ctx = useContext(PromptBoxContext);
  if (!ctx) {
    throw new Error(
      "usePromptBoxContext must be used within <PromptBox.Root>",
    );
  }
  return ctx;
}

/* ─── Root ────────────────────────────────────────────────────────── */

export interface PromptBoxRootProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Controlled value */
  value?: string;
  /** Default uncontrolled value */
  defaultValue?: string;
  /** Called when the prompt is submitted */
  onSubmit?: (value: string) => void;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Whether a submission is in progress */
  isSubmitting?: boolean;
  /** Disable the entire prompt box */
  disabled?: boolean;
  children?: ReactNode;
}

export const Root = forwardRef<HTMLFormElement, PromptBoxRootProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onSubmit,
      onValueChange,
      isSubmitting = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const setValue = useCallback(
      (v: string) => {
        if (controlledValue === undefined) setInternalValue(v);
        onValueChange?.(v);
      },
      [controlledValue, onValueChange],
    );

    const submit = useCallback(() => {
      if (!value.trim() || isSubmitting || disabled) return;
      onSubmit?.(value);
    }, [value, isSubmitting, disabled, onSubmit]);

    const handleFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        submit();
      },
      [submit],
    );

    return (
      <PromptBoxContext.Provider
        value={{ value, setValue, submit, isSubmitting, disabled }}
      >
        <form
          ref={ref}
          onSubmit={handleFormSubmit}
          style={{
            backgroundColor: themeVars.surface,
            borderColor: themeVars.border,
            color: themeVars.text,
          }}
          className={cn(
            "arclo-prompt-box rounded-2xl border shadow-sm transition-all focus-within:shadow-md",
            disabled && "opacity-50 pointer-events-none",
            className,
          )}
          {...props}
        >
          {children ?? (
            <>
              <Input />
              <Footer>
                <SubmitButton />
              </Footer>
            </>
          )}
        </form>
      </PromptBoxContext.Provider>
    );
  },
);
Root.displayName = "PromptBox.Root";

/* ─── Context Chips (model, files, tools) ─────────────────────────── */

export interface PromptBoxChipsProps extends HTMLAttributes<HTMLDivElement> {}

export const Chips = forwardRef<HTMLDivElement, PromptBoxChipsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "arclo-prompt-chips flex flex-wrap gap-2 px-4 pt-4 pb-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Chips.displayName = "PromptBox.Chips";

/* ─── Single Chip ─────────────────────────────────────────────────── */

export interface PromptBoxChipProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
}

export const Chip = forwardRef<HTMLSpanElement, PromptBoxChipProps>(
  ({ children, onRemove, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "arclo-prompt-chip inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600",
          className,
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </span>
    );
  },
);
Chip.displayName = "PromptBox.Chip";

/* ─── Input (auto-growing textarea) ───────────────────────────────── */

export interface PromptBoxInputProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  /** Min rows. Default: 1 */
  minRows?: number;
  /** Max rows before scroll. Default: 8 */
  maxRows?: number;
}

export const Input = forwardRef<HTMLTextAreaElement, PromptBoxInputProps>(
  ({ minRows = 1, maxRows = 8, className, onKeyDown, ...props }, ref) => {
    const { value, setValue, submit, isSubmitting, disabled } =
      usePromptBoxContext();
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

    // Auto-resize
    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20;
      const minH = lineHeight * minRows;
      const maxH = lineHeight * maxRows;
      el.style.height = `${Math.min(Math.max(el.scrollHeight, minH), maxH)}px`;
    }, [value, minRows, maxRows, textareaRef]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
        onKeyDown?.(e);
      },
      [submit, onKeyDown],
    );

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSubmitting}
        rows={minRows}
        placeholder="Ask anything..."
        className={cn(
          "arclo-prompt-input w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed outline-none placeholder:text-gray-400 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "PromptBox.Input";

/* ─── Footer ──────────────────────────────────────────────────────── */

export interface PromptBoxFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Footer = forwardRef<HTMLDivElement, PromptBoxFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "arclo-prompt-footer flex items-center justify-between px-4 pb-3 pt-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Footer.displayName = "PromptBox.Footer";

/* ─── Submit Button ───────────────────────────────────────────────── */

export interface PromptBoxSubmitProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const SubmitButton = forwardRef<HTMLButtonElement, PromptBoxSubmitProps>(
  ({ children, className, ...props }, ref) => {
    const { value, isSubmitting, disabled } = usePromptBoxContext();
    const isEmpty = !value.trim();

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isEmpty || isSubmitting || disabled}
        style={{ backgroundColor: themeVars.accent }}
        className={cn(
          "arclo-prompt-submit ml-auto rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90 disabled:opacity-25 cursor-pointer disabled:cursor-default",
          className,
        )}
        {...props}
      >
        {children ?? (isSubmitting ? "Sending..." : "Send")}
      </button>
    );
  },
);
SubmitButton.displayName = "PromptBox.SubmitButton";

/* ─── Suggestions ─────────────────────────────────────────────────── */

export interface PromptBoxSuggestionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
}

export const Suggestions = forwardRef<
  HTMLDivElement,
  PromptBoxSuggestionsProps
>(({ suggestions, onSelect, className, ...props }, ref) => {
  const { setValue } = usePromptBoxContext();

  if (suggestions.length === 0) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "arclo-prompt-suggestions flex flex-wrap gap-2 px-4 pb-2 pt-1",
        className,
      )}
      {...props}
    >
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            setValue(s);
            onSelect?.(s);
          }}
          className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
});
Suggestions.displayName = "PromptBox.Suggestions";
