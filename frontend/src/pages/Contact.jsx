import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCode, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../config/supabase';

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_tickets').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'No Subject',
        message: formData.message,
        status: 'open'
      });
      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error logging support ticket to Supabase:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Ambient background glows */}
      <div className="glow-circle-blue top-1/4 right-10" />
      <div className="glow-circle-indigo bottom-1/4 left-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-semibold text-[#F97316] uppercase tracking-[0.2em]">Contact Hub</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#0F172A]">Connect With Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Reach out for enterprise partnerships, general support requests, or application bug reports.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Contact Details Panel (2/5 size) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-[#0F172A] border-l-4 border-[#F97316] pl-4">
                Support Channels
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Our support desk coordinates active updates and logs errors. Reach out directly or complete the contact form to open a ticket.
              </p>
            </div>

            {/* Widgets list */}
            <div className="space-y-6">
              
              {/* Mail */}
              <div className="glass-panel p-5 rounded-2xl flex items-start space-x-4 bg-white border border-slate-200 shadow-sm">
                <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
                  <Mail className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</h4>
                  <a href={`mailto:${settings.contactEmail}`} className="text-[#0F172A] hover:text-[#F97316] text-sm font-medium transition-colors">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="glass-panel p-5 rounded-2xl flex items-start space-x-4 bg-white border border-slate-200 shadow-sm">
                <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
                  <Phone className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Direct Telephone</h4>
                  <span className="text-[#0F172A] text-sm font-medium">{settings.contactPhone}</span>
                </div>
              </div>

              {/* Address */}
              <div className="glass-panel p-5 rounded-2xl flex items-start space-x-4 bg-white border border-slate-200 shadow-sm">
                <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
                  <MapPin className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Headquarters</h4>
                  <span className="text-[#0F172A] text-sm font-medium leading-relaxed block">{settings.address}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Panel (3/5 size) */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="glass-panel p-8 md:p-12 rounded-3xl text-center space-y-6 bg-white border border-slate-200 shadow-xl">
                <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto glow-pulse rounded-full" />
                <div className="space-y-2">
                  <h3 className="text-[#0F172A] font-extrabold text-2xl font-display">Message Transmitted</h3>
                  <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed font-light">
                    Thank you for reaching out. We have logged your support query and dispatched it to our press queues. An engineer will respond shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-[#F97316] hover:brightness-110 bg-[#F97316]/10 border border-[#F97316]/20 px-5 py-2.5 rounded-lg transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-[#0F172A] font-bold text-lg font-display mb-6 flex items-center space-x-2">
                  <MessageSquareCode className="h-5 w-5 text-[#F97316]" />
                  <span>File Support Ticket</span>
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                      placeholder="App Bug Report, Partnership, etc."
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Message Details</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all resize-none"
                      placeholder="Please write your detailed request here..."
                    />
                  </div>

                  {/* Action button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-[0_4px_14px_rgba(249,115,22,0.25)] py-3.5 rounded-xl transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Transmitting...' : 'Dispatch Ticket'}</span>
                  </button>

                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
