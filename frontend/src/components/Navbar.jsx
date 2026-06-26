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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#E5E7EB] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/icon.png" 
              alt={settings.companyName} 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#0F172A]">
                {settings.companyName.split(' ')[0]}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#F97316] font-bold uppercase leading-none mt-0.5">
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
                className={`relative py-2 text-sm font-semibold tracking-wide transition-colors duration-300 group ${
                  isActive(link.path) 
                    ? 'text-[#F97316]' 
                    : 'text-gray-500 hover:text-[#0F172A]'
                }`}
              >
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#F97316] transition-all duration-300 ${
                  isActive(link.path) 
                    ? 'w-full shadow-[0_1px_6px_rgba(249,115,22,0.4)]' 
                    : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-sm font-semibold text-[#F97316] hover:text-white border border-[#F97316]/40 hover:bg-[#F97316] hover:scale-[1.02] active:scale-[0.98] px-4 py-2 rounded-lg transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Console</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-gray-400 hover:text-[#F97316] hover:scale-110 transition-all duration-200"
                title="Admin Control"
              >
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}
            
            <Link
              to="/downloads"
              className="flex items-center space-x-2 text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] hover:scale-[1.02] active:scale-[0.98] px-5 py-2.5 rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(249,115,22,0.2)]"
            >
              <Download className="h-4 w-4" />
              <span>Download Center</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/admin/dashboard" className="p-2 text-[#F97316]">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-[#0F172A] hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-semibold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'text-[#F97316] bg-[#F97316]/5 border-l-4 border-[#F97316]'
                    : 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 my-3 pt-3 px-4 flex flex-col gap-3">
              <Link
                to="/downloads"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full text-center text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] py-3 rounded-lg shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
              >
                <Download className="h-4 w-4" />
                <span>Download Center</span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 text-xs text-gray-400 hover:text-[#F97316] py-1"
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
