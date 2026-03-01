import React from "react";

export const JackpotSkeleton = () => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-10 bg-muted rounded" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const TabSkeleton = () => (
  <div className="animate-pulse p-4 space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-20 bg-muted rounded-xl" />
    ))}
  </div>
);
