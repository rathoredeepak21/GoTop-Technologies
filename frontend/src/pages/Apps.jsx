import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid, Star, Download, AppWindow, Cpu } from 'lucide-react';
import { supabase } from '../config/supabase';

const Apps = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        if (data) {
          const list = data.map((c) => ({
            _id: c.id,
            name: c.name,
            icon: c.icon,
            slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }));
          setCategories(list);
        }
      } catch (err) {
        console.error('Error fetching Supabase categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load and filter apps from Supabase
  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*, categories(name)')
          .eq('active', true);

        if (error) throw error;

        if (data) {
          let list = data.map((app) => ({
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

          // Client-side filtering to keep database queries simple
          if (activeCategory) {
            list = list.filter(a => a.categorySlug === activeCategory);
          }
          if (searchQuery) {
            const queryStr = searchQuery.toLowerCase();
            list = list.filter(a => 
              a.name.toLowerCase().includes(queryStr) || 
              (a.description && a.description.toLowerCase().includes(queryStr)) ||
              (a.shortDescription && a.shortDescription.toLowerCase().includes(queryStr))
            );
          }

          setApps(list);
        }
      } catch (err) {
        console.error('Error loading Supabase apps:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadApps();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const selectCategory = (slug) => {
    if (slug === '') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Background ambient lighting */}
      <div className="glow-circle-blue top-1/4 right-0" />
      <div className="glow-circle-indigo bottom-1/4 left-0" />

      <div className="container-custom relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[11px] font-semibold text-[#F97316] uppercase tracking-[0.2em]">Application Vault</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#0F172A]">Our Applications</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Explore our collection of utilities, games, photography tools, and SaaS assistants engineered by GoTop Technologies.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Top Horizontal Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 transition-all placeholder-gray-400 shadow-sm"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Category Horizontal Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => selectCategory('')}
              className={`px-4 py-2.5 rounded-xl text-sm transition-all flex items-center space-x-2 border ${
                activeCategory === ''
                  ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30 font-semibold'
                  : 'bg-gray-50 border-slate-250 text-gray-600 hover:text-[#0F172A] hover:bg-gray-100/50'
              }`}
            >
              <span>All Categories</span>
              <Grid className="h-4 w-4 opacity-75" />
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => selectCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all flex items-center space-x-2 border ${
                  activeCategory === cat.slug
                    ? 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30 font-semibold'
                    : 'bg-gray-50 border-slate-250 text-gray-600 hover:text-[#0F172A] hover:bg-gray-100/50'
                }`}
              >
                <span>{cat.name}</span>
                <AppWindow className="h-4 w-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Full-width Apps Catalog Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="glass-panel rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
              <Cpu className="h-12 w-12 text-gray-500 mx-auto" />
              <h3 className="text-[#0F172A] font-bold text-lg font-display">No Applications Found</h3>
              <p className="text-gray-600 text-sm max-w-sm mx-auto">
                We couldn't find any applications matching your current filter parameters. Try checking your keywords or selecting another category.
              </p>
              <button
                onClick={() => { selectCategory(''); setSearchQuery(''); }}
                className="text-xs font-semibold text-[#F97316] underline hover:brightness-110"
              >
                Clear filters & search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apps.map((app) => (
                <motion.div
                  key={app._id}
                  layout
                  whileHover={{ y: -4 }}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Logo and Name */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={app.iconUrl || '/logo.png'}
                          alt={app.name}
                          className="h-14 w-14 rounded-xl object-contain bg-gray-50 p-2 border border-slate-100"
                        />
                        <div>
                          <h3 className="text-[#0F172A] font-bold text-base font-display">{app.name}</h3>
                          <span className="text-[10px] tracking-wide bg-[#F97316]/10 text-[#F97316] px-2.5 py-0.5 rounded-full font-semibold mt-0.5 inline-block">
                            {app.category}
                          </span>
                        </div>
                      </div>
                      {/* Rating pill */}
                      <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[#0F172A] text-xs font-bold">{app.rating}</span>
                      </div>
                    </div>
                    
                    {/* Short Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 break-words">
                      {app.shortDescription || app.description}
                    </p>
                  </div>

                  {/* Metadata and Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                    <div className="text-[11px] text-gray-500 space-y-0.5 w-full xs:w-auto">
                      <div>Size: <span className="text-gray-700 font-semibold">{app.apk_size}</span></div>
                      <div>Version: <span className="text-gray-700 font-semibold font-mono">v{app.version}</span></div>
                    </div>
                    
                    <div className="flex space-x-2 w-full xs:w-auto">
                      <Link
                        to={`/apps/details/${app.slug}`}
                        className="flex-1 xs:flex-none text-center px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-gray-100/50 border border-slate-200 rounded-lg transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/apps/details/${app.slug}?action=download`}
                        className="flex-1 xs:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition-all"
                      >
                        <Download className="h-3 w-3 shrink-0" />
                        <span>Download</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Apps;
