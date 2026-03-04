import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';

/**
 * LoadingScreen component
 * Provides a premium, 2-second entrance animation for the portfolio.
 */
export const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0], 
              scale: [1, 2, 1],
              x: [0, (i % 2 === 0 ? 100 : -100), 0],
              y: [0, (i < 3 ? 100 : -100), 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeInOut" 
            }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"
          />
        ))}
      </div>

      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/20 mb-8 relative z-10">
            <Palette className="w-12 h-12 text-primary" />
          </div>
          
          {/* Pulsing ring */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-x-0 -top-2 -bottom-2 bg-white/20 rounded-[3rem] blur-xl"
          />
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-4xl font-black tracking-tighter italic"
          >
            AD77 <span className="text-white/40 not-italic uppercase text-2xl ml-2 tracking-[0.2em] font-light">Designs</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
          className="h-[2px] bg-white/20 mt-6 mx-auto rounded-full max-w-[120px]"
        >
          <motion.div 
             className="h-full bg-white"
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
