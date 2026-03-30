# Project Rules

## Dual Theme Check

Every UI change must be verified in both light and dark themes before writing code.

Before making any visual/styling change to a component:

1. Check the current light theme values for any CSS variable or class being changed
2. Check the current dark theme values
3. Verify hover, active, and default states work in both themes
4. Never use hardcoded Tailwind color classes (like `bg-gray-100`, `text-gray-400`) in library components — always use theme CSS variables
5. When adding hover/active styles, ensure they don't override each other (e.g. hover shouldn't clobber active state color)
