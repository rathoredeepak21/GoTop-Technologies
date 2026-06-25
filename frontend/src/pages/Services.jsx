import React from 'react';
import { Smartphone, Globe, Brain, Palette, Code, Cloud, Terminal, CheckCircle2 } from 'lucide-react';

const Services = () => {
  const servicesList = [
    {
      title: 'App Development',
      icon: <Smartphone className="h-6 w-6 text-neon-blue" />,
      desc: 'Engineering high-performance client applications for Android and iOS systems. We design secure SDK layers, local caching mechanisms, and native hardware hooks.',
      features: ['Native Kotlin & Swift integrations', 'Cross-platform React Native layouts', 'Low-power system resource allocation', 'App Store and Google Play deployment']
    },
    {
      title: 'Web Architectures',
      icon: <Globe className="h-6 w-6 text-neon-blue" />,
      desc: 'Developing fast, production-ready web platforms and software-as-a-service (SaaS) databases. We focus on light page sizes, SEO, and robust CRUD routing structures.',
      features: ['Vite, React & NextJS frontends', 'NodeJS Express API backends', 'MongoDB & SQL database clusters', 'Secure JWT token authentication']
    },
    {
      title: 'AI Solutions',
      icon: <Brain className="h-6 w-6 text-neon-blue" />,
      desc: 'Building intelligent modules that process workflows automatically. We develop local transcription engines, visual matching clusters, and custom transformer adapters.',
      features: ['Transcription & voice analysis', 'Visual classifier integrations', 'Private on-device ML runtimes', 'Predictive modeling algorithms']
    },
    {
      title: 'UI/UX Design',
      icon: <Palette className="h-6 w-6 text-neon-blue" />,
      desc: 'Crafting responsive user interfaces centered on clarity, micro-sound cues, and premium dark assets. We build design systems that scale from smartphones to desktops.',
      features: ['Futuristic Glassmorphism tokens', 'Tailwind-optimized color palettes', 'Fluid transitions & animations', 'Accessibility compliance validation']
    },
    {
      title: 'Software Development',
      icon: <Code className="h-6 w-6 text-neon-blue" />,
      desc: 'Writing optimized libraries and utility tools to automate system management, file structures, and data encryption. We build software that performs with zero lag.',
      features: ['Cross-platform shell utilities', 'Secure file encryption pipelines', 'Automated data backup modules', 'Custom hardware driver overlays']
    },
    {
      title: 'Cloud Solutions',
      icon: <Cloud className="h-6 w-6 text-neon-blue" />,
      desc: 'Architecting distributed database instances and download networks. We secure your uploads, manage Cloudinary storage pools, and optimize APK delivery speeds.',
      features: ['Distributed server clusters', 'Content Delivery Network (CDN) pools', 'Cloudinary resource management', 'API endpoint firewalls & telemetry']
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Glow backgrounds */}
      <div className="glow-circle-blue top-1/4 left-10" />
      <div className="glow-circle-indigo bottom-1/4 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-semibold text-neon-blue uppercase tracking-[0.2em]">Our Capabilities</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Services & Capabilities</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Nexvora provides top-tier technology development across mobile, web, artificial intelligence, and cloud architectures.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Icon */}
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                    {service.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg font-display">{service.title}</h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>

              {/* Bullet Features */}
              <div className="mt-6 pt-6 border-t border-space-border/40">
                <ul className="space-y-2">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2 text-xs text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-neon-blue shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Development Process Timeline */}
        <section className="mt-24 glass-panel p-8 md:p-12 rounded-3xl">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl font-bold text-white font-display">Our Engineering Protocol</h2>
            <p className="text-gray-400 text-sm">How we build and launch premium technology platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Scope & Design', desc: 'Drafting high-end mockup assets, user flows, and database schemas.' },
              { step: '02', title: 'Code & Test', desc: 'Writing optimized modular scripts backed by automated unit checks.' },
              { step: '03', title: 'Audit & Secure', desc: 'Performing JWT validation, network audits, and file leak checking.' },
              { step: '04', title: 'Scale & Monitor', desc: 'Publishing to CDNs and tracking server uptime and client logs.' }
            ].map((p, idx) => (
              <div key={idx} className="relative space-y-3">
                <div className="text-3xl font-display font-extrabold text-neon-blue opacity-50">
                  {p.step}
                </div>
                <h4 className="text-white font-semibold text-base">{p.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 -right-4 w-8 h-[1px] bg-neon-blue/30" />
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Services;
