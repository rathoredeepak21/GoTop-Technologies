import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Download, Star, RefreshCw, Layers } from 'lucide-react';
import { supabase } from '../config/supabase';

const ManageApps = () => {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentAppId, setCurrentAppId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [version, setVersion] = useState('');
  const [size, setSize] = useState('');
  const [rating, setRating] = useState('5.0');
  const [featuresText, setFeaturesText] = useState(''); // Textarea, line-separated
  const [active, setActive] = useState(true);
  const [changelogNotes, setChangelogNotes] = useState('');
  
  // GitHub Releases and Notes
  const [apkDownloadUrl, setApkDownloadUrl] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');

  // Form files
  const [iconFile, setIconFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  // Existing asset URLs in edit mode
  const [existingIconUrl, setExistingIconUrl] = useState('');
  const [existingScreenshots, setExistingScreenshots] = useState([]);
  const [existingChangelog, setExistingChangelog] = useState([]);
  const [existingDownloadCount, setExistingDownloadCount] = useState(0);

  // Upload progress indicators
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Helper function to upload file to Supabase Storage Buckets
  const uploadFilePromise = (file, bucketName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(uniqueName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Retrieve public url
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniqueName);

        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: appsData, error: appsError } = await supabase
        .from('apps')
        .select('*, categories(name)');
      if (appsError) throw appsError;

      const list = (appsData || []).map(row => ({
        _id: row.id,
        name: row.app_name,
        slug: row.slug,
        description: row.description,
        shortDescription: row.short_description,
        category: row.categories?.name || 'Tools',
        categoryId: row.category_id,
        version: row.version,
        logoUrl: row.logo_url,
        apkDownloadUrl: row.apk_download_url,
        releaseNotes: row.release_notes,
        featured: row.featured,
        trending: row.trending,
        downloadCount: row.download_count || 0,
        changelog: row.changelog || [],
        screenshots: row.screenshots || [],
        features: row.features || [],
        active: row.active,
        size: row.size || ''
      }));
      setApps(list);

      const { data: catsData, error: catsError } = await supabase.from('categories').select('*');
      if (catsError) throw catsError;

      const catsList = (catsData || []).map(c => ({
        _id: c.id,
        name: c.name,
        icon: c.icon
      }));
      setCategories(catsList);

      if (catsList.length > 0 && !category) {
        setCategory(catsList[0].name);
      }
    } catch (err) {
      console.error('Error fetching admin app resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setCurrentAppId(null);
    setName('');
    setDescription('');
    setShortDescription('');
    if (categories.length > 0) setCategory(categories[0].name);
    setVersion('1.0.0');
    setSize('15 MB');
    setRating('5.0');
    setFeaturesText('');
    setActive(true);
    setChangelogNotes('');
    setApkDownloadUrl('');
    setReleaseNotes('');
    setIconFile(null);
    setScreenshotFiles([]);
    setExistingIconUrl('');
    setExistingScreenshots([]);
    setExistingChangelog([]);
    setExistingDownloadCount(0);
    setShowModal(true);
  };

  const openEditModal = (app) => {
    setModalType('edit');
    setCurrentAppId(app._id);
    setName(app.name);
    setDescription(app.description || '');
    setShortDescription(app.shortDescription || '');
    setCategory(app.category);
    setVersion(app.version);
    setSize(app.size || '');
    setRating(app.rating?.toString() || '5.0');
    setFeaturesText(app.features ? app.features.join('\n') : '');
    setActive(app.active);
    setChangelogNotes('');
    setApkDownloadUrl(app.apkDownloadUrl || '');
    setReleaseNotes(app.releaseNotes || '');
    setIconFile(null);
    setScreenshotFiles([]);
    
    // Store existing assets
    setExistingIconUrl(app.logoUrl || '');
    setExistingScreenshots(app.screenshots || []);
    setExistingChangelog(app.changelog || []);
    setExistingDownloadCount(app.downloadCount || 0);
    
    setShowModal(true);
  };

  const handleIconChange = (e) => setIconFile(e.target.files[0]);
  const handleScreenshotsChange = (e) => setScreenshotFiles(Array.from(e.target.files));

  const handleDelete = async (id, appName) => {
    if (!window.confirm(`Are you absolutely sure you want to delete application "${appName}"?`)) return;

    try {
      const { error } = await supabase.from('apps').delete().eq('id', id);
      if (error) throw error;
      setApps(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting application: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !version) {
      alert('Please fill in Name, Category, and Version.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Preparing assets...');

    try {
      // Find category ID
      const selectedCatObj = categories.find(c => c.name === category);
      const categoryId = selectedCatObj ? selectedCatObj._id : null;

      // 1. Upload App logo if provided
      let finalIconUrl = existingIconUrl || '/logo.png';
      if (iconFile) {
        setUploadStatus('Uploading App Logo...');
        finalIconUrl = await uploadFilePromise(iconFile, 'app-logos');
      }

      // 2. Upload screenshots if provided
      let finalScreenshots = existingScreenshots;
      if (screenshotFiles.length > 0) {
        setUploadStatus(`Uploading screenshots (0/${screenshotFiles.length})...`);
        const urls = [];
        for (let i = 0; i < screenshotFiles.length; i++) {
          setUploadStatus(`Uploading screenshot ${i + 1} of ${screenshotFiles.length}...`);
          const url = await uploadFilePromise(screenshotFiles[i], 'screenshots');
          urls.push(url);
        }
        finalScreenshots = urls;
      }

      // 3. Update or construct changelogs
      let finalChangelog = [...existingChangelog];
      const currentDateStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      if (modalType === 'edit') {
        if (changelogNotes) {
          finalChangelog.unshift({
            version,
            date: currentDateStr,
            notes: changelogNotes
          });
        }
      } else {
        finalChangelog = [{
          version,
          date: currentDateStr,
          notes: releaseNotes || 'Initial production release.'
        }];
      }

      const appSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // 4. Construct payload
      const appData = {
        app_name: name,
        slug: appSlug,
        description,
        short_description: shortDescription,
        category_id: categoryId,
        version,
        size,
        rating: parseFloat(rating) || 5.0,
        features: featuresText.split('\n').map(f => f.trim()).filter(Boolean),
        logo_url: finalIconUrl,
        screenshots: finalScreenshots,
        changelog: finalChangelog,
        apk_download_url: apkDownloadUrl,
        release_notes: releaseNotes,
        active,
        download_count: modalType === 'add' ? 0 : existingDownloadCount
      };

      // 5. Write to Supabase table
      if (modalType === 'add') {
        const { error } = await supabase.from('apps').insert(appData);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('apps').update(appData).eq('id', currentAppId);
        if (error) throw error;
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        alert('An application with this name already exists. Please choose a unique name.');
      } else {
        alert('Error saving application: ' + err.message);
      }
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };


  return (
    <div className="space-y-6">
      
      {/* Title & Actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-[#0F172A]">Application Vault</h1>
          <p className="text-gray-600 text-xs mt-1">Publish, update, and manage versions of GoTop applications.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm px-5 py-3 rounded-xl transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Applications Table list */}
      {loading && apps.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="h-6 w-6 text-[#F97316] animate-spin mx-auto mb-2" />
          <span className="text-gray-600 text-sm">Synchronizing app inventory...</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-gray-500 bg-white border border-slate-200 shadow-sm">
          No applications registered in catalog. Click "Add Application" above to begin.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#F8FAFC] text-slate-500 text-xs font-semibold uppercase border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="p-5">App Details</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Version</th>
                  <th className="p-5">Size</th>
                  <th className="p-5">Downloads</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {apps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Icon and Name details */}
                    <td className="p-5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={app.iconUrl || '/logo.png'}
                          alt={app.name}
                          className="h-10 w-10 rounded-lg object-contain bg-slate-50 p-1 border border-slate-200"
                        />
                        <div>
                          <span className="text-[#0F172A] font-bold font-display block">{app.name}</span>
                          <span className="text-[10px] text-gray-500 tracking-wide font-mono">v{app.version}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-5">
                      <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                        {app.category}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="p-5 font-mono text-xs text-slate-600">v{app.version}</td>

                    {/* Size */}
                    <td className="p-5 text-slate-600">{app.size || 'N/A'}</td>

                    {/* Downloads */}
                    <td className="p-5 font-mono text-xs text-[#F97316] font-semibold">{(app.downloadCount || 0).toLocaleString()}</td>

                    {/* Status Toggle */}
                    <td className="p-5">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        app.active 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {app.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions buttons */}
                    <td className="p-5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-2 text-gray-500 hover:text-[#F97316] hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Edit Application"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id, app.name)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-55/10 rounded-lg transition-colors inline-block"
                        title="Delete Application"
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
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Exit */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <h2 className="text-[#0F172A] font-extrabold text-2xl font-display tracking-tight border-b border-slate-100 pb-3">
              {modalType === 'add' ? 'Publish Application' : 'Configure Application'}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Application Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="Earn Spin"
                  />
                </div>

                {/* Category selector */}
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 cursor-pointer shadow-sm transition-all"
                  >
                    {categories.length === 0 ? (
                      <option value="" disabled className="bg-white text-slate-800">No categories available (Please seed database)</option>
                    ) : (
                      <>
                        <option value="" disabled className="bg-white text-slate-800">Select a Category</option>
                        {categories.map(c => (
                          <option key={c._id} value={c.name} className="bg-white text-slate-800">{c.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Short Tagline Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="One-line summary for app vault lists."
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Detailed Description Overview</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all resize-none"
                  placeholder="Complete product details..."
                />
              </div>

              {/* Version & Size & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Version String</label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all font-mono"
                    placeholder="1.0.0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">File Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="12.4 MB"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rating Value</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="5.0"
                  />
                </div>
              </div>

              {/* Features line by line */}
              <div className="space-y-1">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Features Listing (one per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all font-sans"
                  placeholder="Interactive Spin Wheel&#10;Leaderboard scoreboards&#10;Daily Scratch Tasks"
                />
              </div>

              {/* If edit mode: changelog notes */}
              {modalType === 'edit' && (
                <div className="space-y-1 p-3.5 bg-orange-50 border border-orange-100 rounded-xl">
                  <label className="text-[#F97316] text-xs font-semibold uppercase tracking-wider">Changelog Release Notes</label>
                  <input
                    type="text"
                    value={changelogNotes}
                    onChange={(e) => setChangelogNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all mt-1"
                    placeholder="E.g., Added picture-in-picture support."
                  />
                  <div className="text-[10px] text-gray-500 mt-1">
                    Required only if raising Version above. It records changes in the update logs.
                  </div>
                </div>
              )}

              {/* GitHub Release URL & Release Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">GitHub Release APK URL</label>
                  <input
                    type="url"
                    required
                    value={apkDownloadUrl}
                    onChange={(e) => setApkDownloadUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="https://github.com/org/repo/releases/download/v1.0.0/app.apk"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Release Notes (This Version)</label>
                  <input
                    type="text"
                    value={releaseNotes}
                    onChange={(e) => setReleaseNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="E.g., Minor fixes and performance updates."
                  />
                </div>
              </div>

              {/* File Upload fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Icon File */}
                <div className="space-y-2">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">App Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                  />
                </div>

                {/* Screenshots */}
                <div className="space-y-2">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Screenshots (max 6)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotsChange}
                    className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                  />
                </div>
              </div>

              {/* Settings Toggle Options */}
              <div className="flex items-center space-x-6 border-t border-slate-100 pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4.5 w-4.5 accent-[#F97316] rounded cursor-pointer"
                  />
                  <label htmlFor="active" className="text-slate-700 text-xs font-bold uppercase cursor-pointer select-none">
                    Active Catalog listing
                  </label>
                </div>
              </div>

              {/* Upload Status Indicator */}
              {isUploading && (
                <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-orange-50 border border-orange-100 text-xs text-[#F97316] font-semibold animate-pulse text-center">
                  <span>{uploadStatus}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full text-center text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm py-3.5 rounded-xl transition-all disabled:opacity-50"
              >
                {isUploading ? 'Synchronizing Cloud Assets...' : (modalType === 'add' ? 'Publish Application' : 'Save Configurations')}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageApps;
