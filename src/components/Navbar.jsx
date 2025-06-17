import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, userRole } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const totalItems = cartItems?.length || 0;

  // Close mobile menu on route change
  React.useEffect(() => {
    if (isOpen) {
      const closeMenu = () => setIsOpen(false);
      window.addEventListener('resize', closeMenu);
      return () => window.removeEventListener('resize', closeMenu);
    }
  }, [isOpen]);

  return (
    <nav className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Main Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-500'} text-xl sm:text-2xl`}>HomeBite</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:ml-10 space-x-8">
              <Link to="/delivery-areas" className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'}`}>
                Delivery Areas
              </Link>
              <Link to="/about" className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'}`}>
                Who We Are
              </Link>
              <Link to="/contact" className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'}`}>
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {currentUser ? (
              <>
                {/* Cart - Only for regular users */}
                {userRole === 'user' && (
                  <Link 
                    to="/cart" 
                    className={`relative flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'} rounded-lg transition-colors`}
                  >
                    <FaShoppingCart className="text-xl" />
                    <span className="hidden md:inline">My Basket</span>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Provider Dashboard - Only for meal providers */}
                {userRole === 'meal_provider' && (
                  <Link
                    to="/provider-dashboard"
                    className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'} flex items-center gap-2 px-3 py-2 rounded-lg transition-colors`}
                  >
                    <FaChartLine />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                )}

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'} flex items-center gap-2 px-3 py-2 rounded-lg transition-colors`}>
                    <FaUser />
                    <span className="hidden md:inline">Profile</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </MenuButton>
                  <MenuItems className={`absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg ring-1 ring-black/5 focus:outline-none`}>
                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block px-4 py-2 text-sm ${active ? (isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-50 text-orange-500') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}
                          >
                            My Profile
                          </Link>
                        )}
                      </MenuItem>
                      {userRole === 'user' && (
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="/orders"
                              className={`block px-4 py-2 text-sm ${active ? (isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-50 text-orange-500') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}
                            >
                              My Orders
                            </Link>
                          )}
                        </MenuItem>
                      )}
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm ${active ? (isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-50 text-orange-500') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}
                          >
                            Logout
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center ml-1">
              <button
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(!isOpen)}
                className={`${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} focus:outline-none focus:ring-2 focus:ring-orange-400 rounded p-1`}
              >
                {isOpen ? (
                  <XMarkIcon className="h-7 w-7" />
                ) : (
                  <Bars3Icon className="h-7 w-7" />
                )}
              </button>
            </div>
            {/* Sign In/Sign Up for mobile: adjust spacing and sizing */}
            {!currentUser && (
              <>
                <Link to="/login" className={`hidden xs:inline-block ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} px-2 text-base`}>Sign In</Link>
                <Link to="/signup" className="hidden xs:inline-block bg-orange-500 text-white px-3 py-1.5 rounded-md text-base font-semibold hover:bg-orange-600 transition-all duration-200">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu & Backdrop */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 pointer-events-none ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
        />
        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`absolute top-0 left-0 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'} pointer-events-auto`}
        >
          <div className="px-6 pt-6 pb-8 space-y-2 flex flex-col text-lg">
            <Link to="/delivery-areas" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>Delivery Areas</Link>
            <Link to="/about" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>Who We Are</Link>
            <Link to="/contact" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>Contact Us</Link>
            {currentUser && userRole === 'user' && (
              <Link to="/cart" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>My Basket ({totalItems})</Link>
            )}
            {currentUser && userRole === 'meal_provider' && (
              <Link to="/provider-dashboard" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>Dashboard</Link>
            )}
            {!currentUser && (
              <>
                <Link to="/login" className={`py-3 px-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`} onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link to="/signup" className="py-3 px-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;