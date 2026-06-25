import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Settings as SettingsIcon, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

const ManageSettings = () => {
  const { token } = useAuth();
  const { settings, updateSettings } = useSettings();
  
  // Local form states
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [footerText, setFooterText] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Social states
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [telegram, setTelegram] = useState('');

  // Status banners
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  // Sync settings context to local state
  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || '');
      setTagline(settings.tagline || '');
      setFooterText(settings.footerText || '');
      setContactEmail(settings.contactEmail || '');
      setContactPhone(settings.contactPhone || '');
      setAddress(settings.address || '');

      if (settings.socialLinks) {
        setFacebook(settings.socialLinks.facebook || '');
        setTwitter(settings.socialLinks.twitter || '');
        setLinkedin(settings.socialLinks.linkedin || '');
        setGithub(settings.socialLinks.github || '');
        setTelegram(settings.socialLinks.telegram || '');
      }
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    const payload = {
      companyName,
      tagline,
      footerText,
      contactEmail,
      contactPhone,
      address,
      socialLinks: {
        facebook,
        twitter,
        linkedin,
        github,
        telegram
      }
    };

    try {
      const res = await updateSettings(payload, token);
      if (res.success) {
        setStatus({ type: 'success', message: 'Website branding settings successfully synchronized.' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Failed to update website settings.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Network error updating settings.' });
    } finally {
      setSaving(false);
      // Clear success banner after 4 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-white">Console Branding Settings</h1>
        <p className="text-gray-400 text-xs mt-1">Configure company name, taglines, footer declarations, and social endpoints.</p>
      </div>

      {/* Main Forms Split */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-space-border/60">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Status banner alerts */}
          {status.message && (
            <div className={`flex items-start space-x-2.5 p-4 rounded-xl border text-xs ${
              status.type === 'success'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />}
              <span className="font-semibold">{status.message}</span>
            </div>
          )}

          {/* Section: Core Branding */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-space-border/40 pb-2 flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4 text-neon-blue" />
              <span>Identity & Logos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                  placeholder="NEXVORA TECHNOLOGIES"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">Brand Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                  placeholder="Building Tomorrow's Technology"
                />
              </div>
            </div>

            {/* Footer Text */}
            <div className="space-y-1">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Footer Copyright Copytext</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                placeholder="© 2026 NEXVORA TECHNOLOGIES. All rights reserved."
              />
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-space-border/40 pb-2 flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4 text-neon-blue" />
              <span>Contact Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Support Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                  placeholder="support@nexvora.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Telephone Desk</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                  placeholder="+1 (555) 308-2510"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500"
                placeholder="100 Innovation Way, Suite 400, Silicon Valley, CA"
              />
            </div>
          </div>

          {/* Section: Social Links */}
          <div className="space-y-4 pt-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-space-border/40 pb-2 flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4 text-neon-blue" />
              <span>Social Networks</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Facebook */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Facebook Link</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 font-mono"
                  placeholder="https://facebook.com/..."
                />
              </div>

              {/* Twitter */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Twitter (X) Link</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 font-mono"
                  placeholder="https://twitter.com/..."
                />
              </div>

              {/* Linkedin */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">LinkedIn Link</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 font-mono"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              {/* Github */}
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">GitHub Link</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 font-mono"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Telegram */}
            <div className="space-y-1 sm:max-w-[50%]">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Telegram Channel Link</label>
              <input
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-space-dark border border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 font-mono"
                placeholder="https://t.me/..."
              />
            </div>
          </div>

          {/* Action button */}
          <div className="border-t border-space-border/40 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center space-x-2 text-sm font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 hover:brightness-110 shadow-neon-glow px-6 py-3.5 rounded-xl transition-all"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{saving ? 'Synchronizing settings...' : 'Commit Configurations'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default ManageSettings;
