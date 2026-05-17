import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6
        ${hoverable ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
        transition-all duration-200 ease-out
        ${className}`}
    >
      {children}
    </div>
  );
};
