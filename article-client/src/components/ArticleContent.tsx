"use client";

import { useEffect, useRef } from "react";

export default function ArticleContent({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const codeBlocks = content.querySelectorAll<HTMLPreElement>("pre");
    const cleanups: Array<() => void> = [];

    codeBlocks.forEach((block) => {
      if (block.querySelector(":scope > .article-code-copy")) return;

      const code = block.querySelector("code");
      const classLanguage = code?.className.match(/language-([\w+#.-]+)/i)?.[1];
      if (!block.dataset.language) {
        block.dataset.language = classLanguage || "code";
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "article-code-copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
      button.textContent = "Copy";

      const copyCode = async () => {
        try {
          await navigator.clipboard.writeText(code?.textContent || block.textContent || "");
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = "Copy";
          }, 1600);
        } catch {
          button.textContent = "Copy failed";
        }
      };

      button.addEventListener("click", copyCode);
      block.prepend(button);
      cleanups.push(() => button.removeEventListener("click", copyCode));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
