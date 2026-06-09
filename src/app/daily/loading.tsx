import React from 'react';

export default function DailyLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header section skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-surface-card rounded"></div>
          <div className="h-8 w-64 bg-surface-card rounded"></div>
          <div className="h-4 w-40 bg-surface-card rounded mt-1"></div>
        </div>
        <div className="h-9 w-44 bg-surface-card rounded-full hidden sm:block"></div>
      </div>

      {/* Main Card skeleton */}
      <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#e6dfd8] pb-5">
          <div className="h-4 w-20 bg-surface-card rounded"></div>
          <div className="h-4 w-16 bg-surface-card rounded"></div>
        </div>

        <div className="h-7 w-3/4 bg-surface-card rounded"></div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-5 w-16 bg-surface-card rounded-full"></div>
          <div className="h-5 w-20 bg-surface-card rounded-full"></div>
          <div className="h-5 w-14 bg-surface-card rounded-full"></div>
        </div>

        {/* Problem Statement skeleton lines */}
        <div className="space-y-3 pt-6 border-t border-[#e6dfd8]">
          <div className="h-4 w-full bg-surface-card rounded"></div>
          <div className="h-4 w-11/12 bg-surface-card rounded"></div>
          <div className="h-4 w-4/5 bg-surface-card rounded"></div>
          <div className="h-4 w-5/6 bg-surface-card rounded"></div>
        </div>
      </div>

      {/* Answer Gated Section skeleton */}
      <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-surface-card rounded"></div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-surface-card rounded"></div>
          <div className="h-10 w-44 bg-surface-card rounded"></div>
        </div>
      </div>
    </div>
  );
}
