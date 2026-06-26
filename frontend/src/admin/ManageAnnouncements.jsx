import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, Megaphone } from 'lucide-react';
import { supabase } from '../config/supabase';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('News');
  const [active, setActive] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('announcements').select('*');
      if (error) throw error;
      if (data) {
        const list = data.map((ann) => ({
          _id: ann.id,
          title: ann.title,
          content: ann.content,
          type: ann.type || 'News',
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
      console.error('Error fetching admin announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setCurrentId(null);
    setTitle('');
    setContent('');
    setType('News');
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (ann) => {
    setModalType('edit');
    setCurrentId(ann._id);
    setTitle(ann.title);
    setContent(ann.content);
    setType(ann.type || 'News');
    setActive(ann.active);
    setShowModal(true);
  };

  const handleDelete = async (id, annTitle) => {
    if (!window.confirm(`Are you sure you want to delete announcement "${annTitle}"?`)) return;

    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      setAnnouncements(prev => prev.filter(ann => ann._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting announcement: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      if (modalType === 'add') {
        const { error } = await supabase.from('announcements').insert({
          title,
          content,
          type,
          active
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .update({ title, content, type, active })
          .eq('id', currentId);
        if (error) throw error;
      }

      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Error saving announcement: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-[#0F172A]">Press Announcements</h1>
          <p className="text-gray-600 text-xs mt-1">Publish, update, and manage notifications, launches, and news logs.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm px-5 py-3 rounded-xl transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements table */}
      {loading && announcements.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="h-6 w-6 text-[#F97316] animate-spin mx-auto mb-2" />
          <span className="text-gray-600 text-sm">Loading press feeds...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-gray-500 bg-white border border-slate-200 shadow-sm">
          No announcements found. Click "Post Announcement" to publish your first update.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-5">Announcement Title</th>
                <th className="p-5">Category Type</th>
                <th className="p-5">Publish Date</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-gray-700">
              {announcements.map((ann) => (
                <tr key={ann._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Title */}
                  <td className="p-5 font-bold text-[#0F172A] flex items-center space-x-3">
                    <Megaphone className="h-4.5 w-4.5 text-[#F97316] shrink-0" />
                    <span className="truncate max-w-[280px]">{ann.title}</span>
                  </td>

                  {/* Type */}
                  <td className="p-5">
                    <span className={`text-[10px] font-bold uppercase border tracking-wider px-2 py-0.5 rounded-full ${
                      ann.type === 'Launch' 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : ann.type === 'Maintenance' 
                        ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                        : 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20'
                    }`}>
                      {ann.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-5 text-xs text-gray-500">{ann.date || new Date(ann.createdAt).toLocaleDateString()}</td>

                  {/* Status */}
                  <td className="p-5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      ann.active 
                        ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                      {ann.active ? 'Visible' : 'Hidden'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(ann)}
                      className="p-2 text-gray-500 hover:text-[#F97316] hover:bg-gray-100 rounded-lg transition-colors inline-block"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id, ann.title)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full rounded-2xl bg-white border border-slate-200 p-6 md:p-8 relative space-y-6 shadow-xl">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0F172A] rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-[#0F172A] font-extrabold text-xl font-display uppercase border-b border-slate-100 pb-3">
              {modalType === 'add' ? 'Publish Announcement' : 'Edit Announcement'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="New Game Blaster Launched"
                  />
                </div>

                {/* Type Selection */}
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Category Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3.5 px-4 text-sm text-gray-800 shadow-sm transition-all"
                  >
                    <option value="News">News</option>
                    <option value="Launch">Launch</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Content body */}
              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Content Body Details</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all resize-none font-light leading-relaxed"
                  placeholder="Complete announcement text..."
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-2 border-t border-slate-100 pt-4 pb-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4.5 w-4.5 accent-[#F97316] rounded cursor-pointer"
                />
                <label htmlFor="active" className="text-gray-700 text-xs font-bold uppercase cursor-pointer select-none">
                  Display announcement publicly
                </label>
              </div>

              <button
                type="submit"
                className="w-full text-center text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm py-3.5 rounded-xl transition-all"
              >
                Publish Announcement
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageAnnouncements;
