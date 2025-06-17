import React from 'react';

const FAQ = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">How does HomeBite work?</h2>
        <p className="text-gray-700">HomeBite connects you with local home chefs and meal providers. Browse menus, place your order, and enjoy fresh, homemade meals delivered to your door.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">How do I place an order?</h2>
        <p className="text-gray-700">Simply sign up or log in, browse available providers and menus, add items to your cart, and proceed to checkout. You'll receive order updates via email or SMS.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">What payment methods are accepted?</h2>
        <p className="text-gray-700">We accept major credit/debit cards, UPI, and other secure online payment methods.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">How is my food delivered?</h2>
        <p className="text-gray-700">Our trusted delivery partners ensure your meals arrive hot and fresh at your doorstep. You can track your order status in your account.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">Can I cancel or modify my order?</h2>
        <p className="text-gray-700">You can cancel or modify your order before it is prepared. Please contact support or the provider directly for urgent changes.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">How do I contact support?</h2>
        <p className="text-gray-700">You can reach us at <a href="mailto:contact@homebite.com" className="underline text-orange-500">contact@homebite.com</a> for any questions or support needs.</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-orange-500 mb-2">Are there vegetarian and special diet options?</h2>
        <p className="text-gray-700">Yes! Many of our providers offer vegetarian, vegan, and other special diet meals. Filter menus or check provider details for options.</p>
      </div>
    </div>
  </div>
);

export default FAQ; 