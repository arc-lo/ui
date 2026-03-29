/**
 * arclo theme CSS custom properties.
 *
 * Light mode (default) — no setup needed.
 * Dark mode — set variables on a parent element or use prefers-color-scheme:
 *
 * ```css
 * :root {
 *   --arclo-accent: #6C5CE7;
 *   --arclo-accent-hover: #5A4BD1;
 *   --arclo-surface: #ffffff;
 *   --arclo-surface-secondary: #f9fafb;
 *   --arclo-border: #e5e7eb;
 *   --arclo-text: #1a1a1a;
 *   --arclo-text-secondary: #6b7280;
 *   --arclo-text-muted: #9ca3af;
 *   --arclo-error: #ef4444;
 *   --arclo-error-surface: #fef2f2;
 *   --arclo-warning: #f59e0b;
 *   --arclo-warning-surface: #fffbeb;
 * }
 *
 * @media (prefers-color-scheme: dark) {
 *   :root {
 *     --arclo-accent: #a78bfa;
 *     --arclo-accent-hover: #8b6ff7;
 *     --arclo-surface: #1a1a2e;
 *     --arclo-surface-secondary: #16213e;
 *     --arclo-border: #2d2d44;
 *     --arclo-text: #e2e8f0;
 *     --arclo-text-secondary: #94a3b8;
 *     --arclo-text-muted: #64748b;
 *     --arclo-error: #f87171;
 *     --arclo-error-surface: #451a1a;
 *     --arclo-warning: #fbbf24;
 *     --arclo-warning-surface: #452a1a;
 *   }
 * }
 *
 * // Or class-based:
 * .dark {
 *   --arclo-surface: #1a1a2e;
 *   // ...
 * }
 * ```
 */
export const themeVars = {
  accent: "var(--arclo-accent, #6C5CE7)",
  accentHover: "var(--arclo-accent-hover, #5A4BD1)",
  accentBright: "var(--arclo-accent-bright, rgb(167,139,250))",
  surface: "var(--arclo-surface, #ffffff)",
  surfaceSecondary: "var(--arclo-surface-secondary, #f9fafb)",
  border: "var(--arclo-border, #e5e7eb)",
  text: "var(--arclo-text, #1a1a1a)",
  textSecondary: "var(--arclo-text-secondary, #6b7280)",
  textMuted: "var(--arclo-text-muted, #9ca3af)",
  error: "var(--arclo-error, #ef4444)",
  errorSurface: "var(--arclo-error-surface, #fef2f2)",
  warning: "var(--arclo-warning, #f59e0b)",
  warningSurface: "var(--arclo-warning-surface, #fffbeb)",
  radius: "var(--arclo-radius, 0.75rem)",
} as const;
