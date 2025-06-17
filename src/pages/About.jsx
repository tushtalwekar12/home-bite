import React from 'react';
import { FaUtensils, FaUsers, FaHeart, FaLeaf } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaUtensils className="text-4xl text-orange-500" />,
      title: 'Quality Food',
      description: 'We partner with the best local chefs and restaurants to bring you authentic, delicious meals.'
    },
    {
      icon: <FaUsers className="text-4xl text-orange-500" />,
      title: 'Community Focus',
      description: 'Supporting local food providers and creating opportunities for home chefs.'
    },
    {
      icon: <FaHeart className="text-4xl text-orange-500" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We ensure the best dining experience every time.'
    },
    {
      icon: <FaLeaf className="text-4xl text-orange-500" />,
      title: 'Sustainable',
      description: 'Committed to eco-friendly practices and reducing our environmental footprint.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting home chefs with food lovers, one delicious meal at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HomeBite was born from a simple idea: everyone deserves access to delicious, 
              home-cooked meals. We're bridging the gap between talented home chefs and 
              food enthusiasts, creating a community centered around great food.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <p className="text-lg text-gray-600 mb-6">
                  At HomeBite, we're on a mission to revolutionize the way people experience 
                  food delivery. We believe in the power of home-cooked meals and the joy they 
                  bring to people's lives.
                </p>
                <p className="text-lg text-gray-600">
                  By connecting talented home chefs with food lovers, we're creating a 
                  sustainable ecosystem that benefits everyone involved. Our platform 
                  empowers home chefs to share their passion for cooking while providing 
                  customers with authentic, delicious meals.
                </p>
              </div>
              <div className="bg-orange-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Quality and authenticity in every meal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Supporting local food communities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Sustainable and eco-friendly practices
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Customer satisfaction and trust
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 