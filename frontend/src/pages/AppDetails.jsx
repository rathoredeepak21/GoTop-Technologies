import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Download, Star, Calendar, Info, RefreshCw, ChevronRight, ChevronLeft, Check, Maximize2, X, ArrowLeft } from 'lucide-react';
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
  
  // Immersive 3D Carousel & Zoom drag states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOffsetX, setZoomOffsetX] = useState(0);
  const [zoomOffsetY, setZoomOffsetY] = useState(0);
  const [isDraggingZoom, setIsDraggingZoom] = useState(false);
  const [zoomDragStart, setZoomDragStart] = useState({ x: 0, y: 0 });
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDraggingScreenshot, setIsDraggingScreenshot] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const toggleZoom = (e) => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1);
      setZoomOffsetX(0);
      setZoomOffsetY(0);
    } else {
      setIsZoomed(true);
      setZoomScale(2.2);
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        setZoomOffsetX(-clickX * 1.2);
        setZoomOffsetY(-clickY * 1.2);
      }
    }
  };

  const handleDragStart = (clientX, clientY) => {
    if (isZoomed) {
      setIsDraggingZoom(true);
      setZoomDragStart({ x: clientX - zoomOffsetX, y: clientY - zoomOffsetY });
    } else {
      setIsDraggingScreenshot(true);
      setDragStartX(clientX);
      setDragOffsetX(0);
    }
  };

  const handleDragMove = (clientX, clientY) => {
    if (isZoomed && isDraggingZoom) {
      const offsetX = clientX - zoomDragStart.x;
      const offsetY = clientY - zoomDragStart.y;
      
      const maxPanX = window.innerWidth * 0.5;
      const maxPanY = window.innerHeight * 0.5;
      const clampedX = Math.min(Math.max(offsetX, -maxPanX), maxPanX);
      const clampedY = Math.min(Math.max(offsetY, -maxPanY), maxPanY);
      
      setZoomOffsetX(clampedX);
      setZoomOffsetY(clampedY);
    } else if (isDraggingScreenshot) {
      const diffX = clientX - dragStartX;
      setDragOffsetX(diffX);
    }
  };

  const handleDragEnd = () => {
    if (isDraggingZoom) {
      setIsDraggingZoom(false);
    }
    if (isDraggingScreenshot) {
      setIsDraggingScreenshot(false);
      const threshold = window.innerWidth * 0.1 || 100;
      if (dragOffsetX < -threshold) {
        nextFullscreen();
      } else if (dragOffsetX > threshold) {
        prevFullscreen();
      }
      setDragOffsetX(0);
    }
  };

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
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    setDragMoved(true);
  };

  const handleScreenshotClick = (idx) => {
    if (dragMoved) return;
    setFullscreenIndex(idx);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const prevFullscreen = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (app && app.screenshots) {
      setFullscreenIndex((prev) => (prev === 0 ? app.screenshots.length - 1 : prev - 1));
    }
  };

  const nextFullscreen = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (app && app.screenshots) {
      setFullscreenIndex((prev) => (prev === app.screenshots.length - 1 ? 0 : prev + 1));
    }
  };

  // Reset zoom state on screenshot index change
  useEffect(() => {
    setIsZoomed(false);
    setZoomScale(1);
    setZoomOffsetX(0);
    setZoomOffsetY(0);
    setDragOffsetX(0);
    setIsDraggingScreenshot(false);
    setIsDraggingZoom(false);
  }, [fullscreenIndex]);

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

  // Keyboard listener for screenshot fullscreen gallery navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenIndex === null) return;
      if (e.key === 'Escape') {
        setFullscreenIndex(null);
      } else if (e.key === 'ArrowLeft') {
        prevFullscreen(e);
      } else if (e.key === 'ArrowRight') {
        nextFullscreen(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenIndex, app]);

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
        <div 
          onClick={(e) => {
            // Only close if user clicked directly on background and wasn't dragging
            if (Math.abs(dragOffsetX) < 8) {
              setFullscreenIndex(null);
            }
          }}
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          className="fixed inset-0 bg-slate-950/98 z-50 flex flex-col justify-between py-4 select-none animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="App Screenshots Viewer"
        >
          {/* Cinematic Background Blur */}
          <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none select-none">
            <img
              key={`bg-${fullscreenIndex}`}
              src={app.screenshots[fullscreenIndex]}
              alt="Cinematic Background Blur"
              className="w-full h-full object-cover filter blur-[48px] brightness-[0.22] scale-[1.08] transition-all duration-700 ease-out animate-pulse-slow"
            />
          </div>

          {/* Header Controls Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between px-6 pb-4 border-b border-white/5 z-10 bg-slate-950/30 backdrop-blur-sm"
          >
            <button
              onClick={() => setFullscreenIndex(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold group py-2"
              aria-label="Back to details page"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            <div className="flex flex-col items-center text-center">
              <span className="text-white text-sm font-display font-extrabold tracking-wide">
                {app.name}
              </span>
              <span className="text-gray-400 text-[10px] font-mono mt-0.5">
                v{app.version}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Zoom Action Button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
                className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors text-xs font-semibold bg-white/5 border border-white/10 hover:border-[#F97316] px-2.5 py-1.5 rounded-xl shadow-md"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isZoomed ? "100%" : "Zoom"}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => setFullscreenIndex(null)}
                className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors text-sm py-2"
                title="Close (Esc)"
                aria-label="Close viewer"
              >
                <span className="text-[10px] hidden sm:inline text-gray-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-white/10">ESC</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Center Workspace (3D stacked coverflow layout) */}
          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden py-4 px-12"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
          >
            {/* Left Nav Arrow Button */}
            <button
              type="button"
              onClick={prevFullscreen}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-slate-900/60 border border-white/10 hover:border-[#F97316] hover:bg-slate-900 text-gray-300 hover:text-white transition-all shadow-md active:scale-95 z-20"
              title="Previous Screenshot (Left Arrow)"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Carousel Stack */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
              {app.screenshots.map((shot, idx) => {
                const len = app.screenshots.length;
                let diff = idx - fullscreenIndex;
                if (diff < -len / 2) diff += len;
                if (diff > len / 2) diff -= len;

                // Determine drag translation percentage
                const dragPercent = Math.min(Math.max(dragOffsetX / (window.innerWidth * 0.4 || 300), -1), 1);

                let style = {};
                
                if (isZoomed && diff === 0) {
                  // Zoomed panning state
                  style = {
                    transform: `translateX(${zoomOffsetX}px) translateY(${zoomOffsetY}px) scale(${zoomScale})`,
                    zIndex: 40,
                    opacity: 1,
                    cursor: isDraggingZoom ? 'grabbing' : 'zoom-out',
                    transition: isDraggingZoom ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  };
                } else {
                  // 3D coverflow transition values based on continuous float index
                  const position = diff - dragPercent;
                  
                  let translateX = position * 68; // side separation
                  let translateZ = -Math.abs(position) * 160; // 3D depth
                  let scale = 1 - Math.abs(position) * 0.16; // scale side items
                  let rotateY = position * -24; // Y rotation angle
                  let opacity = 1 - Math.abs(position) * 0.5; // fade side items
                  let zIndex = 30 - Math.abs(position) * 10;
                  
                  // Clamp bounds
                  opacity = Math.max(0, Math.min(1, opacity));
                  scale = Math.max(0.4, Math.min(1.2, scale));
                  
                  style = {
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: opacity,
                    zIndex: Math.round(zIndex),
                    transition: isDraggingScreenshot 
                      ? 'none' 
                      : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  };
                }

                return (
                  <img
                    key={idx}
                    src={shot}
                    alt={`Screenshot ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (diff === -1) {
                        prevFullscreen();
                      } else if (diff === 1) {
                        nextFullscreen();
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (diff === 0) toggleZoom(e);
                    }}
                    className={`absolute rounded-2xl border border-white/10 max-h-[58vh] md:max-h-[62vh] max-w-[70vw] md:max-w-[40vw] object-contain shadow-2xl pointer-events-auto select-none ${
                      diff === 0 
                        ? (isZoomed ? 'cursor-zoom-out shadow-black/80' : 'cursor-zoom-in shadow-black/60') 
                        : 'cursor-pointer hover:opacity-85'
                    }`}
                    style={{
                      ...style,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                );
              })}
            </div>

            {/* Right Nav Arrow Button */}
            <button
              type="button"
              onClick={nextFullscreen}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-slate-900/60 border border-white/10 hover:border-[#F97316] hover:bg-slate-900 text-gray-300 hover:text-white transition-all shadow-md active:scale-95 z-20"
              title="Next Screenshot (Right Arrow)"
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Footer Controls & Thumbnails Strip */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full flex flex-col items-center gap-3 pt-3 pb-2 border-t border-white/5 bg-slate-950/80 backdrop-blur-sm z-10"
          >
            {/* Screenshot Counter & Info */}
            <div className="flex flex-col items-center">
              <span className="text-gray-300 text-xs font-mono uppercase tracking-wider">
                Screenshot {fullscreenIndex + 1} of {app.screenshots.length}
              </span>
              
              {/* Double click helper */}
              <span className="text-gray-500 text-[9px] mt-0.5 hidden sm:inline">
                Double click or tap image to zoom • Drag to pan
              </span>

              {/* Animated Dots Indicator */}
              <div className="flex items-center space-x-1.5 mt-2">
                {app.screenshots.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFullscreenIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === fullscreenIndex ? 'w-4.5 bg-[#F97316]' : 'w-1.5 bg-white/25 hover:bg-white/40'
                    }`}
                    aria-label={`Go to screenshot ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center space-x-3 overflow-x-auto max-w-[90vw] pb-1 px-4 scrollbar-none">
              {app.screenshots.map((shot, idx) => (
                <button
                  key={idx}
                  onClick={() => setFullscreenIndex(idx)}
                  className={`w-14 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 bg-slate-900 shadow-md ${
                    idx === fullscreenIndex 
                      ? 'border-[#F97316] scale-105 shadow-[0_0_15px_rgba(249,115,22,0.45)]' 
                      : 'border-white/10 opacity-40 hover:opacity-100 hover:scale-102'
                  }`}
                  aria-label={`Select screenshot ${idx + 1}`}
                >
                  <img 
                    src={shot} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover pointer-events-none" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Hidden preloader for adjacent screenshots */}
          <div className="hidden pointer-events-none">
            <img src={app.screenshots[(fullscreenIndex - 1 + app.screenshots.length) % app.screenshots.length]} alt="preload-prev" />
            <img src={app.screenshots[(fullscreenIndex + 1) % app.screenshots.length]} alt="preload-next" />
          </div>
        </div>
      )}

      </div>
  );
};

export default AppDetails;
