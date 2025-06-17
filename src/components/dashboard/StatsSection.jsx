import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
        <p className="text-3xl font-bold text-amber-600">{stats.totalOrders}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900">Pending Orders</h3>
        <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900">Completed Orders</h3>
        <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
      </motion.div>
    </div>
  );
};

export default StatsSection; 