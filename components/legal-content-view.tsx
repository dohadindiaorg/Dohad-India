import React from "react";
import { LegalDocument } from "@/lib/cms-defaults";

function renderTextWithLinks(text: string): React.ReactNode {
  // Regex to detect email addresses or urls
  const tokenRegex = /((?:https?:\/\/[^\s)]+)|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))/g;
  const parts = text.split(tokenRegex);

  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    if (part.includes("@") && !part.startsWith("http")) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="text-primary hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function LegalContentView({ document }: { document: LegalDocument }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">{document.title}</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        {document.lastUpdated ? (
          <p className="text-sm text-gray-500">
            Last updated: {document.lastUpdated}
          </p>
        ) : null}

        {document.sections.map((section, sIdx) => {
          const chunks = section.content.split(/\n\n+/);

          return (
            <section key={section.id || sIdx}>
              {section.title && (
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              )}

              <div className="space-y-4">
                {chunks.map((chunk, cIdx) => {
                  const lines = chunk.split("\n");
                  const hasBullets = lines.some(
                    (l) =>
                      l.trim().startsWith("- ") || l.trim().startsWith("* ")
                  );

                  if (hasBullets) {
                    const introLines: string[] = [];
                    const bulletLines: string[] = [];
                    let passedIntro = false;

                    for (const line of lines) {
                      const trimmed = line.trim();
                      if (
                        trimmed.startsWith("- ") ||
                        trimmed.startsWith("* ")
                      ) {
                        passedIntro = true;
                        bulletLines.push(trimmed.replace(/^[-*]\s+/, ""));
                      } else if (!passedIntro) {
                        introLines.push(line);
                      } else {
                        bulletLines.push(trimmed);
                      }
                    }

                    return (
                      <div key={cIdx} className="space-y-2">
                        {introLines.length > 0 && (
                          <p className="leading-relaxed">
                            {renderTextWithLinks(introLines.join(" "))}
                          </p>
                        )}
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          {bulletLines.map((bullet, bIdx) => (
                            <li key={bIdx}>{renderTextWithLinks(bullet)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  return (
                    <p key={cIdx} className="leading-relaxed">
                      {renderTextWithLinks(chunk)}
                    </p>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
