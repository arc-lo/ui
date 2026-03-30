"use client";

import { useEffect, useState } from "react";

const themes = [
  { id: "noir", label: "Noir", color: "#1a1a1a", darkColor: "#e2e8f0" },
  { id: "violet", label: "Violet", color: "#6C5CE7", darkColor: "#a78bfa" },
  { id: "ocean", label: "Ocean", color: "#0ea5e9", darkColor: "#38bdf8" },
  { id: "forest", label: "Forest", color: "#10b981", darkColor: "#34d399" },
  { id: "sunset", label: "Sunset", color: "#f97316", darkColor: "#fb923c" },
  { id: "rose", label: "Rose", color: "#f43f5e", darkColor: "#fb7185" },
];

export function ThemePicker() {
  const [active, setActive] = useState("noir");

  useEffect(() => {
    const stored = localStorage.getItem("arclo-color-theme");
    if (stored) {
      setActive(stored);
      if (stored === "noir") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", stored);
      }
    }
  }, []);

  const pick = (id: string) => {
    setActive(id);
    localStorage.setItem("arclo-color-theme", id);
    if (id === "noir") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => pick(t.id)}
          aria-label={`${t.label} theme`}
          title={t.label}
          className="relative w-5 h-5 rounded-full border-2 transition-transform cursor-pointer"
          style={{
            backgroundColor: t.color,
            borderColor: active === t.id ? "var(--docs-heading)" : "transparent",
            transform: active === t.id ? "scale(1.15)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
