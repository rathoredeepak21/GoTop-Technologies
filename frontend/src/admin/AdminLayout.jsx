import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  LayoutDashboard, 
  AppWindow, 
  Layers, 
  BellRing, 
  Settings as SettingsIcon, 
  LogOut, 
  ShieldCheck,
  Home,
  RefreshCw,
  Info,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5 shrink-0" /> },
    { name: 'Manage Apps', path: '/admin/apps', icon: <AppWindow className="h-5 w-5 shrink-0" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers className="h-5 w-5 shrink-0" /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <BellRing className="h-5 w-5 shrink-0" /> },
    { name: 'About Page Settings', path: '/admin/about', icon: <Info className="h-5 w-5 shrink-0" /> },
    { name: 'Branding Settings', path: '/admin/settings', icon: <SettingsIcon className="h-5 w-5 shrink-0" /> }
  ];

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on navigate
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-[#F97316] animate-spin" />
          <span className="text-gray-600 text-sm">Authenticating panel security session...</span>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Mobile Top Header (Visible only on mobile) */}
      <header className="md:hidden h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 text-white">
        <div className="flex items-center space-x-3">
          <img
            src="/icon.png"
            alt="Brand Logo"
            className="h-8 w-auto filter drop-shadow-[0_4px_6px_rgba(249,115,22,0.15)]"
          />
          <div>
            <h2 className="text-white font-bold text-xs tracking-wider uppercase">
              {settings.companyName.split(' ')[0]} CONSOLE
            </h2>
            <div className="flex items-center space-x-1 text-[8px] text-green-400 uppercase tracking-widest font-mono">
              <ShieldCheck className="h-2.5 w-2.5 inline" />
              <span>Admin</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none transition-all"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer (Backdrop & Side Panel) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            
            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-6 z-50 text-white md:hidden"
            >
              <div className="space-y-8">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/icon.png"
                      alt="Brand Logo"
                      className="h-8 w-auto filter drop-shadow-[0_4px_6px_rgba(249,115,22,0.15)]"
                    />
                    <div>
                      <h2 className="text-white font-bold text-sm tracking-wider uppercase">
                        {settings.companyName.split(' ')[0]} CONSOLE
                      </h2>
                      <div className="flex items-center space-x-1 text-[9px] text-green-400 uppercase tracking-widest font-mono">
                        <ShieldCheck className="h-3 w-3 inline" />
                        <span>Super Admin</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.path)
                          ? 'bg-[#F97316]/10 text-[#F97316] border-l-4 border-[#F97316] font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* User profile & logout footer */}
              <div className="pt-5 border-t border-slate-800 space-y-4">
                <div className="flex items-center space-x-3 px-2">
                  <div className="h-9 w-9 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center font-display font-bold text-[#F97316] text-sm uppercase shrink-0">
                    {admin?.username?.substring(0, 2) || 'AD'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-white text-xs font-semibold truncate uppercase">{admin?.username || 'Admin'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{admin?.email}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 hover:bg-slate-800/40 rounded-lg transition-all"
                  >
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Return to Site</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-xs font-semibold text-red-400 hover:text-red-300 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all w-full text-left"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Exit Console</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop / Tablet Sidebar (Left fixed sidebar) */}
      <aside className="hidden md:flex md:w-20 lg:w-64 bg-[#0F172A] border-r border-slate-800 flex-col justify-between p-4 lg:p-6 shrink-0 z-20 text-white h-full overflow-y-auto">
        <div className="space-y-8">
          
          {/* Logo & title header */}
          <div className="flex items-center lg:space-x-3 border-b border-slate-800 pb-5 justify-center lg:justify-start">
            <img
              src="/icon.png"
              alt="Brand Logo"
              className="h-9 w-auto filter drop-shadow-[0_4px_6px_rgba(249,115,22,0.15)] shrink-0"
            />
            <div className="hidden lg:block overflow-hidden">
              <h2 className="text-white font-bold font-display text-sm tracking-wider uppercase truncate">
                {settings.companyName.split(' ')[0]} CONSOLE
              </h2>
              <div className="flex items-center space-x-1 text-[9px] text-green-400 uppercase tracking-widest font-mono">
                <ShieldCheck className="h-3 w-3 inline shrink-0" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative group flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-3 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-[#F97316]/10 text-[#F97316] border-l-4 border-[#F97316] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.name}</span>
                
                {/* Responsive Tooltip for Tablet view */}
                <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-xs font-semibold rounded-lg border border-slate-700 text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-30 hidden md:block lg:hidden shadow-xl">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile & logout footer */}
        <div className="pt-5 border-t border-slate-800 space-y-4">
          <div className="flex items-center lg:space-x-3 justify-center lg:justify-start px-1 lg:px-2">
            <div className="h-9 w-9 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center font-display font-bold text-[#F97316] text-sm uppercase shrink-0">
              {admin?.username?.substring(0, 2) || 'AD'}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <div className="text-white text-xs font-semibold truncate uppercase">{admin?.username || 'Admin'}</div>
              <div className="text-[10px] text-slate-400 truncate">{admin?.email}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="relative group flex items-center justify-center lg:justify-start lg:space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 lg:px-4 lg:py-2 hover:bg-slate-800/40 rounded-lg transition-all"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">Return to Site</span>
              
              {/* Tooltip for Tablet */}
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-xs font-semibold rounded-lg border border-slate-700 text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-30 hidden md:block lg:hidden shadow-xl">
                Return to Site
              </span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="relative group flex items-center justify-center lg:justify-start lg:space-x-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 lg:px-4 lg:py-2 hover:bg-red-500/10 rounded-lg transition-all w-full text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">Exit Console</span>
              
              {/* Tooltip for Tablet */}
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-xs font-semibold rounded-lg border border-slate-700 text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-30 hidden md:block lg:hidden shadow-xl">
                Exit Console
              </span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full relative z-10">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
