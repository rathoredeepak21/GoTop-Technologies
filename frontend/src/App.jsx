import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBg from './components/ParticleBg';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Apps from './pages/Apps';
import AppDetails from './pages/AppDetails';
import Downloads from './pages/Downloads';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';

// Admin Pages
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageApps from './admin/ManageApps';
import ManageCategories from './admin/ManageCategories';
import ManageAnnouncements from './admin/ManageAnnouncements';
import ManageSettings from './admin/ManageSettings';
import ManageAbout from './admin/ManageAbout';

const App = () => {
  const location = useLocation();

  // Reset scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route is an admin management console view (excludes admin login)
  const isAdminConsoleRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="relative min-h-screen bg-space-darkest text-gray-100 font-sans flex flex-col justify-between">
      
      {/* Particle Animation Background (Active across all public pages) */}
      {!isAdminConsoleRoute && <ParticleBg />}

      {/* Header Navbar (Omitted inside admin dashboards) */}
      {!isAdminConsoleRoute && <Navbar />}

      {/* Main Pages router outlets */}
      <div className="flex-1 w-full relative z-10">
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/details/:slug" element={<AppDetails />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Console Views (nested under AdminLayout shell) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/apps" 
            element={
              <AdminLayout>
                <ManageApps />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <AdminLayout>
                <ManageCategories />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/announcements" 
            element={
              <AdminLayout>
                <ManageAnnouncements />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/about" 
            element={
              <AdminLayout>
                <ManageAbout />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminLayout>
                <ManageSettings />
              </AdminLayout>
            } 
          />
        </Routes>
      </div>

      {/* Footer Navbar (Omitted inside admin dashboards) */}
      {!isAdminConsoleRoute && <Footer />}
      
    </div>
  );
};

export default App;
