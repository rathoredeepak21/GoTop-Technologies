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
            active: app.active
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
      <section className="relative z-10 pt-16 pb-16 md:pt-24 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-cyber-grid">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Logo Brand Emblem */}
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <div 
              style={{ width: '35rem', maxWidth: '90%' }}
              className="relative aspect-[3.5/1] overflow-hidden flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(0,210,255,0.3)] transition-all duration-500 hover:scale-105"
            >
              <img 
                src={settings.logoUrl || '/logo.png'} 
                alt="Nexvora Logo" 
                className="absolute w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* H1 Heading */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-tight"
          >
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-blue-400 to-indigo-500 text-neon-glow">Tomorrow's</span> <br />
            Technology
          </motion.h1>

          {/* Subheading Description */}
          <motion.p 
            variants={itemVariants} 
            className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            {settings.companyName} is committed to developing robust, secure, and user-friendly software products. We engineer platforms that empower millions of users worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/apps"
              className="flex items-center space-x-2 w-full sm:w-auto justify-center text-base font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 hover:brightness-110 shadow-neon-strong px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              <span>Explore Apps</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="flex items-center justify-center w-full sm:w-auto text-base font-medium text-gray-300 hover:text-white bg-space-dark/60 hover:bg-space-dark border border-space-border hover:border-neon-blue px-8 py-3.5 rounded-xl transition-all duration-300"
            >
              <span>Learn More</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-12 bg-space-darker/60 border-y border-space-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Applications', value: '25+', icon: <Cpu className="h-5 w-5 text-neon-blue" /> },
              { label: 'Total Downloads', value: '1M+', icon: <Download className="h-5 w-5 text-neon-blue" /> },
              { label: 'Active Users', value: '100K+', icon: <Users className="h-5 w-5 text-neon-blue" /> },
              { label: 'System Uptime', value: '99.9%', icon: <Activity className="h-5 w-5 text-neon-blue" /> }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-center items-center gap-2 text-gray-500 text-xs tracking-wider uppercase">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <div className="text-2xl md:text-4xl font-display font-extrabold text-white text-neon-glow">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Applications Section */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            Featured Applications
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
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
                      className="h-14 w-14 rounded-xl object-contain bg-space-dark p-2 border border-space-border"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg font-display">{app.name}</h3>
                      <span className="text-[11px] tracking-wide bg-neon-blue/10 text-neon-blue px-2.5 py-0.5 rounded-full font-medium">
                        {app.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {app.shortDescription || app.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-300 font-semibold">{app.rating}</span>
                    </div>
                    <span>v{app.version}</span>
                  </div>
                  <Link
                    to={`/apps/details/${app.slug}`}
                    className="flex items-center justify-center space-x-2 w-full text-center text-xs font-semibold text-white bg-space-dark/80 hover:bg-neon-blue hover:text-space-darkest border border-space-border/80 hover:border-neon-blue py-3 rounded-lg transition-all duration-300"
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
          <Link to="/apps" className="inline-flex items-center space-x-2 text-neon-blue hover:underline text-sm font-semibold">
            <span>View all products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 py-20 bg-space-darker/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Our Capabilities
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              Engineered ecosystems designed to scale from mobile games to robust cloud systems.
            </p>
            <div className="neon-divider w-24 mx-auto pt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'App Development', desc: 'Crafting premium Native Android & iOS client applications.', icon: <Zap className="h-6 w-6 text-neon-blue" /> },
              { title: 'Web Architectures', desc: 'Dynamic, lighting-fast full-stack web and SaaS platforms.', icon: <Cpu className="h-6 w-6 text-neon-blue" /> },
              { title: 'AI Integration', desc: 'Custom transcription, visual matching, and NLP workflows.', icon: <Activity className="h-6 w-6 text-neon-blue" /> }
            ].map((service, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base font-display mb-1">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="text-xs text-neon-blue font-bold hover:underline">
              Browse full services catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white leading-tight">
              Why Global Developers Choose <br />
              <span className="text-neon-blue text-neon-glow uppercase">{settings.companyName.split(' ')[0]}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
              We design software that stands the test of load and time. Our design-centric engineering guarantees your solutions look exceptional while serving enterprise performance.
            </p>
            <ul className="space-y-4">
              {[
                { title: 'Security Best Practices', desc: 'Standard encryption buffers, hashed profiles, and threat firewalls.' },
                { title: 'Responsive Interfaces', desc: 'Clean layouts tailored for smartphones, tablets, and desktops.' },
                { title: 'Instant Support Logs', desc: '24/7 dedicated support queues to resolve update anomalies.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/20 to-indigo-500/20 filter blur-3xl opacity-50 rounded-full" />
            <img
              src="/mockup.jpg"
              alt="Nexvora Platform Mockup"
              className="rounded-2xl border border-space-border/80 shadow-2xl max-w-full h-auto object-cover max-h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-space-darker/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              Real testimonials from community members utilizing Nexvora products.
            </p>
            <div className="neon-divider w-24 mx-auto pt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Earn Spin is addicting! The leaderboards update in real-time, and the visual designs are premium. Easily my favorite utility app.", author: "Marcus Vance", role: "Mobile Gamer" },
              { text: "Video Saver is incredibly clean and fast. It downloads files without cluttering ads or lagging operations. Exceptional tool design.", author: "Elena Rostova", role: "Content Creator" },
              { text: "The UI design across all Nexvora applications feels futuristic and consistent. It matches Apple and Stripe quality standard.", author: "Kasper H.", role: "Lead Product Designer" }
            ].map((testi, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <p className="text-gray-300 italic text-sm leading-relaxed mb-6">
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
                  <h4 className="text-white font-bold text-sm">{testi.author}</h4>
                  <span className="text-gray-500 text-xs">{testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="relative z-10 py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="glass-panel p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-blue/10 rounded-full filter blur-[60px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full filter blur-[60px]" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">
              Ready to Upgrade Your <br />Digital Workflow?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Explore our full suite of tools and games in the download catalog, updated weekly with optimizations.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/downloads"
                className="flex items-center justify-center space-x-2 text-sm font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 shadow-neon-glow hover:brightness-110 px-8 py-3.5 rounded-xl transition-all duration-300"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Visit Download Center</span>
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold text-white bg-space-dark hover:bg-space-dark/80 border border-space-border px-8 py-3.5 rounded-xl transition-colors duration-300"
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
