import { ThemingExample } from "@/components/examples/theming-example";
import { CodeBlock } from "@/components/code-block";
import { InfoTable } from "@/components/props-table";

export default function ThemingPage() {
  return (
    <article className="prose prose-gray max-w-3xl">
      <h1>Theming</h1>
      <p>
        arclo uses CSS custom properties for all visual styling. Override a few
        variables to match your brand — no build step, no config files.
      </p>

      <h2>Quick Start</h2>
      <p>
        Import the styles and you're ready to go. The default theme is Noir
        (black accent).
      </p>
      <CodeBlock
        code={`import "@arc-lo/ui/styles.css";`}
        lang="tsx"
      />

      <h2>Color Themes</h2>
      <p>
        arclo ships with 6 built-in color themes. Add a{" "}
        <code>data-theme</code> attribute to your HTML element to switch:
      </p>

      <ThemingExample />

      <h2>Custom Theme</h2>
      <p>
        You can create your own theme by overriding the CSS variables directly:
      </p>
      <CodeBlock
        code={`/* In your global CSS */
:root {
  --arclo-accent: #e63946;
  --arclo-accent-hover: #c1121f;
  --arclo-accent-fg: #ffffff;
  --arclo-surface: #fafafa;
  --arclo-border: #e0e0e0;
}

/* Or scope to a container */
.my-chat-widget {
  --arclo-accent: #264653;
  --arclo-accent-hover: #1d3a47;
  --arclo-accent-fg: #ffffff;
}`}
        lang="css"
      />

      <h2>Dark Mode</h2>
      <p>
        arclo supports dark mode via both{" "}
        <code>prefers-color-scheme</code> media query and a{" "}
        <code>.dark</code> class on the root element. Color themes work
        independently of dark/light mode.
      </p>
      <CodeBlock
        code={`/* Automatic — follows system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --arclo-surface: #0a0a0a;
    --arclo-border: #27272a;
  }
}

/* Manual — toggle via class */
.dark {
  --arclo-surface: #0a0a0a;
  --arclo-border: #27272a;
}

/* HTML usage */
<html class="dark" data-theme="violet">`}
        lang="css"
      />

      <h2>Available Variables</h2>
      <InfoTable
        title="CSS Custom Properties"
        headers={["Variable", "Default", "Description"]}
        rows={[
          {
            cells: [
              "--arclo-accent",
              "#1a1a1a",
              "Primary accent color used for buttons, active states, and highlights",
            ],
          },
          {
            cells: [
              "--arclo-accent-hover",
              "#333333",
              "Hover state for the accent color",
            ],
          },
          {
            cells: [
              "--arclo-accent-fg",
              "#ffffff",
              "Foreground (text) color on accent backgrounds",
            ],
          },
          {
            cells: [
              "--arclo-surface",
              "#ffffff",
              "Background color for component surfaces (cards, chat, panels)",
            ],
          },
          {
            cells: [
              "--arclo-border",
              "#e5e7eb",
              "Border color for component outlines and dividers",
            ],
          },
          {
            cells: [
              "--arclo-text",
              "#111827",
              "Primary text color inside components",
            ],
          },
          {
            cells: [
              "--arclo-text-muted",
              "#6b7280",
              "Secondary/muted text color for labels and placeholders",
            ],
          },
          {
            cells: [
              "--arclo-radius",
              "0.5rem",
              "Border radius for components",
            ],
          },
        ]}
      />
    </article>
  );
}
