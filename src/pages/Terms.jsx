import React from 'react';

const Terms = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Terms of Service</h1>
      <p className="text-gray-700 mb-4">Welcome to HomeBite! By using our food delivery platform, you agree to the following terms and conditions. Please read them carefully.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">1. Acceptance of Terms</h2>
      <p className="text-gray-700 mb-4">By accessing or using HomeBite, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">2. User Accounts</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>You must provide accurate and complete information when creating an account.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You must notify us immediately of any unauthorized use of your account.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">3. Orders & Payments</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>All orders are subject to acceptance and availability.</li>
        <li>Prices and menu items may change at any time.</li>
        <li>Payments must be made through our approved payment methods.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">4. Provider Responsibilities</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Meal providers must comply with all applicable food safety and hygiene regulations.</li>
        <li>Providers are responsible for the quality and timely delivery of meals.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">5. User Conduct</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>You agree not to misuse the platform or engage in fraudulent activities.</li>
        <li>Respectful communication with providers, users, and staff is required.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">6. Limitation of Liability</h2>
      <p className="text-gray-700 mb-4">HomeBite is not liable for any damages arising from the use of our platform, including but not limited to food quality, delivery delays, or third-party actions.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">7. Changes to Terms</h2>
      <p className="text-gray-700 mb-4">We may update these Terms of Service at any time. Continued use of the platform constitutes acceptance of the new terms.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">8. Contact Us</h2>
      <p className="text-gray-700">If you have any questions about these Terms, please contact us at <a href="mailto:contact@homebite.com" className="underline text-orange-500">contact@homebite.com</a>.</p>
    </div>
  </div>
);

export default Terms; 