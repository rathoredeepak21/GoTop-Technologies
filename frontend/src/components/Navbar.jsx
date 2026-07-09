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
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <img 
              src="/icon.png" 
              alt={settings.companyName} 
              className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#0F172A]">
                {settings.companyName.split(' ')[0]}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#F97316] font-bold uppercase leading-none mt-0.5">
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
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-[#0F172A] hover:bg-gray-100/70 focus:outline-none transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu Drawer & Backdrop Overlay */}
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-white z-50 shadow-2xl flex flex-col justify-between py-6 px-4 md:hidden transition-transform duration-300 ease-in-out will-change-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header row in drawer */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2.5">
              <img src="/icon.png" alt={settings.companyName} className="h-8 w-auto object-contain" />
              <span className="font-display font-extrabold text-lg text-[#0F172A]">GoTop</span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-lg text-gray-500 hover:text-[#0F172A] hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation links inside drawer */}
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-[#F97316] bg-[#F97316]/5 font-bold border-l-4 border-[#F97316]'
                    : 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer buttons inside drawer */}
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <Link
            to="/downloads"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 w-full text-center text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] py-3.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download Center</span>
          </Link>

          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-[#0F172A] hover:text-[#F97316] border border-[#0F172A]/10 hover:border-[#F97316]/40 py-3 rounded-xl transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Console Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-1.5 text-xs text-gray-400 hover:text-[#F97316] py-2"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
