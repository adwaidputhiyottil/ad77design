import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

/**
 * Footer component
 * Displays site links, social icons, and copyright information.
 */

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="font-bold text-xl italic">Adwaid</h3>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Specializing in high-impact sports graphic design, branding, and digital illustration. 
              Bringing stories to life through visual excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary">Connect</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ad77design?igsh=MWh6Zjk2MjlwdDU3bg==" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/ad77design?s=20" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:adwaidpc0704@gmail.com" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Adwaid Designs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
