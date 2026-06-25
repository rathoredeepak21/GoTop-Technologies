import React from 'react';
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
  Info
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Manage Apps', path: '/admin/apps', icon: <AppWindow className="h-5 w-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers className="h-5 w-5" /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <BellRing className="h-5 w-5" /> },
    { name: 'About Page Settings', path: '/admin/about', icon: <Info className="h-5 w-5" /> },
    { name: 'Branding Settings', path: '/admin/settings', icon: <SettingsIcon className="h-5 w-5" /> }
  ];

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen bg-space-darkest flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-neon-blue animate-spin" />
          <span className="text-gray-400 text-sm">Authenticating panel security session...</span>
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
    <div className="min-h-screen bg-space-darkest flex flex-col md:flex-row">
      
      {/* Sidebar (Left on desktop, top on mobile) */}
      <aside className="w-full md:w-64 bg-space-darker border-b md:border-b-0 md:border-r border-space-border/60 flex flex-col justify-between p-6 shrink-0 z-20">
        <div className="space-y-8">
          
          {/* Logo & title header */}
          <div className="flex items-center space-x-3 border-b border-space-border/40 pb-5">
            <img
              src="/icon.png"
              alt="Brand Logo"
              className="h-9 w-auto filter drop-shadow-[0_0_6px_rgba(0,210,255,0.4)]"
            />
            <div>
              <h2 className="text-white font-bold font-display text-sm tracking-wider uppercase">
                {settings.companyName.split(' ')[0]} CONSOLE
              </h2>
              <div className="flex items-center space-x-1 text-[9px] text-green-400 uppercase tracking-widest font-mono">
                <ShieldCheck className="h-3 w-3 inline" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-neon-blue/15 text-neon-blue border-l-4 border-neon-blue'
                    : 'text-gray-400 hover:text-white hover:bg-space-dark/40'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile & logout footer */}
        <div className="mt-8 pt-5 border-t border-space-border/40 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-9 w-9 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center font-display font-bold text-neon-blue text-sm uppercase">
              {admin?.username?.substring(0, 2) || 'AD'}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-semibold truncate uppercase">{admin?.username || 'Admin'}</div>
              <div className="text-[10px] text-gray-500 truncate">{admin?.email}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white px-4 py-2 hover:bg-space-dark/40 rounded-lg transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return to Site</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-xs font-semibold text-red-400 hover:text-red-300 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Console</span>
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
