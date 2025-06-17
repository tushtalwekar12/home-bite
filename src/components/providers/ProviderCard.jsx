import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

const ProviderCard = ({ provider }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl border border-transparent hover:border-orange-400 transition-all duration-300 overflow-hidden h-full flex flex-col group"
    >
      {/* Provider Image or Icon */}
      <div className="relative h-48 overflow-hidden">
        {provider.image ? (
          <motion.img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            whileHover={{ scale: 1.08 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
            <FaUtensils className="text-white text-6xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{provider.name}</h3>
          <p className="text-orange-200 text-sm font-medium">{provider.cuisine}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-orange-400/30 via-orange-200/10 to-transparent" />

      {/* Provider Info */}
      <div className="p-6 flex-grow">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-100 text-sm font-medium">{provider.address}</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaPhone className="text-orange-500 flex-shrink-0" />
            <p className="text-gray-800 dark:text-gray-100 text-sm font-medium">{provider.phone}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 pt-0">
        <Link
          to={`/provider/${provider.id}/menu`}
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-semibold shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          View Menu
        </Link>
      </div>
    </motion.div>
  );
};

export default ProviderCard; 