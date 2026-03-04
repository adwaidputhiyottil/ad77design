import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingScreen component (v7 - Horizontal Blade)
 * A cinematic and razor-sharp minimalist entrance.
 * Features two thin horizontal lines that reveal the logo.
 */
export const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      onClick={onComplete}
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden cursor-pointer"
    >
      <div className="relative flex flex-col items-center">
        {/* Upper Blade */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-48 h-[1px] bg-primary/10 absolute top-[-20px]"
        />

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-primary font-black text-4xl md:text-6xl tracking-tighter italic">
            AD77
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-[9px] uppercase tracking-[0.6em] mt-2 ml-2 font-bold"
          >
            Graphic Designs
          </motion.p>
        </motion.div>

        {/* Lower Blade */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-48 h-[1px] bg-primary/10 absolute bottom-[-20px]"
        />

        {/* Subtle motion blur glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-x-[-100px] top-1/2 h-[40px] bg-primary/10 blur-3xl pointer-events-none -translate-y-1/2"
        />
      </div>
    </motion.div>
  );
};
