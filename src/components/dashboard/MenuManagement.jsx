import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ref, set, push, get } from 'firebase/database';
import { database } from '../../firebase/config';

const MenuManagement = ({ currentUser, menuItems, setMenuItems }) => {
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: ''
  });

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const menuRef = ref(database, `menu/${currentUser.uid}`);
    const newItemRef = push(menuRef);
    await set(newItemRef, {
      ...newMenuItem,
      id: newItemRef.key,
      createdAt: new Date().toISOString()
    });
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      category: 'main',
      image: ''
    });
    // Refresh menu items
    const snapshot = await get(menuRef);
    if (snapshot.exists()) {
      setMenuItems(Object.values(snapshot.val()));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Menu</h2>
      
      {/* Add New Menu Item Form */}
      <form onSubmit={handleAddMenuItem} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={newMenuItem.price}
              onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newMenuItem.description}
              onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={newMenuItem.category}
              onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            >
              <option value="main">Main Course</option>
              <option value="side">Side Dish</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Menu Item
          </button>
        </div>
      </form>

      {/* Menu Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-50 rounded-lg p-4 shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <p className="text-amber-600 font-bold mt-2">₹{item.price}</p>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2">
              {item.category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement; 