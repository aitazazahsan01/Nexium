'use client';

import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinished: () => void;
}

export default function SplashScreen({ onFinished }: SplashScreenProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen animated-gradient text-white text-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-4"
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Final Project
        </motion.h1>
        <motion.p variants={itemVariants} className="text-2xl md:text-4xl font-light">
          Nexium Remote Internship
        </motion.p>
        <motion.div variants={itemVariants} className="w-32 h-1 bg-white rounded-full my-4" />
        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold">
          Muhammad Aaitazaz Ahsan
        </motion.h2>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl font-medium">
          Student of NUST
        </motion.p>
        <motion.button
          variants={itemVariants}
          onClick={onFinished}
          className="mt-12 px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
        >
          Start Generating Recipes
        </motion.button>
      </motion.div>
    </div>
  );
}
