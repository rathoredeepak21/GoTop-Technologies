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
    <footer className="relative bg-[#0F172A] border-t border-slate-800 z-10 pt-16 pb-8 text-gray-300">
      {/* Glow ambient background elements */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F97316]/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-slate-900/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          
          {/* Brand Info Column */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/icon.png" 
                alt={settings.companyName} 
                className="h-9 w-auto object-contain"
              />
              <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
                {settings.companyName}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs text-center md:text-left">
              {settings.tagline || "Technology That Takes You to the Top"}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2 justify-center md:justify-start">
              {settings.socialLinks && Object.entries(settings.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-400 hover:text-[#F97316] hover:border-[#F97316] transition-all duration-300 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    {socialIcons[platform] || <Send className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-0 md:border-l-2 border-[#F97316] pl-0 md:pl-2 text-center md:text-left">
              Quick Links
            </h3>
            <ul className="space-y-3 text-center md:text-left">
              {[
                { name: 'Home', path: '/' },
                { name: 'Apps', path: '/apps' },
                { name: 'Announcements', path: '/announcements' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-[#F97316] text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-0 md:border-l-2 border-[#F97316] pl-0 md:pl-2 text-center md:text-left">
              Categories
            </h3>
            <ul className="space-y-3 text-center md:text-left">
              {[
                { name: 'Games', path: '/apps?category=games' },
                { name: 'Tools', path: '/apps?category=tools' },
                { name: 'Photography', path: '/apps?category=photography' },
                { name: 'Entertainment', path: '/apps?category=entertainment' },
                { name: 'AI Tools', path: '/apps?category=ai-tools' }
              ].map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="text-gray-400 hover:text-[#F97316] text-sm transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4 border-l-0 md:border-l-2 border-[#F97316] pl-0 md:pl-2 text-center md:text-left">
              Stay Connected
            </h3>
            <div className="flex items-center md:items-start space-x-3 text-sm text-gray-400 justify-center md:justify-start">
              <Mail className="h-5 w-5 text-[#F97316] shrink-0" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-[#F97316] transition-colors">
                {settings.contactEmail}
              </a>
            </div>
            <div className="flex items-center md:items-start space-x-3 text-sm text-gray-400 justify-center md:justify-start">
              <Phone className="h-5 w-5 text-[#F97316] shrink-0" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-center md:items-start space-x-3 text-sm text-gray-400 leading-normal justify-center md:justify-start text-center md:text-left">
              <MapPin className="h-5 w-5 text-[#F97316] shrink-0" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        <div className="neon-divider my-8" />

        {/* Bottom copyright and legal links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
          <p>{settings.footerText || `© 2026 ${settings.companyName}. All rights reserved.`}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#F97316] transition-colors">Terms of Service</Link>
            <Link to="/dmca" className="hover:text-[#F97316] transition-colors">DMCA Compliance</Link>
            <Link to="/contact" className="hover:text-[#F97316] transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
