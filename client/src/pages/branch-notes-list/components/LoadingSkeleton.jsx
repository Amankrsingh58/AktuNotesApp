import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count })?.map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-muted" />
          <div className="p-4 md:p-5 lg:p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-4 bg-muted rounded w-20" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-12" />
              <div className="h-6 bg-muted rounded w-16" />
            </div>
            <div className="h-6 bg-muted rounded w-20" />
            <div className="flex items-center space-x-2">
              <div className="h-9 bg-muted rounded flex-1" />
              <div className="h-9 bg-muted rounded flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;