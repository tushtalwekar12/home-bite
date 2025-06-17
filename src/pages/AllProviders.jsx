import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUtensils, FaSearch, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Static data for providers
const staticProviders = [
  {
    id: '1',
    name: 'Shree Mauli Foods',
    cuisine: 'Maharashtrian',
    location: 'Vasudev Nagar, Nagpur',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '2',
    name: 'Maa Durga Mess and Restaurant',
    cuisine: 'Maharashtrian',
    location: 'Vasudev Nagar, Nagpur',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '3',
    name: 'Sachin Mess',
    cuisine: 'Indian',
    location: 'Jaitala Nagar, Nagpur',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '4',
    name: 'Rohit Mess and Tiffin Service',
    cuisine: 'Indian Cousine',
    location: 'Trimurti Nagar, Nagpur',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '5',
    name: 'Royal Kitchen',
    cuisine: 'Indian',
    location: 'Lokmanya Nagar',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '6',
    name: 'Spice Paradise',
    cuisine: 'Chinese',
    location: 'Subhash Nagar',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '7',
    name: 'Home Food',
    cuisine: 'North Indian',
    location: 'Vasudev Nagar',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  },
  {
    id: '8',
    name: 'Delicious Delights',
    cuisine: 'South Indian',
    location: 'Lokmanya Nagar',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    role: 'meal_provider'
  }
];

const AllProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Memoize unique cuisines
  const cuisines = useMemo(() => {
    return ['all', ...new Set(staticProviders.map(p => p.cuisine))];
  }, []);

  const filteredProviders = useMemo(() => {
    return staticProviders.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCuisine = selectedCuisine === 'all' || provider.cuisine === selectedCuisine;
      const matchesRating = provider.rating >= minRating;
      return matchesSearch && matchesCuisine && matchesRating;
    });
  }, [searchTerm, selectedCuisine, minRating]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">All Food Providers</h1>
          
          {/* Search and Filter Controls */}
          <div className="w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/provider/${provider.id}/menu`}
                className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={provider.imageUrl}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaUtensils className="mr-2" />
                    <span>{provider.cuisine}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-gray-600">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No providers found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProviders; 