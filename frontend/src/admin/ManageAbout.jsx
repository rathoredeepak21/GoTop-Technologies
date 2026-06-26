import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Info, Save, CheckCircle2, ShieldAlert, Plus, Trash2, User, Milestone } from 'lucide-react';

const ManageAbout = () => {
  const { token } = useAuth();
  const { settings, updateSettings } = useSettings();

  // Local form states
  const [aboutJourneyHeading, setAboutJourneyHeading] = useState('');
  const [aboutJourneyP1, setAboutJourneyP1] = useState('');
  const [aboutJourneyP2, setAboutJourneyP2] = useState('');
  const [aboutJourneyQuote, setAboutJourneyQuote] = useState('');
  const [aboutJourneyImg, setAboutJourneyImg] = useState('');
  
  const [aboutMissionText, setAboutMissionText] = useState('');
  const [aboutVisionText, setAboutVisionText] = useState('');

  const [aboutRoadmapsDesc, setAboutRoadmapsDesc] = useState('');
  
  // JSON array states
  const [aboutLeadership, setAboutLeadership] = useState([]);
  const [aboutRoadmaps, setAboutRoadmaps] = useState([]);

  // Status banners
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  // Sync settings context to local state
  useEffect(() => {
    if (settings) {
      setAboutJourneyHeading(settings.aboutJourneyHeading || '');
      setAboutJourneyP1(settings.aboutJourneyP1 || '');
      setAboutJourneyP2(settings.aboutJourneyP2 || '');
      setAboutJourneyQuote(settings.aboutJourneyQuote || '');
      setAboutJourneyImg(settings.aboutJourneyImg || '');
      setAboutMissionText(settings.aboutMissionText || '');
      setAboutVisionText(settings.aboutVisionText || '');
      setAboutRoadmapsDesc(settings.aboutRoadmapsDesc || '');
      setAboutLeadership(settings.aboutLeadership || []);
      setAboutRoadmaps(settings.aboutRoadmaps || []);
    }
  }, [settings]);

  // Handle Leadership Team modifications
  const handleAddLeader = () => {
    setAboutLeadership([...aboutLeadership, { name: '', role: '', img: '' }]);
  };

  const handleLeaderChange = (index, field, value) => {
    const updated = [...aboutLeadership];
    updated[index] = { ...updated[index], [field]: value };
    setAboutLeadership(updated);
  };

  const handleRemoveLeader = (index) => {
    setAboutLeadership(aboutLeadership.filter((_, i) => i !== index));
  };

  // Handle Roadmap modifications
  const handleAddMilestone = () => {
    setAboutRoadmaps([...aboutRoadmaps, { year: '', title: '', desc: '' }]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...aboutRoadmaps];
    updated[index] = { ...updated[index], [field]: value };
    setAboutRoadmaps(updated);
  };

  const handleRemoveMilestone = (index) => {
    setAboutRoadmaps(aboutRoadmaps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    // Payload containing both branding and new about settings
    const payload = {
      ...settings, // Retain existing settings like companyName, logoUrl, socialLinks etc.
      aboutJourneyHeading,
      aboutJourneyP1,
      aboutJourneyP2,
      aboutJourneyQuote,
      aboutJourneyImg,
      aboutMissionText,
      aboutVisionText,
      aboutRoadmapsDesc,
      aboutLeadership,
      aboutRoadmaps
    };

    try {
      const res = await updateSettings(payload, token);
      if (res.success) {
        setStatus({ type: 'success', message: 'About Us page configurations successfully synchronized.' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Failed to update About page settings.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Network error updating configurations.' });
    } finally {
      setSaving(false);
      // Clear success banner after 4 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-[#0F172A]">Console About Us Settings</h1>
        <p className="text-gray-600 text-xs mt-1">Manage founding stories, mission declarations, executive profiles, and future roadmaps.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Status banner alerts */}
          {status.message && (
            <div className={`flex items-start space-x-2.5 p-4 rounded-xl border text-xs ${
              status.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" /> : <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />}
              <span className="font-semibold">{status.message}</span>
            </div>
          )}

          {/* SECTION 1: OUR JOURNEY */}
          <div className="space-y-4">
            <h3 className="text-[#0F172A] font-bold text-sm tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Info className="h-4.5 w-4.5 text-[#F97316]" />
              <span>1. Corporate Journey & Background</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Journey Heading */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Journey Section Title</label>
                <input
                  type="text"
                  required
                  value={aboutJourneyHeading}
                  onChange={(e) => setAboutJourneyHeading(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="Our Journey"
                />
              </div>

              {/* Journey Paragraph 1 */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Story Paragraph 1</label>
                <textarea
                  required
                  rows={4}
                  value={aboutJourneyP1}
                  onChange={(e) => setAboutJourneyP1(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="Founded in 2026..."
                />
              </div>

              {/* Journey Paragraph 2 */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Story Paragraph 2</label>
                <textarea
                  rows={4}
                  value={aboutJourneyP2}
                  onChange={(e) => setAboutJourneyP2(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="We set out to build an ecosystem..."
                />
              </div>

              {/* Quote */}
              <div className="space-y-1">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Journey Highlight Quote</label>
                <input
                  type="text"
                  value={aboutJourneyQuote}
                  onChange={(e) => setAboutJourneyQuote(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="We don't just build code; we model digital futures."
                />
              </div>

              {/* Journey image */}
              <div className="space-y-1">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Journey Section Image URL</label>
                <input
                  type="text"
                  value={aboutJourneyImg}
                  onChange={(e) => setAboutJourneyImg(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CORE PHILOSOPHY */}
          <div className="space-y-4 pt-4">
            <h3 className="text-[#0F172A] font-bold text-sm tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Info className="h-4.5 w-4.5 text-[#F97316]" />
              <span>2. Core Philosophy (Mission & Vision)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Mission Text */}
              <div className="space-y-1">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Mission Statement</label>
                <textarea
                  required
                  rows={4}
                  value={aboutMissionText}
                  onChange={(e) => setAboutMissionText(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="To engineer secure, resilient..."
                />
              </div>

              {/* Vision Text */}
              <div className="space-y-1">
                <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Vision Statement</label>
                <textarea
                  required
                  rows={4}
                  value={aboutVisionText}
                  onChange={(e) => setAboutVisionText(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                  placeholder="To establish a unified digital repository..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: LEADERSHIP TEAM */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[#0F172A] font-bold text-sm tracking-wider uppercase flex items-center space-x-2">
                <User className="h-4.5 w-4.5 text-[#F97316]" />
                <span>3. Executive Leadership Team</span>
              </h3>
              <button
                type="button"
                onClick={handleAddLeader}
                className="flex items-center space-x-1.5 text-xs font-bold text-[#F97316] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Leader</span>
              </button>
            </div>

            {aboutLeadership.length === 0 ? (
              <p className="text-gray-550 text-xs italic">No leaders configured. Add a leader above.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {aboutLeadership.map((leader, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/65 p-4 rounded-2xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveLeader(idx)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove Leader"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-[#F97316] font-bold">Leader #{idx + 1}</div>
                    
                    {/* Leader Name */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={leader.name}
                        onChange={(e) => handleLeaderChange(idx, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="Dr. Evelyn Cross"
                      />
                    </div>

                    {/* Leader Role */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Corporate Role</label>
                      <input
                        type="text"
                        required
                        value={leader.role}
                        onChange={(e) => handleLeaderChange(idx, 'role', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="Chief Executive Officer"
                      />
                    </div>

                    {/* Leader Image URL */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Profile Image URL</label>
                      <input
                        type="text"
                        required
                        value={leader.img}
                        onChange={(e) => handleLeaderChange(idx, 'img', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all font-mono"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: FUTURE ROADMAPS */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[#0F172A] font-bold text-sm tracking-wider uppercase flex items-center space-x-2">
                <Milestone className="h-4.5 w-4.5 text-[#F97316]" />
                <span>4. Roadmap Milestones</span>
              </h3>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center space-x-1.5 text-xs font-bold text-[#F97316] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Roadmap Section Description</label>
              <input
                type="text"
                required
                value={aboutRoadmapsDesc}
                onChange={(e) => setAboutRoadmapsDesc(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                placeholder="As we expand, GoTop Technologies is targeting..."
              />
            </div>

            {aboutRoadmaps.length === 0 ? (
              <p className="text-gray-550 text-xs italic">No roadmap milestones configured. Add a milestone above.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {aboutRoadmaps.map((goal, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/65 p-4 rounded-2xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove Milestone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-[#F97316] font-bold">Milestone #{idx + 1}</div>
                    
                    {/* Goal Year/Timeframe */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Timeframe (e.g. Q4 2026)</label>
                      <input
                        type="text"
                        required
                        value={goal.year}
                        onChange={(e) => handleMilestoneChange(idx, 'year', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all font-display"
                        placeholder="Q4 2026"
                      />
                    </div>

                    {/* Goal Title */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Milestone Title</label>
                      <input
                        type="text"
                        required
                        value={goal.title}
                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="AI Automation Hub"
                      />
                    </div>

                    {/* Goal Description */}
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Short Description</label>
                      <textarea
                        required
                        rows={3}
                        value={goal.desc}
                        onChange={(e) => handleMilestoneChange(idx, 'desc', e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-gray-400 shadow-sm transition-all"
                        placeholder="Deploying custom LLM adapters..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center space-x-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm px-6 py-3.5 rounded-xl transition-all"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{saving ? 'Synchronizing configurations...' : 'Commit Configurations'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManageAbout;
