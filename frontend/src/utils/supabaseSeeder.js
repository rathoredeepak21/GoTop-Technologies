import { supabase } from '../config/supabase';

export const seedSupabaseDatabase = async () => {
  console.log('Starting client-side Supabase database seeding...');

  try {
    // 1. Seed global settings (Upsert)
    const { error: settingsErr } = await supabase.from('settings').upsert({
      id: 'global',
      company_name: 'NEXVORA TECHNOLOGIES',
      tagline: "Building Tomorrow's Technology",
      logo_url: '/logo.png',
      favicon_url: '/icon.png',
      theme: 'dark',
      footer_text: '© 2026 NEXVORA TECHNOLOGIES. Building Tomorrow\'s Technology. All rights reserved.',
      contact_email: 'support@nexvora.com',
      contact_phone: '+1 (555) 308-2510',
      address: 'Nexvora Tower, Floor 45, Tech Center, San Francisco, CA',
      social_links: {
        facebook: 'https://facebook.com/nexvora',
        twitter: 'https://twitter.com/nexvora',
        linkedin: 'https://linkedin.com/company/nexvora',
        github: 'https://github.com/nexvora',
        telegram: 'https://t.me/nexvora'
      },
      about_journey_heading: 'Our Journey',
      about_journey_p1: 'Founded in 2026, NEXVORA TECHNOLOGIES emerged from a small lab of developers dedicated to refining user experience. We noticed a common issue: beautiful applications often lacked engineering speed, while heavy industrial tools lacked responsive styling.',
      about_journey_p2: 'We set out to build an ecosystem that satisfies both requirements. By combining lightweight programming models with glassmorphism design layouts, Nexvora has become a trusted publisher of games, utilities, and productivity clients.',
      about_journey_quote: "We don't just build code; we model digital futures.",
      about_journey_img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
      about_mission_text: 'To engineer secure, resilient, and aesthetically stunning applications that solve daily user constraints. We prioritize code transparency, zero tracking, and performance speed across all operating systems.',
      about_vision_text: 'To establish a unified digital repository where users can download vetted, verified, and high-performance apps without worrying about adware, privacy tracking, or system bloat.',
      about_leadership: [
        { name: 'Dr. Evelyn Cross', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' },
        { name: 'Sylas Sterling', role: 'Head of Engineering', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
        { name: 'Aria Takahashi', role: 'Director of UX & Branding', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300' }
      ],
      about_roadmaps_desc: 'As we expand, NEXVORA TECHNOLOGIES is targeting three key technical milestones over the next 18 months.',
      about_roadmaps: [
        { year: 'Q4 2026', title: 'AI Automation Hub', desc: 'Deploying custom LLM adapters directly inside our client apps.' },
        { year: 'Q2 2027', title: 'Nexvora Cloud Sync', desc: 'Enabling encrypted synchronization of gamer profiles and files.' },
        { year: 'Q4 2027', title: 'Cross-Play Engine', desc: 'Porting our arcade library to smart TVs and browser clients.' }
      ]
    });

    if (settingsErr) throw new Error('Settings seeding failed: ' + settingsErr.message);
    console.log('Seeded settings.');

    // 2. Clear old categories and seed them
    // Note: Due to foreign key cascades, we should delete apps first, but for safety in seeder we just upsert or insert new ones.
    // Let's first clean existing rows for seeding freshness.
    await supabase.from('apps').delete().neq('app_name', '');
    await supabase.from('categories').delete().neq('name', '');
    await supabase.from('announcements').delete().neq('title', '');
    await supabase.from('analytics_logs').delete().neq('event_type', '');

    const categoriesData = [
      { name: 'Games', icon: 'Gamepad' },
      { name: 'Tools', icon: 'Wrench' },
      { name: 'Photography', icon: 'Camera' },
      { name: 'Entertainment', icon: 'Play' },
      { name: 'AI Tools', icon: 'Sparkles' }
    ];

    const { data: seededCats, error: catsErr } = await supabase
      .from('categories')
      .insert(categoriesData)
      .select();

    if (catsErr) throw new Error('Categories seeding failed: ' + catsErr.message);
    console.log('Seeded categories.');

    // Map category name to UUID
    const catMap = {};
    seededCats.forEach(c => {
      catMap[c.name] = c.id;
    });

    // 3. Seed apps
    const appsData = [
      {
        app_name: 'Earn Spin',
        slug: 'earn-spin',
        description: 'Earn Spin is a thrilling entertainment application where players can spin a virtual wheel to win tokens, compete on live global leaderboards, and complete daily scratch tasks. Features beautiful animations, micro-sound cues, and secure local user login integration.',
        short_description: 'Spin the wheel, score tokens, and win daily leaderboard rewards.',
        category_id: catMap['Entertainment'],
        version: '2.1.0',
        logo_url: '/logo.png',
        apk_download_url: 'https://github.com/nexvora/earn-spin/releases/download/v2.1.0/earn-spin-v2.1.0.apk',
        release_notes: 'Optimized leaderboard load speed by 40% and resolved scratch card reset bugs.',
        featured: true,
        trending: true,
        download_count: 458789,
        features: [
          'Interactive Spin Wheel with premium vector animations',
          'Daily Scratch Card mini-games for extra bonus points',
          'Realtime Global Leaderboard displaying top player metrics',
          'Fully offline-first profile cache with local device saving'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800',
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800'
        ],
        changelog: [
          { version: '2.1.0', date: 'May 15, 2026', notes: 'Optimized leaderboard load speed by 40% and resolved scratch card reset bugs.' },
          { version: '2.0.2', date: 'April 10, 2026', notes: 'Enhanced UI elements, added dark mode assets, and introduced audio feedback controls.' },
          { version: '1.0.0', date: 'January 05, 2026', notes: 'Initial production release.' }
        ],
        active: true
      },
      {
        app_name: 'Video Saver',
        slug: 'video-saver',
        description: 'Video Saver is a state-of-the-art download assistant enabling users to download, store, and stream high-definition videos from multiple public URL sources. Organizes downloaded media in a clean interface and supports picture-in-picture background viewing.',
        short_description: 'One-click high-definition video downloader and media vault.',
        category_id: catMap['Tools'],
        version: '1.3.0',
        logo_url: '/logo.png',
        apk_download_url: 'https://github.com/nexvora/video-saver/releases/download/v1.3.0/video-saver-v1.3.0.apk',
        release_notes: 'Added picture-in-picture mode support and fixed media vault security hooks.',
        featured: false,
        trending: true,
        download_count: 320456,
        features: [
          'Multi-threaded downloading supporting file splits',
          'Secure password-protected local vault for private videos',
          'Integrated background media player with aspect ratio lock',
          'Universal link scanner supporting major public video sharing platforms'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'
        ],
        changelog: [
          { version: '1.3.0', date: 'June 02, 2026', notes: 'Added picture-in-picture mode support and fixed media vault security hooks.' },
          { version: '1.0.0', date: 'March 14, 2026', notes: 'Initial public launch.' }
        ],
        active: true
      },
      {
        app_name: 'Photo Gallery',
        slug: 'photo-gallery',
        description: 'Photo Gallery is an ultra-fast, modern photography cataloging application. Employs on-device neural clusters to group pictures by scene type (Nature, Family, Documents) and offers rich adjustment filters for brightness, contrast, and color grade directly on the client.',
        short_description: 'Neural-grouped gallery layout with on-device photo filters.',
        category_id: catMap['Photography'],
        version: '1.0.8',
        logo_url: '/logo.png',
        apk_download_url: 'https://github.com/nexvora/photo-gallery/releases/download/v1.0.8/photo-gallery-v1.0.8.apk',
        release_notes: 'Upgraded photo compression ratio, leading to 3x faster cloud sharing.',
        featured: false,
        trending: false,
        download_count: 160234,
        features: [
          'Smart category grouping powered by local ML classification',
          'Rich photo adjuster toolkit (exposure, shadows, saturation, warmth)',
          'High-speed slideshow transitions using GPU-accelerated layouts',
          'Compressed export settings for social media messaging'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=800',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800'
        ],
        changelog: [
          { version: '1.0.8', date: 'June 20, 2026', notes: 'Upgraded photo compression ratio, leading to 3x faster cloud sharing.' },
          { version: '1.0.0', date: 'May 01, 2026', notes: 'Initial system release.' }
        ],
        active: true
      },
      {
        app_name: 'Game Zone',
        slug: 'game-zone',
        description: 'Game Zone is Nexvora\'s premium game hub containing a collection of single-player arcade games like Space Blaster, Tetris, Brick Breaker, and Sudoku. Allows users to track multi-game stats and achievements on a single synchronized gamer profile.',
        short_description: 'All-in-one classic arcade gaming vault and stats log.',
        category_id: catMap['Games'],
        version: '3.0.2',
        logo_url: '/logo.png',
        apk_download_url: 'https://github.com/nexvora/game-zone/releases/download/v3.0.2/game-zone-v3.0.2.apk',
        release_notes: 'Released the new "Space Blaster" game module and added full controller support.',
        featured: true,
        trending: false,
        download_count: 210123,
        features: [
          'Includes 4 full classic arcade games within a single lightweight bundle',
          'Shared customizable Gamer Profile with unlockable badge achievements',
          'Daily multiplayer score challenge matches with custom alerts',
          'Fully optimized for low-latency touch and physical Bluetooth controller input'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
          'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800'
        ],
        changelog: [
          { version: '3.0.2', date: 'June 18, 2026', notes: 'Released the new "Space Blaster" game module and added full controller support.' },
          { version: '2.0.0', date: 'April 22, 2026', notes: 'Added achievements engine and leaderboard integration.' },
          { version: '1.0.0', date: 'February 12, 2026', notes: 'Initial public launch.' }
        ],
        active: true
      }
    ];

    const { error: appsErr } = await supabase.from('apps').insert(appsData);
    if (appsErr) throw new Error('Apps seeding failed: ' + appsErr.message);
    console.log('Seeded apps.');

    // 4. Seed announcements
    const announcementsData = [
      {
        title: 'NEXVORA "Game Zone" version 3.0.2 is Now Live!',
        content: 'We are thrilled to announce the official release of "Game Zone" version 3.0.2! This release introduces our brand new classic game "Space Blaster" with full 60 FPS neon particle support and integrated Bluetooth controller bindings. Update now from the Download Center to start matching high scores!',
        type: 'Launch',
        active: true
      },
      {
        title: 'Scheduled API Gateway Upgrade & Maintenance',
        content: 'Please note that our Cloud download gateways will undergo a scheduled maintenance window on July 2nd, 2026, from 02:00 UTC to 04:00 UTC to upgrade internal bandwidth clusters. During this period, APK downloads might experience transient interruptions. All existing installed apps will continue to operate normally.',
        type: 'Maintenance',
        active: true
      },
      {
        title: 'Earn Spin Dashboard Analytics Optimization',
        content: 'We have deployed an incremental patch to our Earn Spin databases, improving dashboard page load speeds by 40%. This ensures live leaderboards and daily challenge tokens render instantly across all global locations.',
        type: 'News',
        active: true
      }
    ];

    const { error: annsErr } = await supabase.from('announcements').insert(announcementsData);
    if (annsErr) throw new Error('Announcements seeding failed: ' + annsErr.message);
    console.log('Seeded announcements.');

    // 5. Seed mock analytics logs for the dashboard graph
    const currentDate = new Date();
    const logsData = [];
    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(Math.random() * 20);
      const logDate = new Date(currentDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      logsData.push({
        event_type: Math.random() > 0.3 ? 'visit' : 'download',
        ip: `192.168.1.${Math.floor(Math.random() * 200 + 1)}`,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        app_name: Math.random() > 0.5 ? 'Earn Spin' : 'Video Saver',
        timestamp: logDate.toISOString()
      });
    }

    const { error: logsErr } = await supabase.from('analytics_logs').insert(logsData);
    if (logsErr) throw new Error('Analytics logs seeding failed: ' + logsErr.message);
    console.log('Seeded analytics logs.');

    return { success: true };
  } catch (error) {
    console.error('Supabase seeding failed:', error);
    return { success: false, error: error.message };
  }
};
