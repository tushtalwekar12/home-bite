import React from "react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1️⃣",
      title: "Choose Your Plan",
      description: "Select from our variety of meal plans that suit your needs."
    },
    {
      number: "2️⃣",
      title: "Customize Meals",
      description: "Pick your favorite dishes and customize your meal preferences."
    },
    {
      number: "3️⃣",
      title: "Place Order",
      description: "Place your order and choose your preferred delivery time."
    },
    {
      number: "4️⃣",
      title: "Enjoy Meals",
      description: "Receive hot, fresh meals at your doorstep and enjoy!"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-12"
        >
          How It Works
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 