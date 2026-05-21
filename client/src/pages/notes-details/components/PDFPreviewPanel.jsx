import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PDFPreviewPanel = ({ note, onOpenFullPreview }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPreviewPages = 3;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < maxPreviewPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 md:px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
          <span className="text-sm font-medium text-foreground">
            Preview (First {maxPreviewPages} pages)
          </span>
        </div>
        <button
          onClick={onOpenFullPreview}
          className="p-2 hover:bg-muted rounded-lg transition-smooth"
          aria-label="Expand preview"
        >
          <Icon name="Maximize2" size={18} color="var(--color-foreground)" />
        </button>
      </div>
      <div className="relative bg-muted/20 aspect-[3/4] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={48} color="var(--color-primary)" />
            </div>
            <p className="text-foreground font-medium mb-2">
              PDF Preview - Page {currentPage} of {maxPreviewPages}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {note?.title}
            </p>
            <div className="bg-card border border-border rounded-lg p-4 max-w-sm mx-auto">
              <p className="text-xs text-muted-foreground">
                This is a preview representation. In production, this would display the actual PDF content using a library like react-pdf.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 px-4 md:px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          <span className="text-sm text-foreground data-text">
            Page {currentPage} / {maxPreviewPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === maxPreviewPages}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>

        <div className="mt-4 bg-warning/10 border border-warning/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Lock" size={16} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80">
              Preview limited to first {maxPreviewPages} pages. Purchase to access all {note?.pageCount} pages with full download capability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewPanel;