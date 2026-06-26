import React, { useEffect, useState } from 'react';
import { Calendar, Tag, RefreshCw, X, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { supabase } from '../config/supabase';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAnn, setSelectedAnn] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const list = data.map((ann) => ({
          _id: ann.id,
          title: ann.title,
          content: ann.content,
          type: ann.type,
          active: ann.active,
          date: new Date(ann.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        }));
        setAnnouncements(list);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filter announcements
  const filtered = announcements.filter(ann => {
    if (activeFilter === 'All') return true;
    return ann.type === activeFilter;
  });

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Launch':
        return {
          bg: 'bg-green-500/10 text-green-600 border-green-500/20',
          dot: 'bg-green-500 shadow-sm',
          icon: <Play className="h-4 w-4" />
        };
      case 'Maintenance':
        return {
          bg: 'bg-red-500/10 text-red-600 border-red-500/20',
          dot: 'bg-red-500 shadow-sm',
          icon: <AlertTriangle className="h-4 w-4" />
        };
      default: // News
        return {
          bg: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
          dot: 'bg-[#F97316] shadow-sm',
          icon: <Tag className="h-4 w-4" />
        };
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Background ambient lighting */}
      <div className="glow-circle-blue top-1/4 left-0" />
      <div className="glow-circle-indigo bottom-1/4 right-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-[11px] font-semibold text-[#F97316] uppercase tracking-[0.2em]">Press & Logs</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#0F172A]">Announcements</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Keep track of latest product launches, system maintenance schedules, and brand news.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Filter Toggle Bar */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-12 bg-white border border-slate-200 p-1.5 rounded-xl max-w-md mx-auto shadow-sm">
          {['All', 'Launch', 'Maintenance', 'News'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeFilter === filter
                  ? 'bg-[#F97316] text-white font-bold shadow-sm'
                  : 'text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-6 w-6 text-[#F97316] animate-spin mx-auto mb-2" />
            <span className="text-gray-600 text-sm">Synchronizing timelines...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl text-gray-500 bg-white border border-slate-200 shadow-sm">
            No announcements logged under the category "{activeFilter}".
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8 space-y-12 max-w-3xl mx-auto">
            {filtered.map((ann) => {
              const styles = getTypeStyle(ann.type);
              return (
                <div key={ann._id} className="relative group">
                  
                  {/* Glowing Node Dot on the timeline border */}
                  <span className={`absolute -left-[31px] md:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-[#F8FAFC] ${styles.dot}`} />
                  
                  {/* Announcement Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-[#F97316]/30 bg-white border border-slate-200 shadow-sm transition-all duration-300">
                    
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles.bg}`}>
                        {styles.icon}
                        <span>{ann.type}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{ann.date || new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Content preview */}
                    <div className="space-y-2">
                      <h3 className="text-[#0F172A] font-bold text-lg md:text-xl font-display group-hover:text-[#F97316] transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-light">
                        {ann.content}
                      </p>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => setSelectedAnn(ann)}
                      className="text-xs font-semibold text-[#F97316] hover:underline flex items-center space-x-1"
                    >
                      <span>Read Full Details</span>
                      <span>→</span>
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Read More Modal */}
        {selectedAnn && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel max-w-2xl w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 relative space-y-6 shadow-xl">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedAnn(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0F172A] rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal header */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getTypeStyle(selectedAnn.type).bg}`}>
                    {getTypeStyle(selectedAnn.type).icon}
                    <span>{selectedAnn.type}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{selectedAnn.date}</span>
                </div>
                <h2 className="text-[#0F172A] font-extrabold text-2xl font-display leading-tight pr-8">
                  {selectedAnn.title}
                </h2>
              </div>

              {/* Modal content body */}
              <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light border-t border-slate-100 pt-4 max-h-[380px] overflow-y-auto pr-2">
                {selectedAnn.content}
              </div>

              {/* Footer info */}
              <div className="text-right text-[10px] text-gray-500 tracking-wider">
                PUBLISHED BY GOTOP PRESS CLUSTER
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Announcements;
