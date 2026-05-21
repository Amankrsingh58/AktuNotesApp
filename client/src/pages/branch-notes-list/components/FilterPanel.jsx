import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  isMobileOpen,
  onMobileClose
}) => {
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'database', label: 'Database Management' },
    { value: 'operating-systems', label: 'Operating Systems' },
    { value: 'computer-networks', label: 'Computer Networks' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'machine-learning', label: 'Machine Learning' }
  ];

  const semesterOptions = [
    { value: 'all', label: 'All Semesters' },
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5', label: '$0 - $5' },
    { value: '5-10', label: '$5 - $10' },
    { value: '10-15', label: '$10 - $15' },
    { value: '15-20', label: '$15 - $20' },
    { value: '20+', label: '$20+' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' }
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-[60] lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-[70] lg:z-0
          w-80 lg:w-full bg-card lg:bg-transparent
          border-r lg:border-r-0 border-border
          transform transition-transform lg:transform-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto p-4 lg:p-0">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Close filters"
            >
              <Icon name="X" size={20} color="var(--color-foreground)" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">
                Active Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  iconName="X"
                  iconSize={14}
                >
                  Clear All
                </Button>
              )}
            </div>

            <Select
              label="Subject"
              options={subjectOptions}
              value={filters?.subject}
              onChange={(value) => onFilterChange('subject', value)}
              searchable
            />

            <Select
              label="Semester"
              options={semesterOptions}
              value={filters?.semester}
              onChange={(value) => onFilterChange('semester', value)}
            />

            <Select
              label="Difficulty Level"
              options={difficultyOptions}
              value={filters?.difficulty}
              onChange={(value) => onFilterChange('difficulty', value)}
            />

            <Select
              label="Price Range"
              options={priceRangeOptions}
              value={filters?.priceRange}
              onChange={(value) => onFilterChange('priceRange', value)}
            />

            <Select
              label="Minimum Rating"
              options={ratingOptions}
              value={filters?.rating}
              onChange={(value) => onFilterChange('rating', value)}
            />

            <div className="pt-4 border-t border-border lg:hidden">
              <Button
                variant="default"
                fullWidth
                onClick={onMobileClose}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;