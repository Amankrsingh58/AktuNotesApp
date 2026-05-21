import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PDFPreviewModal = ({ isOpen, onClose, note }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const maxPreviewPages = 3;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/95"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[90vh] bg-card rounded-2xl shadow-2xl elevation-5 overflow-hidden flex flex-col">
        <div className="bg-muted/50 px-4 md:px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {note?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Preview Mode - Page {currentPage} of {maxPreviewPages}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Close preview"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20">
          <div className="min-h-full flex items-center justify-center p-8">
            <div
              className="bg-card shadow-lg"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                transition: 'transform 250ms ease-out'
              }}
            >
              <div className="w-[600px] aspect-[3/4] flex items-center justify-center border border-border">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileText" size={48} color="var(--color-primary)" />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    PDF Preview - Page {currentPage}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Zoom: {zoom}%
                  </p>
                  <div className="bg-muted/50 border border-border rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-xs text-muted-foreground">
                      This is a preview representation. In production, this would display the actual PDF content using a library like react-pdf with full zoom and navigation capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 px-4 md:px-6 py-4 border-t border-border flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />

              <span className="text-sm text-foreground data-text min-w-[8rem] text-center">
                Page {currentPage} / {maxPreviewPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === maxPreviewPages}
                iconName="ChevronRight"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom === 50}
                iconName="ZoomOut"
              />

              <span className="text-sm text-foreground data-text min-w-[4rem] text-center">
                {zoom}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom === 200}
                iconName="ZoomIn"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Download">
                Download Preview
              </Button>
            </div>
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
    </div>
  );
};

export default PDFPreviewModal;