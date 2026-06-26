import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, Folder } from 'lucide-react';
import { supabase } from '../config/supabase';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      if (data) {
        const list = data.map((c) => ({
          _id: c.id,
          name: c.name,
          description: c.description || '',
          slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
        setCategories(list);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setCurrentId(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setModalType('edit');
    setCurrentId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setShowModal(true);
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"? This will not delete apps under it, but may disrupt filtering.`)) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error removing category: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      if (modalType === 'add') {
        const { error } = await supabase.from('categories').insert({
          name,
          icon: 'Folder',
          description
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .update({ name, description })
          .eq('id', currentId);
        if (error) throw error;
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        alert('A category with this name already exists. Please choose a unique name.');
      } else {
        alert('Error saving category: ' + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-[#0F172A]">Categories Management</h1>
          <p className="text-gray-600 text-xs mt-1">Configure categories to classify application downloads.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm px-5 py-3 rounded-xl transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid Categories */}
      {loading && categories.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="h-6 w-6 text-[#F97316] animate-spin mx-auto mb-2" />
          <span className="text-gray-600 text-sm">Loading category nodes...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-gray-500 bg-white border border-slate-200 shadow-sm">
          No categories found. Click "Add Category" to initialize.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="p-5">Category Name</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Description</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-gray-700">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-[#0F172A] flex items-center space-x-2.5">
                      <Folder className="h-4.5 w-4.5 text-[#F97316]" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-5 font-mono text-xs text-gray-500">{cat.slug}</td>
                    <td className="p-5 text-xs text-gray-600 max-w-sm leading-relaxed">{cat.description || 'No description provided.'}</td>
                    <td className="p-5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-gray-500 hover:text-[#F97316] hover:bg-gray-100 rounded-lg transition-colors inline-block"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="p-2 text-gray-550 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl bg-white border border-slate-200 p-6 md:p-8 relative space-y-6 shadow-xl">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0F172A] rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-[#0F172A] font-extrabold text-xl font-display uppercase border-b border-slate-100 pb-3">
              {modalType === 'add' ? 'Create Category' : 'Edit Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="AI Tools"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all resize-none"
                  placeholder="Category scope description..."
                />
              </div>

              <button
                type="submit"
                className="w-full text-center text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm py-3.5 rounded-xl transition-all"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCategories;
