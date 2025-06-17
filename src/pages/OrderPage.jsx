import React, { useState, useEffect } from 'react';
import { ref, get, push, update } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [isFromCart, setIsFromCart] = useState(false);
  const [orderStatus, setOrderStatus] = useState('pending');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setError('Please login to place an order');
        setLoading(false);
        return;
      }

      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const profile = snapshot.val();
          setUserProfile(profile);
          
          if (!profile.address || !profile.phone) {
            setError('Please complete your profile with address and phone number before placing an order');
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setOrderItems(cartItems);
      setIsFromCart(true);
    }
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    if (!userProfile?.address || !userProfile?.phone) {
      setError('Please complete your profile with address and phone number');
      return;
    }

    try {
      setLoading(true);

      const orderRef = push(ref(database, 'orders'));
      const orderData = {
        userId: currentUser.uid,
        userName: userProfile.name,
        userPhone: userProfile.phone,
        userAddress: userProfile.address,
        items: orderItems,
        totalAmount: orderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        providerId: orderItems[0]?.providerId
      };

      await update(orderRef, orderData);

      // Update provider statistics
      const providerRef = ref(database, `providers/${orderItems[0]?.providerId}/stats`);
      const providerSnapshot = await get(providerRef);
      
      if (providerSnapshot.exists()) {
        const provider = providerSnapshot.val();
        const stats = provider.stats || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };
        
        await update(providerRef, {
          totalOrders: (stats.totalOrders || 0) + 1,
          totalRevenue: (stats.totalRevenue || 0) + orderData.totalAmount,
          pendingOrders: (stats.pendingOrders || 0) + 1
        });
      }

      if (isFromCart) {
        clearCart();
      }

      setOrderSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('complete your profile') && (
            <button
              onClick={() => navigate('/profile')}
              className="text-orange-500 hover:text-orange-600"
            >
              Update Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Place Your Order</h1>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-900 font-medium">Pending</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-500">Processing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-500">Completed</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                </div>
                <span className="text-orange-500 font-bold">
                  ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>
                  ₹{orderItems
                    .reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-gray-900">{userProfile?.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-gray-900">{userProfile?.phone}</p>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderPage; 