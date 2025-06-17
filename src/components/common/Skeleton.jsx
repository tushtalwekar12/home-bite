import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton = ({ className = '', height = '1rem', width = '100%' }) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{ height, width }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <Skeleton height="200px" className="mb-4" />
      <Skeleton height="1.5rem" width="60%" className="mb-2" />
      <Skeleton height="1rem" width="40%" className="mb-4" />
      <Skeleton height="2.5rem" />
    </div>
  );
};

export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} height="1rem" width={`${Math.random() * 30 + 70}%`} />
      ))}
    </div>
  );
}; 