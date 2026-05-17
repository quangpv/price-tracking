import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'danger';
}

 export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      variant === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      {children}
    </span>
  );
};
