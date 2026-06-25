import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const SettingsContext = createContext();

const mapFromDb = (dbRow) => ({
  companyName: dbRow.company_name,
  tagline: dbRow.tagline,
  logoUrl: dbRow.logo_url,
  faviconUrl: dbRow.favicon_url,
  theme: dbRow.theme,
  footerText: dbRow.footer_text,
  contactEmail: dbRow.contact_email,
  contactPhone: dbRow.contact_phone,
  address: dbRow.address,
  socialLinks: dbRow.social_links || {},
  
  // About Page Settings
  aboutJourneyHeading: dbRow.about_journey_heading || 'Our Journey',
  aboutJourneyP1: dbRow.about_journey_p1 || '',
  aboutJourneyP2: dbRow.about_journey_p2 || '',
  aboutJourneyQuote: dbRow.about_journey_quote || '',
  aboutJourneyImg: dbRow.about_journey_img || '',
  aboutMissionText: dbRow.about_mission_text || '',
  aboutVisionText: dbRow.about_vision_text || '',
  aboutLeadership: dbRow.about_leadership || [],
  aboutRoadmapsDesc: dbRow.about_roadmaps_desc || '',
  aboutRoadmaps: dbRow.about_roadmaps || []
});

const mapToDb = (stateObj) => ({
  id: 'global',
  company_name: stateObj.companyName,
  tagline: stateObj.tagline,
  logo_url: stateObj.logoUrl,
  favicon_url: stateObj.faviconUrl,
  theme: stateObj.theme,
  footer_text: stateObj.footerText,
  contact_email: stateObj.contactEmail,
  contact_phone: stateObj.contactPhone,
  address: stateObj.address,
  social_links: stateObj.socialLinks,

  // About Page Settings
  about_journey_heading: stateObj.aboutJourneyHeading,
  about_journey_p1: stateObj.aboutJourneyP1,
  about_journey_p2: stateObj.aboutJourneyP2,
  about_journey_quote: stateObj.aboutJourneyQuote,
  about_journey_img: stateObj.aboutJourneyImg,
  about_mission_text: stateObj.aboutMissionText,
  about_vision_text: stateObj.aboutVisionText,
  about_leadership: stateObj.aboutLeadership,
  about_roadmaps_desc: stateObj.aboutRoadmapsDesc,
  about_roadmaps: stateObj.aboutRoadmaps
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    companyName: 'NEXVORA TECHNOLOGIES',
    tagline: "Building Tomorrow's Technology",
    logoUrl: '/logo.png',
    faviconUrl: '/icon.png',
    theme: 'dark',
    footerText: '© 2026 NEXVORA TECHNOLOGIES. All rights reserved.',
    contactEmail: 'support@nexvora.com',
    contactPhone: '+1 (555) 308-2510',
    address: 'Nexvora Tower, Floor 45, Tech Center, San Francisco, CA',
    socialLinks: {
      facebook: 'https://facebook.com/nexvora',
      twitter: 'https://twitter.com/nexvora',
      linkedin: 'https://linkedin.com/company/nexvora',
      github: 'https://github.com/nexvora',
      telegram: 'https://t.me/nexvora'
    },
    
    // About Page Settings Defaults
    aboutJourneyHeading: 'Our Journey',
    aboutJourneyP1: 'Founded in 2026, NEXVORA TECHNOLOGIES emerged from a small lab of developers dedicated to refining user experience. We noticed a common issue: beautiful applications often lacked engineering speed, while heavy industrial tools lacked responsive styling.',
    aboutJourneyP2: 'We set out to build an ecosystem that satisfies both requirements. By combining lightweight programming models with glassmorphism design layouts, Nexvora has become a trusted publisher of games, utilities, and productivity clients.',
    aboutJourneyQuote: "We don't just build code; we model digital futures.",
    aboutJourneyImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
    aboutMissionText: 'To engineer secure, resilient, and aesthetically stunning applications that solve daily user constraints. We prioritize code transparency, zero tracking, and performance speed across all operating systems.',
    aboutVisionText: 'To establish a unified digital repository where users can download vetted, verified, and high-performance apps without worrying about adware, privacy tracking, or system bloat.',
    aboutLeadership: [
      { name: 'Dr. Evelyn Cross', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' },
      { name: 'Sylas Sterling', role: 'Head of Engineering', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
      { name: 'Aria Takahashi', role: 'Director of UX & Branding', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300' }
    ],
    aboutRoadmapsDesc: 'As we expand, NEXVORA TECHNOLOGIES is targeting three key technical milestones over the next 18 months.',
    aboutRoadmaps: [
      { year: 'Q4 2026', title: 'AI Automation Hub', desc: 'Deploying custom LLM adapters directly inside our client apps.' },
      { year: 'Q2 2027', title: 'Nexvora Cloud Sync', desc: 'Enabling encrypted synchronization of gamer profiles and files.' },
      { year: 'Q4 2027', title: 'Cross-Play Engine', desc: 'Porting our arcade library to smart TVs and browser clients.' }
    ]
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (data) {
        setSettings(mapFromDb(data));
      } else {
        // Self-heal: Write default branding parameters if missing in database
        await supabase.from('settings').upsert(mapToDb(settings));
      }
    } catch (error) {
      console.error('Supabase settings loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(mapToDb(newSettings));

      if (error) throw error;
      setSettings(newSettings);
      return { success: true };
    } catch (error) {
      console.error('Supabase settings save error:', error);
      return { success: false, message: 'Database writing failed: ' + error.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
