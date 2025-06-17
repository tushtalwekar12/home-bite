import React, { useState } from 'react';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPlus, FaSpinner, FaImage } from 'react-icons/fa';

const AddMenuItem = ({ onItemAdded }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return 'Please enter a valid price';
    }
    if (!formData.category) {
      return 'Please select a category';
    }
    if (!formData.imageUrl) {
      return 'Image URL is required';
    }
    return null;
  };

  const validateImageUrl = (url) => {
    if (!url) return 'Please enter an image URL';
    try {
      new URL(url);
      return null;
    } catch (err) {
      return 'Please enter a valid image URL';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when imageUrl changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      const formError = validateForm();
      if (formError) {
        setError(formError);
        setLoading(false);
        return;
      }

      // Validate image URL
      const urlError = validateImageUrl(formData.imageUrl);
      if (urlError) {
        setError(urlError);
        setLoading(false);
        return;
      }

      // Create menu item in database
      const menuRef = ref(database, 'menu-items');
      const newItemRef = push(menuRef);
      
      const menuItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        providerId: currentUser.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await set(newItemRef, menuItem);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
      });
      setImagePreview(null);
      
      if (onItemAdded) {
        onItemAdded();
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError(err.message || 'Failed to add menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Menu Item</h2>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            maxLength={100}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            maxLength={500}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select a category</option>
            <option value="main-course">Main Course</option>
            <option value="appetizers">Appetizers</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-lg"
                onError={() => {
                  setError('Invalid image URL');
                  setImagePreview(null);
                }}
              />
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter a valid image URL (JPEG, PNG, or WebP)
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Adding...
              </>
            ) : (
              <>
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Item
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddMenuItem; 