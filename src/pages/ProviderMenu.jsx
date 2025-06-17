import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, query, orderByChild, equalTo, update, push } from 'firebase/database';
import { database } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaShoppingCart, FaBolt, FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProviderMenu = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [provider, setProvider] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [loadingItem, setLoadingItem] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});

  useEffect(() => {
    const fetchProviderAndMenu = async () => {
      try {
        // Fetch provider details
        const providerRef = ref(database, `users/${providerId}`);
        const providerSnapshot = await get(providerRef);
        
        if (!providerSnapshot.exists()) {
          throw new Error('Provider not found');
        }

        const providerData = providerSnapshot.val();
        setProvider(providerData);

        // Fetch menu items directly from the menu-items node
        const menuRef = ref(database, 'menu-items');
        const menuSnapshot = await get(menuRef);
        
        if (menuSnapshot.exists()) {
          const menuData = menuSnapshot.val();
          // Filter items by providerId and transform the data
          const items = Object.entries(menuData)
            .filter(([_, item]) => item.providerId === providerId)
            .map(([id, item]) => ({
              id,
              ...item
            }));
          setMenuItems(items);
        } else {
          setMenuItems([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProviderAndMenu();
  }, [providerId]);

  const categories = ['all', 'main-course', 'appetizers', 'desserts', 'beverages'];
  const categoryLabels = {
    'all': 'All Items',
    'main-course': 'Main Course',
    'appetizers': 'Appetizers',
    'desserts': 'Desserts',
    'beverages': 'Beverages'
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const quantity = itemQuantities[item.id] || 1;
    addToCart({ ...item, quantity });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const handleBuyNow = async (item) => {
      if (!currentUser) {
      navigate('/login');
        return;
      }

    try {
      setLoadingItem(item.id);
      const quantity = itemQuantities[item.id] || 1;

      // Create order in database
      const orderRef = push(ref(database, 'orders'));
      const orderData = {
        userId: currentUser.uid,
        providerId: providerId,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        status: 'pending',
        timestamp: Date.now(),
        quantity: quantity
      };

      await update(orderRef, orderData);

      // Update provider stats
      const statsRef = ref(database, `stats/${providerId}`);
      const statsSnapshot = await get(statsRef);
      const currentStats = statsSnapshot.val() || {
        totalOrders: 0,
        totalRevenue: 0,
        monthlyOrders: 0,
        monthlyRevenue: 0
      };

      const newStats = {
        ...currentStats,
        totalOrders: (currentStats.totalOrders || 0) + 1,
        totalRevenue: (currentStats.totalRevenue || 0) + (item.price * quantity),
        monthlyOrders: (currentStats.monthlyOrders || 0) + 1,
        monthlyRevenue: (currentStats.monthlyRevenue || 0) + (item.price * quantity)
      };

      await update(statsRef, newStats);

      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoadingItem(null);
    }
  };

  const updateQuantity = (itemId, change) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        {/* Provider Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider?.name}</h1>
          <p className="text-gray-600">{provider?.cuisine}</p>
        </div>

        {/* Success Messages */}
        {orderSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            Order placed successfully!
          </div>
        )}
        {cartSuccess && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            Added to cart!
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-orange-500 font-bold">₹{item.price.toFixed(2)}</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {categoryLabels[item.category]}
                  </span>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaMinus className="text-gray-600" />
                  </button>
                  <span className="text-lg font-semibold">
                    {itemQuantities[item.id] || 1}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaPlus className="text-gray-600" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    disabled={loadingItem === item.id}
                  >
                    <FaShoppingCart className="text-lg" />
                    <span>Add to Basket</span>
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    disabled={loadingItem === item.id}
                  >
                    <FaBolt className="text-lg" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderMenu; 