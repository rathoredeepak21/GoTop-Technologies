import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, Download, Users, Bell, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { supabase } from '../config/supabase';
import { seedSupabaseDatabase } from '../utils/supabaseSeeder';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = async () => {
    try {
      // 1. Fetch apps
      const { data: appsData, error: appsError } = await supabase.from('apps').select('*, categories(name)');
      if (appsError) throw appsError;
      const appsList = [];
      let totalDownloads = 0;
      (appsData || []).forEach(row => {
        appsList.push({
          _id: row.id,
          name: row.app_name,
          category: row.categories?.name || 'Tools',
          version: row.version,
          downloadCount: row.download_count || 0,
          iconUrl: row.logo_url
        });
        totalDownloads += (row.download_count || 0);
      });

      // 2. Fetch categories count
      const { count: totalCategories, error: catsError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      if (catsError) throw catsError;

      // 3. Fetch announcements count
      const { count: totalAnnouncements, error: annsError } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true });
      if (annsError) throw annsError;

      // 4. Fetch analytics logs
      const { data: logsData, error: logsError } = await supabase.from('analytics_logs').select('*');
      if (logsError) throw logsError;

      const logsList = [];
      let totalVisits = 0;
      (logsData || []).forEach(row => {
        logsList.push({
          _id: row.id,
          eventType: row.event_type,
          ip: row.ip,
          appName: row.app_name,
          timestamp: row.timestamp
        });
        if (row.event_type === 'visit') {
          totalVisits++;
        }
      });

      // Sort logs by timestamp descending
      logsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Popular Apps (Top 4 based on downloadCount)
      const popularApps = [...appsList]
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, 4);

      // Recent Activity (Last 10)
      const recentActivity = logsList.slice(0, 10).map(event => {
        const timestampDate = event.timestamp ? new Date(event.timestamp) : new Date();
        const timeStr = timestampDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const dateStr = timestampDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        return {
          id: event._id,
          type: event.eventType,
          description: event.eventType === 'download'
            ? `Downloaded app "${event.appName || 'Unknown app'}"`
            : `New visitor from ${event.ip || 'Client-side'}`,
          time: `${dateStr} at ${timeStr}`
        };
      });

      // Monthly Traffic (Last 6 Months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyTraffic = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        const yearName = d.getFullYear().toString().substring(2);
        const label = `${monthName} ${yearName}`;

        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

        const count = logsList.filter(log => {
          if (log.eventType !== 'visit' || !log.timestamp) return false;
          const logDate = new Date(log.timestamp);
          return logDate >= startOfMonth && logDate <= endOfMonth;
        }).length;

        monthlyTraffic.push({
          label,
          visits: count
        });
      }

      setStats({
        metrics: {
          totalApps: appsList.length,
          totalDownloads,
          totalVisits,
          totalAnnouncements
        },
        popularApps,
        recentActivity,
        monthlyTraffic
      });
    } catch (error) {
      console.error('Error fetching dashboard stats from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeed = async () => {
    if (!window.confirm('This will seed default Apps, Categories, Announcements, and Analytics logs to Supabase. Proceed?')) return;
    setSeeding(true);
    const res = await seedSupabaseDatabase();
    setSeeding(false);
    if (res.success) {
      alert('Supabase database successfully seeded with mockup datasets!');
      fetchStats();
    } else {
      alert('Seeding failed: ' + res.error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-blue"></div>
        <span className="text-gray-400 text-sm">Aggregating telemetry datasets...</span>
      </div>
    );
  }

  const metrics = stats?.metrics || { totalApps: 0, totalDownloads: 0, totalVisits: 0, totalAnnouncements: 0 };
  const popularApps = stats?.popularApps || [];
  const recentActivity = stats?.recentActivity || [];
  const monthlyTraffic = stats?.monthlyTraffic || [];

  // SVG Chart Coordinates calculation
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  const points = monthlyTraffic.map((item, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (monthlyTraffic.length - 1);
    
    // Find max value for normalization
    const maxVisits = Math.max(...monthlyTraffic.map(t => t.visits), 1000);
    const y = chartHeight - padding - (item.visits * (chartHeight - padding * 2)) / maxVisits;
    
    return { x, y, label: item.label, visits: item.visits };
  });

  // Create path coordinates
  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Create shaded area coordinates underneath the line
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="space-y-10">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">System Dashboard</h1>
          <p className="text-gray-400 text-xs mt-1">Realtime overview of Nexvora Technologies telemetry indices.</p>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-space-dark px-4 py-2 border border-space-border/60 rounded-xl">
          CLUSTER STATS STATUS: ONLINE
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Apps', value: metrics.totalApps, icon: <Cpu className="h-5 w-5 text-neon-blue" />, note: 'App catalog total' },
          { label: 'Total Downloads', value: metrics.totalDownloads.toLocaleString(), icon: <Download className="h-5 w-5 text-neon-blue" />, note: 'Server package pulls' },
          { label: 'Website Analytics', value: metrics.totalVisits.toLocaleString(), icon: <Users className="h-5 w-5 text-neon-blue" />, note: 'Logged page traffic' },
          { label: 'Announcements', value: metrics.totalAnnouncements, icon: <Bell className="h-5 w-5 text-neon-blue" />, note: 'Active press bulletins' }
        ].map((m, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-space-border/40 relative overflow-hidden flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{m.label}</span>
                <div className="text-2xl md:text-3xl font-display font-extrabold text-white mt-1 text-neon-glow">
                  {m.value}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-neon-blue/15 border border-neon-blue/20">
                {m.icon}
              </div>
            </div>
            <div className="text-[10px] text-gray-500 border-t border-space-border/20 pt-2 font-mono">
              {m.note}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graph & Popular Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Custom SVG Line Chart widget (2/3 size) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-space-border/60 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-neon-blue" />
              <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider">Traffic Analysis</h3>
            </div>
            <span className="text-[10px] text-neon-blue font-semibold bg-neon-blue/10 px-2 py-0.5 rounded-full uppercase">
              Monthly Page Visits
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative pt-4 w-full">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Neon blue gradient for shaded area */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

              {/* Gradient Area path */}
              {areaD && <path d={areaD} fill="url(#chartGradient)" />}

              {/* Neon Stroke path */}
              {pathD && (
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#00d2ff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  className="filter drop-shadow-[0_0_4px_rgba(0,210,255,0.4)]"
                />
              )}

              {/* Data points dots */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    fill="#05070c" 
                    stroke="#00d2ff" 
                    strokeWidth="2" 
                  />
                  {/* Tooltip labels */}
                  <text 
                    x={p.x} 
                    y={p.y - 8} 
                    fill="#ffffff" 
                    fontSize="7" 
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono opacity-80"
                  >
                    {p.visits >= 1000 ? `${(p.visits / 1000).toFixed(0)}k` : p.visits}
                  </text>
                  {/* Bottom Labels */}
                  <text 
                    x={p.x} 
                    y={chartHeight - 4} 
                    fill="rgba(255,255,255,0.4)" 
                    fontSize="7.5" 
                    textAnchor="middle"
                    className="font-mono uppercase"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Popular Apps Listing (1/3 size) */}
        <div className="glass-panel p-6 rounded-3xl border border-space-border/60 space-y-4">
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="h-5 w-5 text-neon-blue" />
            <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider">Top Performing Apps</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            {popularApps.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 bg-space-dark/30 border border-space-border/30 rounded-xl hover:border-space-border transition-colors">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={app.iconUrl || '/logo.png'}
                    alt={app.name}
                    className="h-9 w-9 rounded-lg bg-space-dark p-1 border border-space-border shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-white text-xs font-bold font-display truncate">{app.name}</h4>
                    <span className="text-[9px] text-gray-500 uppercase font-medium">{app.category}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-neon-blue text-xs font-bold font-mono">{(app.downloadCount || 0).toLocaleString()}</div>
                  <span className="text-[8px] text-gray-500 uppercase tracking-wide">downloads</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Log */}
      <section className="glass-panel p-6 rounded-3xl border border-space-border/60 space-y-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-neon-blue" />
          <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider">Recent Activity Logs</h3>
        </div>
        
        <div className="relative border-l border-space-border/50 pl-6 space-y-5">
          {recentActivity.map((log) => (
            <div key={log.id} className="relative text-xs">
              {/* Timeline Indicator */}
              <span className={`absolute -left-[28.5px] top-1.5 h-1.5 w-1.5 rounded-full ${
                log.type === 'download' 
                  ? 'bg-neon-blue shadow-[0_0_4px_#00d2ff]' 
                  : 'bg-gray-500'
              }`} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-gray-300 font-light leading-relaxed">{log.description}</span>
                <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
