import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';

/**
 * Navbar component
 * Provides primary navigation for the portfolio.
 * Features a responsive design with a mobile drawer and glassmorphism styling.
 */

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <div className="p-2.5 bg-primary text-white rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
              <Palette className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-primary">
              Adwaid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-medium rounded-md",
                    location.pathname === link.path
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button as="span" className="w-full rounded-2xl h-14 font-black mt-6 bg-primary text-primary-foreground text-lg hover:opacity-90 transition-opacity">Hire Me</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
