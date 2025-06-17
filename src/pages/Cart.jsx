import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ref, push, update } from 'firebase/database';
import { database } from '../firebase/config';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(1, (item.quantity || 1) + change);
    updateQuantity(item.id, newQuantity);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Please login to proceed.');
      return;
    }
    if (!cartItems || cartItems.length === 0) return;
    setLoading(true);
    try {
      for (const item of cartItems) {
        const orderRef = push(ref(database, 'orders'));
        const orderData = {
          userId: currentUser.uid,
          providerId: item.providerId,
          itemId: item.id,
          itemName: item.name,
          price: item.price,
          status: 'pending',
          timestamp: Date.now(),
          quantity: item.quantity || 1
        };
        await update(orderRef, orderData);
      }
      await clearCart();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/orders');
      }, 1500);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/order');
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items to your cart!</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Order placed successfully! Redirecting to Orders...
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FaMinus className="text-gray-600" />
                          </button>
                          <span className="text-gray-900 font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FaPlus className="text-gray-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-orange-500 font-bold">
                            ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹40.00</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{(getTotalPrice() + 40).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;