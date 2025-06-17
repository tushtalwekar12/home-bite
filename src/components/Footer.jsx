import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">HomeBite</h3>
            <p className="text-orange-100 text-base">
              Connecting food lovers with local home chefs for authentic, homemade meals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white hover:text-orange-200 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-orange-200 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/providers" className="text-white hover:text-orange-200 transition">
                  Our Providers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-orange-200 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-white hover:text-orange-200 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-orange-200 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white hover:text-orange-200 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-3 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-orange-400 text-white hover:text-white rounded-full p-2 transition">
                <FaFacebook size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-orange-400 text-white hover:text-white rounded-full p-2 transition">
                <FaTwitter size={22} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-orange-400 text-white hover:text-white rounded-full p-2 transition">
                <FaInstagram size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-orange-400 text-white hover:text-white rounded-full p-2 transition">
                <FaLinkedin size={22} />
              </a>
            </div>
            <p className="text-orange-100 text-base">
              Email: <a href="mailto:contact@homebite.com" className="underline hover:text-orange-200 transition">contact@homebite.com</a>
            </p>
            <p className="text-orange-100 text-base">
              Phone: (555) 123-4567
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-400/30 mt-10 pt-6 text-center">
          <p className="text-orange-100 text-sm">
            © {new Date().getFullYear()} HomeBite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 