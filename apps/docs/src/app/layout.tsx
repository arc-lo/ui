import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "arclo — AI-native design system",
  description:
    "React components for AI interfaces. Streaming, confidence, prompts, feedback, citations, and refusals — built on Radix, extended for AI.",
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
