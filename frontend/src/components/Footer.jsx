import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Github, Send, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  const socialIcons = {
    facebook: <Facebook className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    github: <Github className="h-4 w-4" />,
    telegram: <Send className="h-4 w-4" />
  };

  return (
    <footer className="relative bg-space-darkest/95 border-t border-space-border/60 z-10 pt-16 pb-8">
      {/* Glow ambient background elements */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/icon.png" 
                alt={settings.companyName} 
                className="h-9 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]"
              />
              <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
                {settings.companyName}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {settings.tagline || "Building Tomorrow's Technology"}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {settings.socialLinks && Object.entries(settings.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-space-dark border border-space-border/40 text-gray-400 hover:text-neon-blue hover:border-neon-blue transition-all duration-300 hover:shadow-neon-glow"
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    {socialIcons[platform] || <Send className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-2 border-neon-blue pl-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Apps', path: '/apps' },
                { name: 'Announcements', path: '/announcements' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-neon-blue text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-2 border-neon-blue pl-2">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Games', path: '/apps?category=games' },
                { name: 'Tools', path: '/apps?category=tools' },
                { name: 'Photography', path: '/apps?category=photography' },
                { name: 'Entertainment', path: '/apps?category=entertainment' },
                { name: 'AI Tools', path: '/apps?category=ai-tools' }
              ].map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="text-gray-400 hover:text-neon-blue text-sm transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-2 border-neon-blue pl-2">
              Stay Connected
            </h3>
            <div className="flex items-start space-x-3 text-sm text-gray-400">
              <Mail className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-neon-blue transition-colors">
                {settings.contactEmail}
              </a>
            </div>
            <div className="flex items-start space-x-3 text-sm text-gray-400">
              <Phone className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-gray-400 leading-normal">
              <MapPin className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        <div className="neon-divider my-8" />

        {/* Bottom copyright and legal links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{settings.footerText || `© 2026 ${settings.companyName}. All rights reserved.`}</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neon-blue transition-colors">DMCA Compliance</a>
            <Link to="/contact" className="hover:text-neon-blue transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
