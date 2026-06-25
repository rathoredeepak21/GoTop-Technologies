import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apps', path: '/apps' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-space-darkest/70 border-b border-space-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/icon.png" 
              alt={settings.companyName} 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-neon-blue uppercase">
                {settings.companyName.split(' ')[0]}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neon-blue font-semibold uppercase leading-none">
                {settings.companyName.split(' ').slice(1).join(' ') || 'TECHNOLOGIES'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-neon-blue' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue shadow-[0_0_8px_#00d2ff]" />
                )}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-sm font-medium text-neon-blue hover:text-white border border-neon-blue/40 hover:border-neon-blue hover:shadow-neon-glow px-4 py-2 rounded-lg transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Console</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-gray-500 hover:text-neon-blue transition-colors duration-200"
                title="Admin Control"
              >
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}
            
            <Link
              to="/downloads"
              className="flex items-center space-x-2 text-sm font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 hover:brightness-110 shadow-[0_0_15px_rgba(0,210,255,0.4)] px-5 py-2.5 rounded-lg transition-all duration-300"
            >
              <Download className="h-4 w-4" />
              <span>Download Center</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/admin/dashboard" className="p-2 text-neon-blue">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-space-dark/80 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-space-border/60">
          <div className="px-2 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'text-neon-blue bg-neon-blue/10 border-l-4 border-neon-blue'
                    : 'text-gray-300 hover:text-white hover:bg-space-dark/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-space-border/40 my-3 pt-3 px-4 flex flex-col gap-3">
              <Link
                to="/downloads"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 py-3 rounded-lg shadow-neon-glow"
              >
                <Download className="h-4 w-4" />
                <span>Download Center</span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 text-xs text-gray-500 hover:text-neon-blue py-1"
                >
                  <ShieldAlert className="h-3 w-3" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
