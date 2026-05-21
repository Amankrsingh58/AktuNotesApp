import React, { useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Sync editor content with external value (crucial for loading existing articles)
  useEffect(() => {
    if (editorRef.current) {
      // Only update if the editor is empty and we have a value (initial load)
      // or if the value has changed significantly (e.g. switching articles)
      if (value !== editorRef.current.innerHTML) {
        // If the editor is currently focused, don't reset innerHTML as it kills the cursor
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = value || '';
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const applyColor = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    // Apply the color to selected text
    document.execCommand('foreColor', false, color);
    
    // Collapse cursor to end of selection so new text starts fresh
    selection.collapseToEnd();
    
    // Reset color back to black for any new text typed after
    document.execCommand('foreColor', false, '#000000');
    
    editorRef.current.focus();
  };

  return (
    <div className="relative group">
      {/* Floating Toolbar (Simplified for within component) */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-center gap-1 p-1 bg-card border border-border shadow-lg rounded-xl mb-4 max-w-full mx-auto">
        <button 
          onClick={() => execCommand('removeFormat')}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500"
          title="Clear Formatting"
        >
          <Icon name="Eraser" size={18} />
        </button>
        <button 
          onClick={() => execCommand('undo')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Undo"
        >
          <Icon name="Undo2" size={18} />
        </button>
        <button 
          onClick={() => execCommand('formatBlock', 'p')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Normal Text"
        >
          <Icon name="Pilcrow" size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button 
          onClick={() => execCommand('formatBlock', 'h2')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Heading"
        >
          <Icon name="Heading2" size={18} />
        </button>
        <button 
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Bold"
        >
          <Icon name="Bold" size={18} />
        </button>
        <button 
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Italic"
        >
          <Icon name="Italic" size={18} />
        </button>
        <button 
          onClick={() => applyColor('#3b82f6')}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-blue-500"
          title="Blue Text"
        >
          <Icon name="Type" size={18} />
        </button>
        <button 
          onClick={() => execCommand('foreColor', '#000000')}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title="Default Color"
        >
          <Icon name="Baseline" size={18} />
        </button>
        <button 
          onClick={() => execCommand('backColor', '#fef08a')}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-amber-500"
          title="Highlight"
        >
          <Icon name="Highlighter" size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button 
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Steps (Numbered List)"
        >
          <Icon name="ListOrdered" size={18} />
        </button>
        <button 
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Bullet List"
        >
          <Icon name="List" size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        className={cn(
          "w-full min-h-[400px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 focus:ring-0",
          "prose dark:prose-invert max-w-none"
        )}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
        [contenteditable] {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
