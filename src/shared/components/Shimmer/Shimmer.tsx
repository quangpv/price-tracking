import React from 'react';
import './Shimmer.css';

export const Shimmer: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = '100%',
  height = '20px',
  className = '',
}) => {
  return (
    <div
      className={`shimmer ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
    />
  );
};
