import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/config';
import ProviderCard from '../providers/ProviderCard';
import { motion } from 'framer-motion';

const ProvidersSection = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersRef = ref(database, 'users');
        const snapshot = await get(providersRef);
        
        if (snapshot.exists()) {
          // Filter only meal providers and transform the data
          const providersData = Object.entries(snapshot.val())
            .filter(([_, user]) => user.role === 'meal_provider')
            .map(([id, user]) => ({
              id,
              name: user.name,
              cuisine: user.cuisine || 'Indian Cuisine',
              address: user.address || 'Nagpur, Maharashtra',
              phone: user.phone || '+91 8806087616',
              image: user.image || null
            }));
          setProviders(providersData);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-8xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-[400px] shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-8xl mx-auto text-center">
          <p className="text-red-600 bg-red-50 p-4 rounded-lg inline-block">
            Error loading providers: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Trusted Meal Providers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover delicious homemade meals from our verified providers. Each provider brings their unique culinary expertise to your table.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProviderCard provider={provider} />
            </motion.div>
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 text-lg">No providers available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later for updates.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvidersSection; 