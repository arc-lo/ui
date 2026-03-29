"use client";

import { CitationInline, CitationGroup } from "@arc-lo/ui";
import { DemoWrapper } from "../demo-wrapper";

const code = `import { CitationInline, CitationGroup } from "@arc-lo/ui";

{/* Superscript (default) */}
<CitationInline
  index={1}
  href="https://example.com"
  sourceTitle="USGS: Age of the Earth"
  preview="Studies indicate the Earth formed ~4.54 billion years ago."
/>

{/* Bracket */}
<CitationInline index={1} variant="bracket" sourceTitle="Source" />

{/* Pill */}
<CitationInline index={1} variant="pill" sourceTitle="Source" />

{/* Grouped */}
<CitationGroup>
  <CitationInline index={1} sourceTitle="Source A" />
  <CitationInline index={2} sourceTitle="Source B" />
</CitationGroup>`;

export function CitationInlineDemo() {
  return (
    <DemoWrapper title="CitationInline — All Variants" code={code}>
      <div className="space-y-8">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Superscript (default)
          </p>
          <p className="text-sm leading-relaxed text-gray-700">
            The Earth is approximately 4.54 billion years old
            <CitationInline
              index={1}
              href="https://example.com/earth-age"
              sourceTitle="USGS: Age of the Earth"
              preview="Studies of meteorites and rock samples indicate the Earth formed approximately 4.54 billion years ago."
            />{" "}
            and orbits the Sun at an average distance of 93 million miles
            <CitationInline
              index={2}
              sourceTitle="NASA Solar System"
              preview="Earth orbits our Sun at an average distance of 93 million miles (150 million km)."
            />
            .
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Bracket</p>
          <p className="text-sm leading-relaxed text-gray-700">
            Attention mechanisms allow models to focus on relevant parts of the
            input{" "}
            <CitationInline
              index={1}
              variant="bracket"
              sourceTitle="Attention Is All You Need"
              preview="We propose a new simple network architecture, the Transformer, based solely on attention mechanisms."
            />
            . This approach has been widely adopted{" "}
            <CitationInline index={2} variant="bracket" />
            <CitationInline index={3} variant="bracket" />.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Pill</p>
          <p className="text-sm leading-relaxed text-gray-700">
            Recent studies show significant improvements in language
            understanding{" "}
            <CitationInline
              index={1}
              variant="pill"
              sourceTitle="GPT-4 Technical Report"
              preview="GPT-4 exhibits human-level performance on various professional benchmarks."
            />{" "}
            across multiple benchmarks{" "}
            <CitationInline index={2} variant="pill" />.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Grouped citations
          </p>
          <p className="text-sm leading-relaxed text-gray-700">
            This claim is supported by multiple sources
            <CitationGroup>
              <CitationInline
                index={1}
                sourceTitle="Source A"
                preview="First supporting source with detailed evidence."
              />
              <CitationInline
                index={2}
                sourceTitle="Source B"
                preview="Second corroborating source."
              />
              <CitationInline
                index={3}
                sourceTitle="Source C"
                preview="Third independent verification."
              />
            </CitationGroup>
            .
          </p>
        </div>
      </div>
    </DemoWrapper>
  );
}
