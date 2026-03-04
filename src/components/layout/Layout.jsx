import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';

/**
 * Main Layout wrapper
 * Ensures consistent Navbar, Footer, and spacing across public pages.
 */

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary">
      {/* Global Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#fff',
            color: '#000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
