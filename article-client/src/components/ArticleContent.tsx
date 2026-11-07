"use client";

import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";

export default function ArticleContent({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const codeBlocks = content.querySelectorAll<HTMLPreElement>("pre");
    const cleanups: Array<() => void> = [];

    renderMathInElement(content, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
      strict: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    });

    // Ensure all links in the article open in a new tab securely
    const links = content.querySelectorAll<HTMLAnchorElement>("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (anchor && content.contains(anchor)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    };
    content.addEventListener("click", handleLinkClick);
    cleanups.push(() => content.removeEventListener("click", handleLinkClick));

    codeBlocks.forEach((block) => {
      if (block.querySelector(":scope > .article-code-copy")) return;

      const code = block.querySelector("code");
      const classLanguage = code?.className.match(/language-([\w+#.-]+)/i)?.[1];
      if (!block.hasAttribute("data-language")) {
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
