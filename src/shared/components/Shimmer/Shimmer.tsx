import React from 'react';

interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl h-full w-full" />
    </div>
  );
};

// Skeleton for Stat Card
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 p-6">
      <div className="flex flex-col gap-3">
        <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-32 animate-pulse" />
        <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-24 animate-pulse" />
      </div>
    </div>
  );
};

// Skeleton for Chart
export const ChartSkeleton: React.FC = () => {
  const heights = [40, 55, 45, 65, 50, 70, 60, 45, 55, 65, 50, 60];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 p-6">
      <div className="mb-6">
        <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded-lg w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-64 animate-pulse" />
      </div>
      <div className="h-96 flex items-end gap-2 px-4 pb-8">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-t-lg animate-pulse"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// Skeleton for Table
export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 p-6">
      <div className="mb-6">
        <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded-lg w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-64 animate-pulse" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-3">
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-32 animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-24 animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-lg w-24 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
