import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "arclo — AI-native design system for React",
    template: "%s | arclo",
  },
  description:
    "20 React components for AI interfaces — streaming text, prompts, confidence badges, citations, thinking blocks, tool calls, image/video generation, and more. Built on Radix. 6 color themes. Works with shadcn/ui.",
  keywords: [
    "react",
    "design system",
    "ai components",
    "chatbot ui",
    "streaming text",
    "llm ui",
    "ai interface",
    "radix",
    "shadcn",
    "tailwind css",
    "confidence badge",
    "thinking block",
    "tool call",
    "prompt box",
    "feedback bar",
    "image generation",
    "video generation",
    "chat thread",
    "ai ux",
  ],
  authors: [{ name: "arclo" }],
  creator: "arclo",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "arclo",
    title: "arclo — AI-native design system for React",
    description:
      "20 React components for AI interfaces. Streaming, prompts, confidence, feedback, citations, refusals, thinking blocks, tool calls, and media generation.",
    url: "https://arc-lo.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "arclo — AI-native design system for React",
    description:
      "20 React components for AI interfaces. Built on Radix. Works with shadcn/ui.",
  },
  metadataBase: new URL("https://arc-lo.com"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("arclo-theme");var c=localStorage.getItem("arclo-color-theme");if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.add("light")}if(c&&c!=="noir"){document.documentElement.setAttribute("data-theme",c)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
