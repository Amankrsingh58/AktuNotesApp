"use client";

import React, { useRef, useEffect } from "react";
import Icon from "./Icons";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tell your story...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content with external value
  useEffect(() => {
    if (editorRef.current) {
      if (value !== editorRef.current.innerHTML) {
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = value || "";
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val: string | null = null) => {
    document.execCommand(command, false, val || undefined);
    editorRef.current?.focus();
  };

  const applyColor = (color: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    document.execCommand("foreColor", false, color);
    selection.collapseToEnd();
    document.execCommand("foreColor", false, "#000000");
    editorRef.current?.focus();
  };

  const insertCodeBlock = () => {
    const languageInput = prompt("Language label (for example: JavaScript):", "JavaScript");
    if (languageInput === null) return;

    const code = prompt("Paste the code for this block:");
    if (!code) return;

    const language = languageInput.trim().replace(/[^a-z0-9+#.-]/gi, "").slice(0, 24) || "code";
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    execCommand(
      "insertHTML",
      `<pre data-language="${language}"><code class="language-${language.toLowerCase()}">${escapedCode}</code></pre><p><br></p>`
    );
    handleInput();
  };

  return (
    <div className="relative group">
      {/* Floating Toolbar */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-center gap-1 p-1 bg-card border border-border shadow-lg rounded-xl mb-4 max-w-full mx-auto">
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
          title="Clear Formatting"
        >
          <Icon name="Eraser" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("undo")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Undo"
        >
          <Icon name="Undo2" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "p")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Normal Text"
        >
          <Icon name="Pilcrow" size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h2")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Heading"
        >
          <Icon name="Heading2" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Bold"
        >
          <Icon name="Bold" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Italic"
        >
          <Icon name="Italic" size={18} />
        </button>
        <button
          type="button"
          onClick={() => applyColor("#3b82f6")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-blue-500"
          title="Blue Text"
        >
          <Icon name="Type" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("foreColor", "#000000")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Default Color"
        >
          <Icon name="Baseline" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("backColor", "#fef08a")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-amber-500"
          title="Highlight"
        >
          <Icon name="Highlighter" size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const value = prompt("Enter a secure URL:", "https://");
            if (!value) return;

            try {
              const url = new URL(value);
              if (!['http:', 'https:'].includes(url.protocol)) {
                alert("Only http:// and https:// links are allowed.");
                return;
              }
              execCommand("createLink", url.toString());
            } catch {
              alert("Please enter a valid URL, including https://.");
            }
          }}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Insert Link"
        >
          <Icon name="Link" size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Steps (Numbered List)"
        >
          <Icon name="ListOrdered" size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Bullet List"
        >
          <Icon name="List" size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button
          type="button"
          onClick={insertCodeBlock}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Insert Code Block"
          aria-label="Insert code block"
        >
          <Icon name="Code2" size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
        className={cn(
          "w-full min-h-[400px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 focus:ring-0",
          "prose dark:prose-invert max-w-none relative"
        )}
        data-placeholder={placeholder}
      />

      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #64748b;
          cursor: text;
          position: absolute;
          left: 0;
          top: 0;
        }
        [contenteditable] {
          outline: none;
        }
      `}</style>
    </div>
  );
}
