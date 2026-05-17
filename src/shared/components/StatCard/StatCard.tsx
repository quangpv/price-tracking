import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  sublabel?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, sublabel, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">{label}</p>
          {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{value}</p>
        {change !== undefined && (
          <div className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
            change >= 0 ? 'text-success' : 'text-danger'
          }`}>
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
              change >= 0 ? 'bg-success-50' : 'bg-danger-50'
            }`}>
              {change >= 0 ? '↑' : '↓'}
            </span>
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
        {sublabel && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sublabel}</p>}
      </div>
    </div>
  );
};
