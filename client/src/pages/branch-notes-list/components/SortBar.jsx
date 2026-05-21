import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SortBar = ({ 
  sortBy, 
  onSortChange, 
  resultCount, 
  onToggleFilters,
  viewMode,
  onViewModeChange 
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating-high', label: 'Highest Rated' },
    { value: 'rating-low', label: 'Lowest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-5 lg:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            iconName="SlidersHorizontal"
            iconSize={18}
            className="lg:hidden"
          >
            Filters
          </Button>
          
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm md:text-base text-foreground">
              <span className="font-semibold data-text">{resultCount}</span>
              <span className="text-muted-foreground ml-1">notes found</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 border border-border rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded transition-smooth ${
                viewMode === 'grid' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="Grid view"
            >
              <Icon name="Grid3x3" size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded transition-smooth ${
                viewMode === 'list' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="List view"
            >
              <Icon name="List" size={18} />
            </button>
          </div>

          <div className="w-48 sm:w-56">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortBar;