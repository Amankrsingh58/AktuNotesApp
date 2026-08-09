"use client";

import React, { useRef, useEffect, useState } from "react";
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
  const savedSelectionRef = useRef<Range | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("JavaScript");
  const [codeValue, setCodeValue] = useState("");

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

  useEffect(() => {
    if (!isCodeModalOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCodeModalOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isCodeModalOpen]);

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

  const openCodeModal = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
    setIsCodeModalOpen(true);
  };

  const closeCodeModal = () => {
    setIsCodeModalOpen(false);
    setCodeValue("");
  };

  const insertCodeBlock = () => {
    if (!codeValue.trim()) return;

    const language = codeLanguage.trim().replace(/[^a-z0-9+#.-]/gi, "").slice(0, 24) || "code";
    const escapedCode = codeValue
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const selection = window.getSelection();
    if (selection && savedSelectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }

    execCommand("insertHTML", `<pre data-language="${language}"><code class="language-${language.toLowerCase()}">${escapedCode}</code></pre><p><br></p>`);
    handleInput();
    closeCodeModal();
  };

  const resetNewLineColor = () => {
    window.setTimeout(() => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      const anchor = selection?.anchorNode;
      if (!editor || !anchor || !editor.contains(anchor)) return;

      const anchorElement = anchor.nodeType === Node.ELEMENT_NODE
        ? (anchor as Element)
        : anchor.parentElement;
      const block = anchorElement?.closest("p, div, li, h1, h2, h3, blockquote");
      if (!block || block === editor) return;

      const colorAncestor = anchorElement?.closest("font[color], span[style*='color']");
      if (colorAncestor && colorAncestor !== block && colorAncestor.contains(block)) {
        colorAncestor.parentNode?.insertBefore(block, colorAncestor.nextSibling);
      }

      block.querySelectorAll<HTMLElement>("font[color], span[style*='color']").forEach((element) => {
        element.removeAttribute("color");
        element.style.removeProperty("color");
      });
      handleInput();
    }, 0);
  };

  return (
    <div className="relative group">
      {/* Floating Toolbar */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-center gap-1 p-1 bg-card border border-border shadow-lg rounded-xl mb-4 max-w-full mx-auto">
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="flex items-center gap-1.5 p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
          title="Reset Formatting"
          aria-label="Reset formatting"
        >
          <Icon name="Eraser" size={18} />
          <span className="hidden text-xs font-semibold sm:inline">Reset</span>
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
          onClick={openCodeModal}
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
        onKeyUp={(event) => {
          if (event.key === "Enter") resetNewLineColor();
        }}
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

      {isCodeModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeCodeModal();
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="code-modal-title" className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 id="code-modal-title" className="text-lg font-bold text-foreground">Insert code block</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose a language label and paste code exactly as readers should see it.</p>
              </div>
              <button type="button" onClick={closeCodeModal} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close code dialog">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground">Language</span>
                <input
                  list="code-language-options"
                  value={codeLanguage}
                  onChange={(event) => setCodeLanguage(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="JavaScript, Bash, JSON..."
                  autoFocus
                />
                <datalist id="code-language-options">
                  <option value="JavaScript" />
                  <option value="TypeScript" />
                  <option value="Bash" />
                  <option value="JSON" />
                  <option value="HTML" />
                  <option value="CSS" />
                  <option value="Python" />
                  <option value="PowerShell" />
                  <option value="SQL" />
                  <option value="Text" />
                </datalist>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground">Code</span>
                <textarea
                  value={codeValue}
                  onChange={(event) => setCodeValue(event.target.value)}
                  className="min-h-72 w-full resize-y rounded-xl border border-slate-700 bg-[#0b1220] p-4 font-mono text-sm leading-6 text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder={'const message = "Hello, Cognora";'}
                  spellCheck={false}
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button type="button" onClick={closeCodeModal} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
              <button type="button" onClick={insertCodeBlock} disabled={!codeValue.trim()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45">
                Insert code
              </button>
            </div>
          </section>
        </div>
      )}

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
