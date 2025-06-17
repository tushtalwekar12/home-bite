import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/hero-tiffin.png"; // adjust path if needed

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-green-50 to-white pt-0 pb-10 md:pt-0 md:pb-20 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight tracking-tight"
          >
            Nagpur&apos;s First <br />
            <span className="text-green-500">Customized Online</span> <br />
            <span className="text-green-700">Tiffin Service</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-lg text-gray-800 leading-relaxed"
          >
            Order a healthy and well-balanced meal designed by our expert dietician anywhere in Mumbai.
            It's all homemade...{" "}
            <span className="italic text-gray-700">
              "Ghar ka khana just the way you want."
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow text-center block"
              >
                🍱 Browse Menu
              </Link>
            </motion.div> */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/providers"
                className="bg-white border border-yellow-500 hover:bg-yellow-100 text-yellow-600 font-bold py-3 px-6 rounded-lg shadow text-center block"
              >
                👨‍🍳 Our Providers
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center md:justify-end mt-6 md:mt-6"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={heroImage}
            alt="Tiffin Service Hero"
            className="w-full max-w-xl rounded-lg shadow-md object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 