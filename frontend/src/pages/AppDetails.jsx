import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Download, Star, Calendar, Info, RefreshCw, ChevronRight, ChevronLeft, Check, Maximize2, X } from 'lucide-react';
import { supabase } from '../config/supabase';

const AppDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('features');
  const [downloading, setDownloading] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  // Drag and Swipe Screenshot Gallery Handlers
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    setDragMoved(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed modifier
    sliderRef.current.scrollLeft = scrollLeft - walk;
    setDragMoved(true);
  };

  const handleScreenshotClick = (idx) => {
    if (dragMoved) return; // Prevent fullscreen if user is dragging/scrolling
    setFullscreenIndex(idx);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const prevFullscreen = (e) => {
    e.stopPropagation();
    if (app && app.screenshots) {
      setFullscreenIndex((prev) => (prev === 0 ? app.screenshots.length - 1 : prev - 1));
    }
  };

  const nextFullscreen = (e) => {
    e.stopPropagation();
    if (app && app.screenshots) {
      setFullscreenIndex((prev) => (prev === app.screenshots.length - 1 ? 0 : prev + 1));
    }
  };

  // Load app details
  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*, categories(name)')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const appObj = {
            _id: data.id,
            name: data.app_name,
            slug: data.slug,
            description: data.description,
            shortDescription: data.short_description,
            category: data.categories?.name || 'Tools',
            categorySlug: (data.categories?.name || 'tools').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            version: data.version,
            rating: data.rating || 5.0,
            downloadCount: data.download_count || 0,
            iconUrl: data.logo_url,
            screenshots: data.screenshots || [],
            changelog: data.changelog || [],
            features: data.features || [],
            apkDownloadUrl: data.apk_download_url,
            releaseNotes: data.release_notes,
            active: data.active
          };
          setApp(appObj);
          
          // Auto-trigger download if navigated with download action query parameter
          const searchParams = new URLSearchParams(location.search);
          if (searchParams.get('action') === 'download') {
            setTimeout(() => {
              triggerDownload(appObj);
            }, 500);
          }
        } else {
          setError('Application not found');
        }
      } catch (err) {
        console.error('Error fetching app details:', err);
        setError('Server error loading application details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [slug, location.search]);

  // Handle download trigger
  const triggerDownload = async (appObj) => {
    if (!appObj) return;
    setDownloading(true);
    try {
      // 1. Post analytics download tracking event directly to Supabase
      await supabase.from('analytics_logs').insert({
        event_type: 'download',
        ip: 'Client-side',
        user_agent: navigator.userAgent,
        app_name: appObj.name,
        timestamp: new Date().toISOString()
      });

      // 2. Increment downloadCount in Supabase
      const newCount = (appObj.downloadCount || 0) + 1;
      const { error: updateErr } = await supabase
        .from('apps')
        .update({ download_count: newCount })
        .eq('id', appObj._id);

      if (updateErr) throw updateErr;
      
      setApp(prev => ({ ...prev, downloadCount: newCount }));
      // 3. Redirect to external GitHub release URL
      const downloadUrl = appObj.apkDownloadUrl || '#';
      if (downloadUrl && downloadUrl !== '#') {
        window.location.href = downloadUrl;
      } else {
        alert('Download link is not configured for this application.');
      }
    } catch (err) {
      console.error('Failed to trigger download:', err);
    } finally {
      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-[#F97316] animate-spin" />
          <span className="text-gray-600 text-sm">Loading application properties...</span>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="glass-panel max-w-md p-8 rounded-2xl text-center space-y-4 bg-white border border-slate-200">
          <Info className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-[#0F172A] text-xl font-bold font-display">{error || 'An error occurred'}</h2>
          <p className="text-gray-600 text-sm">
            We couldn't resolve the details for this application. It may have been deactivated or removed by the administrator.
          </p>
          <Link to="/apps" className="text-[#F97316] hover:brightness-110 underline text-sm font-semibold inline-block">
            Return to App Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Background ambient lighting */}
      <div className="glow-circle-blue top-10 left-1/4" />
      <div className="glow-circle-indigo bottom-10 right-1/4" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/apps" className="hover:text-[#F97316] transition-colors">Apps</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#0F172A] font-semibold">{app.name}</span>
        </div>

        {/* Product Identity Block */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl mb-12 bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8">
            
            {/* Logo & Details */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <img
                src={app.iconUrl || '/logo.png'}
                alt={app.name}
                className="h-24 w-24 md:h-32 md:w-32 rounded-3xl object-contain bg-gray-50 p-3 border border-slate-100 filter drop-shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
              />
              <div className="space-y-3">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#0F172A]">{app.name}</h1>
                  <span className="text-xs tracking-wider bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full font-semibold inline-block">
                    {app.category}
                  </span>
                </div>
                
                {/* Short stats */}
                <div className="flex items-center justify-center md:justify-start space-x-6 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-[#0F172A] font-bold text-sm">{app.rating}</span>
                    <span>/ 5.0</span>
                  </div>
                  <div>Downloads: <span className="text-gray-700 font-semibold">{(app.downloadCount || 0).toLocaleString()}</span></div>
                  <div>Size: <span className="text-gray-700 font-semibold">{app.size || 'Unknown'}</span></div>
                </div>
                <p className="text-gray-600 text-sm font-light max-w-xl leading-relaxed">
                  {app.shortDescription || app.description}
                </p>
              </div>
            </div>

            {/* Download Action Box */}
            <div className="w-full md:w-auto shrink-0 flex flex-col items-center justify-center p-6 bg-gray-50 border border-slate-200 rounded-2xl gap-3">
              <button
                onClick={() => triggerDownload(app)}
                disabled={downloading}
                className={`flex items-center justify-center space-x-3 w-full md:w-56 text-center text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-[0_4px_14px_rgba(249,115,22,0.25)] py-4 rounded-xl transition-all duration-300 ${
                  downloading ? 'animate-pulse pointer-events-none opacity-80' : ''
                }`}
              >
                <Download className="h-5 w-5" />
                <span>{downloading ? 'Preparing APK...' : 'Download APK'}</span>
              </button>
              <div className="text-[10px] text-gray-500 tracking-wide text-center">
                Secure & verified version: v{app.version}
              </div>
            </div>

          </div>
        </section>

        {/* Screenshots Showcase */}
        {app.screenshots && app.screenshots.length > 0 && (
          <section className="mb-12 space-y-5 relative group/section select-none">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-[#0F172A] border-l-2 border-[#F97316] pl-2 flex items-center gap-2">
                <span>Interface Screenshots</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-light hidden sm:inline">
                  (Swipe/Drag to scroll • Click to expand)
                </span>
              </h2>
              {/* Scroll controller Chevrons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-gray-500 transition-all shadow-sm"
                  title="Scroll Left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-gray-500 transition-all shadow-sm"
                  title="Scroll Right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Google Play Store Inspired Slider */}
            <div className="relative">
              <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {app.screenshots.map((shot, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleScreenshotClick(idx)}
                    className="flex-shrink-0 snap-start rounded-2xl overflow-hidden border border-slate-200 hover:border-[#F97316]/60 transition-all duration-300 group/item relative bg-gray-50"
                  >
                    {/* Hover Glow & Overlay Icon */}
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                      <div className="p-3 rounded-full bg-white border border-[#F97316]/40 text-[#F97316] shadow-md transform scale-90 group-hover/item:scale-100 transition-transform duration-300">
                        <Maximize2 className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <img
                      src={shot}
                      alt={`${app.name} Screen ${idx + 1}`}
                      loading="lazy"
                      className="h-[260px] sm:h-[320px] md:h-[400px] w-auto object-contain pointer-events-none filter brightness-95 group-hover/item:brightness-100 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Details and Changelog Tabs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Headers */}
            <div className="flex border-b border-slate-200">
              {[
                { id: 'features', label: 'Features Catalog' },
                { id: 'description', label: 'Overview' },
                { id: 'changelog', label: 'Update History' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#F97316] text-[#F97316]'
                      : 'border-transparent text-gray-500 hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              
              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  {app.features && app.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <div className="p-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 mt-0.5">
                            <Check className="h-4.5 w-4.5 text-[#F97316]" />
                          </div>
                          <span className="text-gray-700 text-sm font-light leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No features registered for this version.</p>
                  )}
                </div>
              )}

              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-light">
                    {app.description || 'No detailed overview description provided.'}
                  </p>
                </div>
              )}

              {/* Changelog Tab */}
              {activeTab === 'changelog' && (
                <div className="space-y-6">
                  {app.changelog && app.changelog.length > 0 ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-4">Version</th>
                            <th className="p-4">Release Date</th>
                            <th className="p-4">Release Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-gray-700">
                          {app.changelog.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 font-bold text-[#F97316]">v{log.version}</td>
                              <td className="p-4 text-xs">{log.date || 'Unknown'}</td>
                              <td className="p-4 text-xs font-light leading-relaxed max-w-sm">{log.notes || 'Performance enhancements.'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No update logs recorded.</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Specifications */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-[#0F172A] font-bold text-sm tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Info className="h-4 w-4 text-[#F97316]" />
                <span>Specifications</span>
              </h3>
              
              <div className="space-y-4 text-xs">
                {[
                  { label: 'Published By', value: 'GoTop Technologies' },
                  { label: 'Platform Support', value: app.categorySlug === 'tools' || app.categorySlug === 'entertainment' ? 'Android / APK' : 'Universal Mobile' },
                  { label: 'Latest Release', value: app.changelog && app.changelog[0] ? app.changelog[0].date : 'Recently' },
                  { label: 'FileSize', value: app.size || 'Unknown' },
                  { label: 'Content Safety', value: 'Everyone (PEGI 3)' }
                ].map((spec, sIdx) => (
                  <div key={sIdx} className="flex justify-between border-b border-slate-150 pb-2">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="text-gray-800 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* Fullscreen Screenshot Lightbox Modal */}
      {fullscreenIndex !== null && app.screenshots && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          
          {/* Close button overlay */}
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-[#F97316] transition-all"
            title="Close Gallery"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Arrow overlay */}
          <button
            onClick={prevFullscreen}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-[#F97316] transition-all hidden sm:flex"
            title="Previous Screenshot"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Screenshot container */}
          <div className="max-h-[80vh] max-w-[85vw] flex flex-col items-center justify-center relative select-none">
            
            {/* Gesture swipe touch helpers on mobile */}
            <img
              src={app.screenshots[fullscreenIndex]}
              alt={`Fullscreen Screen ${fullscreenIndex + 1}`}
              className="max-h-[75vh] max-w-[80vw] object-contain rounded-2xl border border-[#F97316]/20 shadow-lg animate-fade-in"
            />
            
            {/* Index Counter */}
            <div className="mt-4 text-xs text-gray-500 font-mono tracking-wider">
              SCREENSHOT {fullscreenIndex + 1} OF {app.screenshots.length}
            </div>

            {/* Mobile Navigation controls */}
            <div className="flex sm:hidden items-center space-x-6 mt-4">
              <button
                onClick={prevFullscreen}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-300 hover:text-white"
              >
                Prev
              </button>
              <button
                onClick={nextFullscreen}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-300 hover:text-white"
              >
                Next
              </button>
            </div>

          </div>

          {/* Right Arrow overlay */}
          <button
            onClick={nextFullscreen}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-[#F97316] transition-all hidden sm:flex"
            title="Next Screenshot"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

        </div>
      )}

      </div>
  );
};

export default AppDetails;
