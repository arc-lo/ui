"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavSection {
  title: string;
  items: { name: string; href: string }[];
}

export function SidebarNav({ nav }: { nav: NavSection[] }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {nav.map((section) => (
        <div key={section.title}>
          <p
            className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--docs-muted)" }}
          >
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-1.5 text-sm transition-colors"
                    style={
                      isActive
                        ? {
                            color: "var(--arclo-accent-fg, #ffffff)",
                            backgroundColor: "var(--arclo-accent, #1a1a1a)",
                          }
                        : { color: "var(--docs-body)" }
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
