import React from 'react';
import { FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

const DeliveryAreas = () => {
  const deliveryAreas = [
    {
      area: 'Hingna',
      description: 'Covers Hingna Road, Rajendra Nagar, and nearby industrial areas',
      zipCodes: ['440016', '440036']
    },
    {
      area: 'Jaitala',
      description: 'Serving Jaitala Road, Vaishali Nagar, and Ekatama Nagar region',
      zipCodes: ['440036']
    },
    {
      area: 'Trimurti Nagar',
      description: 'Covers Trimurti Nagar, Pratap Nagar, and surrounding residential zones',
      zipCodes: ['440022']
    },
    {
      area: 'Dharampeth',
      description: 'Central Nagpur including Dharampeth, Laxmi Nagar and nearby areas',
      zipCodes: ['440010']
    },
    {
      area: 'Sitabuldi',
      description: 'Heart of Nagpur covering Sitabuldi Market and Railway Station area',
      zipCodes: ['440012']
    },
    {
      area: 'Manish Nagar',
      description: 'Premium residential and commercial zone with growing food delivery demand',
      zipCodes: ['440015']
    }
  ];
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Delivery Areas</h1>
          <p className="text-xl text-gray-600 mb-12">
            We deliver to various areas across the city. Check if we serve your location!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deliveryAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-orange-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{area.area}</h2>
              </div>
              <p className="text-gray-600 mb-4">{area.description}</p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Serving ZIP Codes:</h3>
                <div className="flex flex-wrap gap-2">
                  {area.zipCodes.map((zip, zipIndex) => (
                    <span
                      key={zipIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      <FaCheck className="mr-1 text-orange-500" />
                      {zip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-orange-50 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not in our delivery area?</h2>
          <p className="text-gray-600 mb-4">
            We're constantly expanding our delivery network. Enter your ZIP code to check if we're coming to your area soon!
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your ZIP code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAreas; 