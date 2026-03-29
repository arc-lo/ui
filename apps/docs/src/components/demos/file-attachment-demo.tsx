"use client";

import { useState } from "react";
import { FileAttachment } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const chipCode = `<div className="flex flex-wrap gap-2">
  <FileAttachment name="report.pdf" size="2.4 MB" type="pdf" />
  <FileAttachment name="photo.jpg" size="1.2 MB" type="image" />
  <FileAttachment name="data.csv" size="340 KB" type="csv" />
  <FileAttachment name="main.tsx" size="4 KB" type="code" onRemove={() => {}} />
</div>`;

const cardCode = `<div className="flex flex-wrap gap-3">
  <FileAttachment
    variant="card"
    name="screenshot.png"
    size="1.8 MB"
    type="image"
    preview="https://picsum.photos/200/150"
    onRemove={() => {}}
  />
  <FileAttachment variant="card" name="notes.txt" size="12 KB" type="text" />
</div>`;

const progressCode = `<FileAttachment name="upload.zip" size="24 MB" type="other" progress={progress} />`;

export function FileAttachmentChipDemo() {
  const [files, setFiles] = useState([
    { name: "report.pdf", size: "2.4 MB", type: "pdf" as const },
    { name: "photo.jpg", size: "1.2 MB", type: "image" as const },
    { name: "data.csv", size: "340 KB", type: "csv" as const },
    { name: "main.tsx", size: "4 KB", type: "code" as const },
  ]);

  return (
    <DemoWrapper title="FileAttachment — Chip Variant" code={chipCode}>
      <div className="flex flex-wrap gap-2">
        {files.map((f) => (
          <FileAttachment
            key={f.name}
            name={f.name}
            size={f.size}
            type={f.type}
            onRemove={() => setFiles((prev) => prev.filter((x) => x.name !== f.name))}
          />
        ))}
        {files.length === 0 && (
          <p className="text-xs text-gray-400 italic">All files removed. Refresh to reset.</p>
        )}
      </div>
    </DemoWrapper>
  );
}

export function FileAttachmentCardDemo() {
  return (
    <DemoWrapper title="FileAttachment — Card Variant" code={cardCode}>
      <div className="flex flex-wrap gap-3">
        <FileAttachment
          variant="card"
          name="screenshot.png"
          size="1.8 MB"
          type="image"
          preview="https://picsum.photos/200/150"
          onRemove={() => {}}
        />
        <FileAttachment
          variant="card"
          name="notes.txt"
          size="12 KB"
          type="text"
        />
        <FileAttachment
          variant="card"
          name="index.tsx"
          size="3.2 KB"
          type="code"
        />
      </div>
    </DemoWrapper>
  );
}

export function FileAttachmentProgressDemo() {
  const [progress, setProgress] = useState(0);

  const simulate = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <DemoWrapper title="FileAttachment — Upload Progress" code={progressCode}>
      <div className="space-y-3">
        <button
          onClick={simulate}
          className="rounded-full bg-[#6C5CE7] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#5A4BD1] cursor-pointer"
        >
          Simulate upload
        </button>
        <div className="flex gap-3">
          <FileAttachment
            name="upload.zip"
            size="24 MB"
            type="other"
            progress={progress}
          />
          <FileAttachment
            variant="card"
            name="upload.zip"
            size="24 MB"
            type="other"
            progress={progress}
          />
        </div>
      </div>
    </DemoWrapper>
  );
}
