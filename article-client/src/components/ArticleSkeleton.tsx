"use client";

export default function ArticleSkeleton() {
  return (
    <article className="border-b border-border/50 pb-12 last:border-0">
      <div className="flex gap-4 md:gap-12 items-start">
        <div className="flex-1 min-w-0">
          {/* Author Meta */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <span className="text-[13px] text-muted-foreground">·</span>
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="mb-2 space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
          </div>

          {/* Summary */}
          <div className="mb-6 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          </div>

          {/* Actions & Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <div className="h-3 w-8 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              <div className="hidden sm:block h-6 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>

            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-28 shrink-0 bg-muted rounded animate-pulse" />
      </div>
    </article>
  );
}
