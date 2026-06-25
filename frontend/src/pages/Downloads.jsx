import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Search, RefreshCw, Star, Info } from 'lucide-react';
import { supabase } from '../config/supabase';

const Downloads = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchApps = async () => {
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*, categories(name)')
        .eq('active', true);

      if (error) throw error;

      if (data) {
        const list = data.map((app) => ({
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
          apkDownloadUrl: app.apk_download_url,
          active: app.active,
          size: app.size || '15 MB'
        }));
        setApps(list);
      }
    } catch (err) {
      console.error('Error loading download items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const triggerDownload = async (app) => {
    setDownloadingId(app._id);
    try {
      // 1. Post analytics download tracking event directly to Supabase
      await supabase.from('analytics_logs').insert({
        event_type: 'download',
        ip: 'Client-side',
        user_agent: navigator.userAgent,
        app_name: app.name,
        timestamp: new Date().toISOString()
      });

      // 2. Increment downloadCount in Supabase
      const newCount = (app.downloadCount || 0) + 1;
      const { error: updateErr } = await supabase
        .from('apps')
        .update({ download_count: newCount })
        .eq('id', app._id);

      if (updateErr) throw updateErr;
      
      setApps(prev => prev.map(a => a._id === app._id ? { ...a, downloadCount: newCount } : a));
      
      // 3. Redirect to external GitHub release URL
      const downloadUrl = app.apkDownloadUrl || '#';
      if (downloadUrl && downloadUrl !== '#') {
        window.location.href = downloadUrl;
      } else {
        alert('Download link is not configured for this application.');
      }
    } catch (err) {
      console.error('Failed to trigger download:', err);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 1000);
    }
  };

  // Filter apps by search query
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Background neon flares */}
      <div className="glow-circle-blue top-1/4 right-0" />
      <div className="glow-circle-indigo bottom-1/4 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[11px] font-semibold text-neon-blue uppercase tracking-[0.2em]">Resource Center</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Download Center</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Access secure, verified, and ad-free packages for all Nexvora applications and utility components.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          
          {/* Search Header control */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search download catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-space-dark/80 border border-space-border/60 hover:border-space-border focus:border-neon-blue focus:outline-none rounded-xl py-3.5 pl-10 pr-4 text-sm text-gray-100 transition-all placeholder-gray-500"
              />
              <Search className="absolute left-3.5 top-4 h-4 w-4 text-gray-500" />
            </div>
            
            <div className="text-xs text-gray-500">
              Showing {filteredApps.length} active application packages
            </div>
          </div>

          {/* Downloads Table */}
          {loading ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <RefreshCw className="h-6 w-6 text-neon-blue animate-spin mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Loading package manifest...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
              <Info className="h-10 w-10 text-gray-600 mx-auto" />
              <h3 className="text-white font-bold text-lg font-display">No Packages Found</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                No apps matched your keywords. Try searching for "Spin", "Saver", or specific categories.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-space-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-space-dark/85 text-gray-400 text-xs font-semibold uppercase border-b border-space-border/60 tracking-wider">
                    <tr>
                      <th className="p-5">Application</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Latest Version</th>
                      <th className="p-5">File Size</th>
                      <th className="p-5">Rating</th>
                      <th className="p-5">Downloads</th>
                      <th className="p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-space-border/40 text-gray-300">
                    {filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-space-dark/25 transition-colors">
                        
                        {/* Application Icon and Name */}
                        <td className="p-5">
                          <div className="flex items-center space-x-3">
                            <img
                              src={app.iconUrl || '/logo.png'}
                              alt={app.name}
                              className="h-10 w-10 rounded-lg object-contain bg-space-dark p-1.5 border border-space-border"
                            />
                            <div>
                              <Link to={`/apps/details/${app.slug}`} className="text-white font-bold hover:text-neon-blue transition-colors font-display">
                                {app.name}
                              </Link>
                              <div className="text-[10px] text-gray-500">v{app.version}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-5">
                          <span className="text-[11px] bg-neon-blue/10 text-neon-blue px-2.5 py-0.5 rounded-full font-medium">
                            {app.category}
                          </span>
                        </td>

                        {/* Version */}
                        <td className="p-5 text-gray-400 font-mono text-xs">v{app.version}</td>

                        {/* Size */}
                        <td className="p-5 text-gray-400">{app.size || 'Unknown'}</td>

                        {/* Rating */}
                        <td className="p-5">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-gray-300 font-semibold">{app.rating}</span>
                          </div>
                        </td>

                        {/* Download stats */}
                        <td className="p-5 text-gray-400 text-xs font-mono">{(app.downloadCount || 0).toLocaleString()}</td>

                        {/* Action download button */}
                        <td className="p-5 text-right">
                          <button
                            onClick={() => triggerDownload(app)}
                            disabled={downloadingId === app._id}
                            className={`inline-flex items-center space-x-2 text-xs font-bold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 hover:brightness-110 shadow-neon-glow px-4 py-2.5 rounded-lg transition-all ${
                              downloadingId === app._id ? 'animate-pulse pointer-events-none opacity-80' : ''
                            }`}
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>{downloadingId === app._id ? 'Downloading...' : 'Get APK'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Secure Download Guarantee Banner */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-neon-blue">
            <div className="space-y-1">
              <h3 className="text-white font-bold text-sm font-display">Security Verification Assured</h3>
              <p className="text-gray-400 text-xs font-light max-w-2xl leading-normal">
                Every application package listed in our Download Center is programmatically scanned for malware, telemetry trackers, and adware prior to publication. Nexvora guarantees 100% secure packages.
              </p>
            </div>
            <div className="text-[10px] text-gray-500 shrink-0 font-mono">
              GATEWAY CLUSTER: SECURE-SSL v1.2
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Downloads;
