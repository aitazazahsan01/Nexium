'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import MainApp from './components/MainApp';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [view, setView] = useState('splash'); // 'splash' or 'app'

  // Automatically transition after a delay, or let the user click
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('app');
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleSplashFinish = () => {
    setView('app');
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'splash' ? (
        <motion.div key="splash">
          <SplashScreen onFinished={handleSplashFinish} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <MainApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
