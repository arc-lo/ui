import { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { themeVars } from "../lib/theme";

/* ─── Types ──────────────────────────────────────────────────────── */

export type MessageRole = "user" | "assistant" | "system";

/* ─── Root ────────────────────────────────────────────────────────── */

export interface ChatThreadRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Root = forwardRef<HTMLDivElement, ChatThreadRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("arclo-chat-thread flex flex-col", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Root.displayName = "ChatThread.Root";

/* ─── Messages ───────────────────────────────────────────────────── */

export interface ChatThreadMessagesProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Messages = forwardRef<HTMLDivElement, ChatThreadMessagesProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "arclo-chat-messages flex-1 overflow-y-auto space-y-4 p-4",
          className,
        )}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `var(--arclo-border, #e5e7eb) transparent`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Messages.displayName = "ChatThread.Messages";

/* ─── Message ────────────────────────────────────────────────────── */

export interface ChatThreadMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** The role determines visual styling and alignment */
  role: MessageRole;
  /** Optional avatar element (icon, image, etc.) */
  avatar?: ReactNode;
  /** Display name for the message author */
  name?: string;
  /** Timestamp string to display */
  timestamp?: string;
  children: ReactNode;
}

export const Message = forwardRef<HTMLDivElement, ChatThreadMessageProps>(
  ({ role, avatar, name, timestamp, children, className, ...props }, ref) => {
    if (role === "system") {
      return (
        <div
          ref={ref}
          data-role={role}
          className={cn(
            "arclo-chat-message flex justify-center",
            className,
          )}
          {...props}
        >
          <div
            className="max-w-md rounded-lg px-4 py-2 text-center text-xs"
            style={{ color: themeVars.textMuted }}
          >
            {(name || timestamp) && (
              <div className="mb-1 flex items-center justify-center gap-2">
                {avatar}
                {name && <span className="font-medium">{name}</span>}
                {timestamp && <span className="opacity-60">{timestamp}</span>}
              </div>
            )}
            <div>{children}</div>
          </div>
        </div>
      );
    }

    const isUser = role === "user";

    return (
      <div
        ref={ref}
        data-role={role}
        className={cn(
          "arclo-chat-message flex gap-3",
          isUser ? "flex-row-reverse" : "flex-row",
          className,
        )}
        {...props}
      >
        {/* Avatar */}
        {avatar && (
          <div className="flex-shrink-0 mt-1">{avatar}</div>
        )}

        {/* Bubble */}
        <div
          className={cn("max-w-[80%] min-w-0", isUser ? "items-end" : "items-start")}
        >
          {/* Header */}
          {(name || timestamp) && (
            <div
              className={cn(
                "mb-1 flex items-center gap-2 text-xs",
                isUser ? "justify-end" : "justify-start",
              )}
              style={{ color: themeVars.textSecondary }}
            >
              {name && <span className="font-medium">{name}</span>}
              {timestamp && <span className="opacity-60">{timestamp}</span>}
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser ? "rounded-tr-sm" : "rounded-tl-sm",
            )}
            style={
              isUser
                ? {
                    backgroundColor: themeVars.accent,
                    color: themeVars.accentFg,
                  }
                : {
                    backgroundColor: themeVars.surface,
                    color: themeVars.text,
                    border: `1px solid ${themeVars.border}`,
                  }
            }
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Message.displayName = "ChatThread.Message";

/* ─── UserMessage ────────────────────────────────────────────────── */

export interface ChatThreadUserMessageProps
  extends Omit<ChatThreadMessageProps, "role"> {}

export const UserMessage = forwardRef<HTMLDivElement, ChatThreadUserMessageProps>(
  (props, ref) => <Message ref={ref} role="user" {...props} />,
);
UserMessage.displayName = "ChatThread.UserMessage";

/* ─── AssistantMessage ───────────────────────────────────────────── */

export interface ChatThreadAssistantMessageProps
  extends Omit<ChatThreadMessageProps, "role"> {}

export const AssistantMessage = forwardRef<
  HTMLDivElement,
  ChatThreadAssistantMessageProps
>((props, ref) => <Message ref={ref} role="assistant" {...props} />);
AssistantMessage.displayName = "ChatThread.AssistantMessage";

/* ─── SystemMessage ──────────────────────────────────────────────── */

export interface ChatThreadSystemMessageProps
  extends Omit<ChatThreadMessageProps, "role"> {}

export const SystemMessage = forwardRef<
  HTMLDivElement,
  ChatThreadSystemMessageProps
>((props, ref) => <Message ref={ref} role="system" {...props} />);
SystemMessage.displayName = "ChatThread.SystemMessage";

/* ─── ScrollAnchor ───────────────────────────────────────────────── */

export interface ChatThreadScrollAnchorProps
  extends HTMLAttributes<HTMLDivElement> {}

export const ScrollAnchor = forwardRef<HTMLDivElement, ChatThreadScrollAnchorProps>(
  ({ className, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);

    // Merge forwarded ref with inner ref
    const setRef = (node: HTMLDivElement | null) => {
      (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      // Find the scrollable parent (the Messages container)
      const scrollParent = el.closest(".arclo-chat-messages");

      const observer = new MutationObserver(() => {
        if (scrollParent) {
          scrollParent.scrollTo({
            top: scrollParent.scrollHeight,
            behavior: "smooth",
          });
        }
      });

      const parent = el.parentElement;
      if (parent) {
        observer.observe(parent, { childList: true, subtree: true });
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={setRef}
        aria-hidden
        className={cn("arclo-chat-scroll-anchor h-px", className)}
        {...props}
      />
    );
  },
);
ScrollAnchor.displayName = "ChatThread.ScrollAnchor";
