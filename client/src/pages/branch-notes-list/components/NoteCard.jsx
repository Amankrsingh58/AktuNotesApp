import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCart } from '../../../contexts/CartContext';

const NoteCard = ({ note, onAddToCart, onQuickPreview }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/note-details?id=${note?.id}`);
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    addToCart(note, 1);
    if (onAddToCart) {
      onAddToCart(note);
    }
  };

  const handlePreview = (e) => {
    e?.stopPropagation();
    onQuickPreview(note);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-smooth hover-lift card-shadow hover:card-shadow-hover cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={note?.thumbnail}
          alt={note?.thumbnailAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {note?.isBestseller && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-md">
              Bestseller
            </span>
          )}
          {note?.isNew && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
              New
            </span>
          )}
        </div>
      </div>
      <div className="p-4 md:p-5 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
              {note?.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {note?.subject}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="BookOpen" size={14} />
            <span>Sem {note?.semester}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="FileText" size={14} />
            <span>{note?.pages} pages</span>
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} color="var(--color-accent)" fill="var(--color-accent)" />
              <span className="text-sm font-medium text-foreground data-text">
                {note?.rating?.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({note?.reviewCount})
            </span>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${getDifficultyColor(note?.difficulty)}`}>
            {note?.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-semibold text-foreground data-text">
              ${note?.price?.toFixed(2)}
            </span>
            {note?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through data-text">
                ${note?.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {note?.downloads} downloads
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            iconName="Eye"
            iconSize={16}
            className="flex-1"
          >
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            iconName="ShoppingCart"
            iconSize={16}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>

        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
          <Image
            src={note?.authorAvatar}
            alt={note?.authorAvatarAlt}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-muted-foreground line-clamp-1">
            by {note?.authorName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;