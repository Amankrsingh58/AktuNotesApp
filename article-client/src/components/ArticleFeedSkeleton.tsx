"use client";

import ArticleSkeleton from "./ArticleSkeleton";

export default function ArticleFeedSkeleton() {
  return (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      <div className="flex items-center gap-8 border-b border-border mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <ArticleSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
