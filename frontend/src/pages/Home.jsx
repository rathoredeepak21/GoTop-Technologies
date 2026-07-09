import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Cpu, ShieldCheck, Zap, Activity, Users, Download } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../config/supabase';

const Home = () => {
  const { settings } = useSettings();
  const [featuredApps, setFeaturedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Log analytics visit directly to Supabase
    const logVisit = async () => {
      try {
        await supabase.from('analytics_logs').insert({
          event_type: 'visit',
          ip: 'Client-side',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error logging visitor to Supabase:', err);
      }
    };
    logVisit();

    // 2. Fetch featured apps from Supabase with categories join
    const fetchApps = async () => {
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*, categories(name)')
          .eq('active', true);

        if (error) throw error;

        if (data) {
          const list = data.map(app => ({
            _id: app.id,
            name: app.app_name,
            slug: app.slug,
            description: app.description,
            shortDescription: app.short_description,
            category: app.categories?.name || 'Tools',
            categorySlug: (app.categories?.name || 'tools').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            version: app.version,
            rating: app.rating || 5.0,
            downloadCount: app.download_count || 0,
            iconUrl: app.logo_url,
            screenshots: app.screenshots || [],
            active: app.active,
            apk_size: app.apk_size
          }));

          // Sort by downloadCount and take top 3
          const sorted = list
            .sort((a, b) => b.downloadCount - a.downloadCount)
            .slice(0, 3);
          setFeaturedApps(sorted);
        }
      } catch (err) {
        console.error('Error loading Supabase apps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 60 } }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-radial-neon opacity-75 pointer-events-none z-0" />
      <div className="glow-circle-blue top-20 left-10" />
      <div className="glow-circle-indigo bottom-20 right-10" />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 md:pt-20 md:pb-24 container-custom bg-cyber-grid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Heading, Text, CTA Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
          >
            {/* H1 Heading */}
            <motion.h1 
              variants={itemVariants} 
              className="text-[26px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#0F172A] leading-tight"
            >
              Technology That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#EA580C]">Takes You</span> <br className="hidden sm:block" />
              to the Top
            </motion.h1>
  
            {/* Subheading Description */}
            <motion.p 
              variants={itemVariants} 
              className="text-gray-600 text-sm sm:text-base md:text-xl max-w-2xl lg:max-w-none font-light leading-relaxed px-2 lg:px-0"
            >
              {settings.companyName} is committed to developing robust, secure, and user-friendly software products. We engineer platforms that empower millions of users worldwide.
            </motion.p>
  
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-4 w-full max-w-full lg:max-w-none mx-auto lg:mx-0">
              <Link
                to="/apps"
                className="flex items-center space-x-2 w-full sm:w-auto justify-center text-base font-bold text-white bg-[#F97316] hover:bg-[#EA580C] hover:scale-[1.02] active:scale-[0.98] px-6 sm:px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(249,115,22,0.25)]"
              >
                <span>Explore Apps</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center w-full sm:w-auto text-base font-semibold text-[#0F172A] hover:bg-gray-100/50 hover:scale-[1.02] active:scale-[0.98] border border-slate-200 px-6 sm:px-8 py-3.5 rounded-xl transition-all duration-300"
              >
                <span>Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Logo Brand Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div 
              className="relative w-full max-w-[280px] sm:max-w-[420px] md:max-w-[500px] aspect-[3.5/1] overflow-hidden flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-500 hover:scale-105"
            >
              <img 
                src={settings.logoUrl || '/logo.png'} 
                alt="GoTop Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
          
        </div>
      </section>
 
      {/* Statistics Section */}
      <section className="relative z-10 py-12 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Applications', value: '25+', icon: <Cpu className="h-5 w-5 text-[#F97316]" /> },
              { label: 'Total Downloads', value: '1M+', icon: <Download className="h-5 w-5 text-[#F97316]" /> },
              { label: 'Active Users', value: '100K+', icon: <Users className="h-5 w-5 text-[#F97316]" /> },
              { label: 'System Uptime', value: '99.9%', icon: <Activity className="h-5 w-5 text-[#F97316]" /> }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-center items-center gap-2 text-gray-500 text-xs tracking-wider uppercase">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <div className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Featured Applications Section */}
      <section className="relative z-10 py-20 container-custom">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
            Featured Applications
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Discover our high-performing solutions engineered for seamless performance.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>
 
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredApps.map((app) => (
              <motion.div
                key={app._id}
                whileHover={{ y: -6 }}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={app.iconUrl || '/logo.png'} 
                      alt={app.name} 
                      className="h-14 w-14 rounded-xl object-contain bg-gray-50 p-2 border border-slate-100"
                    />
                    <div>
                      <h3 className="text-[#0F172A] font-bold text-lg font-display">{app.name}</h3>
                      <span className="text-[11px] tracking-wide bg-[#F97316]/10 text-[#F97316] px-2.5 py-0.5 rounded-full font-semibold">
                        {app.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 break-words">
                    {app.shortDescription || app.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700 font-bold">{app.rating}</span>
                    </div>
                    <span>v{app.version}</span>
                  </div>
                  <Link
                    to={`/apps/details/${app.slug}`}
                    className="flex items-center justify-center space-x-2 w-full text-center text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F97316] hover:text-white border border-gray-200 hover:border-[#F97316] py-3 rounded-lg transition-all duration-300 shadow-sm"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/apps" className="inline-flex items-center space-x-2 text-[#F97316] hover:underline text-sm font-semibold">
            <span>View all products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
 
      {/* Services Grid */}
      <section className="relative z-10 py-20 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
              Our Capabilities
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
              Engineered ecosystems designed to scale from mobile games to robust cloud systems.
            </p>
            <div className="neon-divider w-24 mx-auto pt-2" />
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'App Development', desc: 'Crafting premium Native Android & iOS client applications.', icon: <Zap className="h-6 w-6 text-[#F97316]" /> },
              { title: 'Web Architectures', desc: 'Dynamic, lighting-fast full-stack web and SaaS platforms.', icon: <Cpu className="h-6 w-6 text-[#F97316]" /> },
              { title: 'AI Integration', desc: 'Custom transcription, visual matching, and NLP workflows.', icon: <Activity className="h-6 w-6 text-[#F97316]" /> }
            ].map((service, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-[#0F172A] font-bold text-base font-display mb-1">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="text-xs text-[#F97316] font-bold hover:underline">
              Browse full services catalog
            </Link>
          </div>
        </div>
      </section>
 
      {/* Why Choose Us Section */}
      <section className="relative z-10 py-20 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#0F172A] leading-tight">
              Why Global Developers Choose <br className="hidden sm:block" />
              <span className="text-[#F97316] uppercase">{settings.companyName.split(' ')[0]}</span>
            </h2>
            <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
              We design software that stands the test of load and time. Our design-centric engineering guarantees your solutions look exceptional while serving enterprise performance.
            </p>
            <ul className="space-y-4">
              {[
                { title: 'Security Best Practices', desc: 'Standard encryption buffers, hashed profiles, and threat firewalls.' },
                { title: 'Responsive Interfaces', desc: 'Clean layouts tailored for smartphones, tablets, and desktops.' },
                { title: 'Instant Support Logs', desc: '24/7 dedicated support queues to resolve update anomalies.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[#0F172A] font-bold text-sm">{item.title}</h4>
                    <p className="text-gray-600 text-xs">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F97316]/10 to-indigo-500/10 filter blur-3xl opacity-50 rounded-full" />
            <img
              src="/mockup.jpg"
              alt="GoTop Platform Mockup"
              className="rounded-2xl border border-slate-200 shadow-2xl max-w-full h-auto object-cover max-h-[420px]"
            />
          </div>
        </div>
      </section>
 
      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
              Real testimonials from community members utilizing GoTop products.
            </p>
            <div className="neon-divider w-24 mx-auto pt-2" />
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Earn Spin is addicting! The leaderboards update in real-time, and the visual designs are premium. Easily my favorite utility app.", author: "Marcus Vance", role: "Mobile Gamer" },
              { text: "Video Saver is incredibly clean and fast. It downloads files without cluttering ads or lagging operations. Exceptional tool design.", author: "Elena Rostova", role: "Content Creator" },
              { text: "The UI design across all GoTop applications feels futuristic and consistent. It matches Apple and Stripe quality standard.", author: "Kasper H.", role: "Lead Product Designer" }
            ].map((testi, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <p className="text-gray-600 italic text-sm leading-relaxed mb-6">
                  "{testi.text}"
                </p>
                <div>
                  <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <h4 className="text-[#0F172A] font-bold text-sm">{testi.author}</h4>
                  <span className="text-gray-500 text-xs">{testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Call To Action */}
      <section className="relative z-10 py-16 sm:py-24 container-custom text-center">
        <div className="relative bg-[#0F172A] border border-slate-800 p-8 sm:p-12 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F97316]/10 rounded-full filter blur-[60px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-900/40 rounded-full filter blur-[60px]" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold text-white">
              Ready to Upgrade Your <br className="hidden sm:block" />Digital Workflow?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Explore our full suite of tools and games in the download catalog, updated weekly with optimizations.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 w-full">
              <Link
                to="/downloads"
                className="flex items-center justify-center space-x-2 text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] px-6 sm:px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md w-full sm:w-auto"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Visit Download Center</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 sm:px-8 py-3.5 rounded-xl transition-colors duration-300 w-full sm:w-auto"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
