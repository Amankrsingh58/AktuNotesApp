import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PreviewModal = ({ note, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !note) return null;

  const handleAddToCart = () => {
    onAddToCart(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/90"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl elevation-5 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground line-clamp-1">
            Quick Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Close preview"
          >
            <Icon name="X" size={24} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <Image
                  src={note?.thumbnail}
                  alt={note?.thumbnailAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Preview Pages
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3]?.map((page) => (
                    <div
                      key={page}
                      className="aspect-[3/4] rounded-lg bg-card border border-border flex items-center justify-center"
                    >
                      <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Purchase to view all {note?.pages} pages
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                  {note?.title}
                </h3>
                <p className="text-base text-muted-foreground">
                  {note?.subject}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={20} color="var(--color-accent)" fill="var(--color-accent)" />
                  <span className="text-lg font-medium text-foreground data-text">
                    {note?.rating?.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({note?.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {note?.downloads} downloads
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="BookOpen" size={18} color="var(--color-primary)" />
                    <span className="text-sm text-muted-foreground">Semester</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    Semester {note?.semester}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="FileText" size={18} color="var(--color-primary)" />
                    <span className="text-sm text-muted-foreground">Pages</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground data-text">
                    {note?.pages}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="BarChart3" size={18} color="var(--color-primary)" />
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {note?.difficulty}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="Calendar" size={18} color="var(--color-primary)" />
                    <span className="text-sm text-muted-foreground">Updated</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {note?.lastUpdated}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  What's Included
                </h4>
                <ul className="space-y-2">
                  {note?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Icon name="Check" size={18} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-border">
                <Image
                  src={note?.authorAvatar}
                  alt={note?.authorAvatarAlt}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {note?.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {note?.authorTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-semibold text-foreground data-text">
                ${note?.price?.toFixed(2)}
              </span>
              {note?.originalPrice && (
                <span className="text-lg text-muted-foreground line-through data-text">
                  ${note?.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleAddToCart}
                iconName="ShoppingCart"
                iconSize={20}
                className="flex-1 sm:flex-none"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;