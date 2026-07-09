-- =========================================================================
-- GOTOP TECHNOLOGIES - SUPABASE DATABASE SCHEMA SETUP
-- Run this script in the Supabase SQL Editor of your new project.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. CLEANUP / DROP EXISTING TABLES (If any exist)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS public.analytics_logs CASCADE;
DROP TABLE IF EXISTS public.contact_tickets CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- -------------------------------------------------------------------------
-- 2. CREATE DATABASE TABLES
-- -------------------------------------------------------------------------

-- A. settings (Singleton table for global configuration & about page)
CREATE TABLE public.settings (
    id text PRIMARY KEY DEFAULT 'global',
    company_name text NOT NULL DEFAULT 'GoTop Technologies',
    tagline text NOT NULL DEFAULT 'Technology That Takes You to the Top',
    logo_url text DEFAULT '/logo.png',
    favicon_url text DEFAULT '/icon.png',
    theme text DEFAULT 'light',
    footer_text text DEFAULT '© 2026 GoTop Technologies. All rights reserved.',
    contact_email text DEFAULT 'support@gotoptech.com',
    contact_phone text DEFAULT '+1 (555) 867-5309',
    address text DEFAULT 'GoTop Headquarters, Floor 88, Innovation Way, Seattle, WA',
    social_links jsonb DEFAULT '{"facebook": "", "twitter": "", "linkedin": "", "github": "", "telegram": ""}'::jsonb,
    about_journey_heading text DEFAULT 'Our Journey',
    about_journey_p1 text DEFAULT '',
    about_journey_p2 text DEFAULT '',
    about_journey_quote text DEFAULT '',
    about_journey_img text DEFAULT '',
    about_mission_text text DEFAULT '',
    about_vision_text text DEFAULT '',
    about_leadership jsonb DEFAULT '[]'::jsonb,
    about_roadmaps_desc text DEFAULT '',
    about_roadmaps jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT singleton_row CHECK (id = 'global')
);

-- B. categories
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    icon text NOT NULL DEFAULT 'Folder',
    description text,
    created_at timestamptz DEFAULT now()
);

-- C. apps
CREATE TABLE public.apps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    app_name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    short_description text,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    version text NOT NULL DEFAULT '1.0.0',
    apk_size text DEFAULT '15 MB',
    rating numeric DEFAULT 5.0,
    logo_url text DEFAULT '/logo.png',
    apk_download_url text,
    release_notes text,
    featured boolean DEFAULT false,
    trending boolean DEFAULT false,
    download_count integer DEFAULT 0,
    features jsonb DEFAULT '[]'::jsonb,
    screenshots jsonb DEFAULT '[]'::jsonb,
    changelog jsonb DEFAULT '[]'::jsonb,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- D. announcements
CREATE TABLE public.announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    type text DEFAULT 'News',
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- E. contact_tickets
CREATE TABLE public.contact_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    subject text DEFAULT 'No Subject',
    message text NOT NULL,
    status text DEFAULT 'open',
    created_at timestamptz DEFAULT now()
);

-- F. analytics_logs
CREATE TABLE public.analytics_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    ip text DEFAULT 'Client-side',
    user_agent text,
    app_name text,
    timestamp timestamptz DEFAULT now()
);

-- G. admins
CREATE TABLE public.admins (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    email text UNIQUE NOT NULL,
    role text DEFAULT 'admin',
    created_at timestamptz DEFAULT now()
);

-- -------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------------
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- 4. DEFINE RLS POLICIES FOR DATABASE TABLES
-- -------------------------------------------------------------------------

-- A. settings policies
CREATE POLICY "Allow public read access to settings" 
ON public.settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to write settings" 
ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- B. categories policies
CREATE POLICY "Allow public read access to categories" 
ON public.categories FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to write categories" 
ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- C. apps policies
CREATE POLICY "Allow public read access to active apps" 
ON public.apps FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to write apps" 
ON public.apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update of download_count"
ON public.apps FOR UPDATE TO public 
USING (true)
WITH CHECK (true);

-- D. announcements policies
CREATE POLICY "Allow public read access to announcements" 
ON public.announcements FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to write announcements" 
ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- E. contact_tickets policies
CREATE POLICY "Allow public insert contact tickets" 
ON public.contact_tickets FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage contact tickets" 
ON public.contact_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- F. analytics_logs policies
CREATE POLICY "Allow public insert analytics logs" 
ON public.analytics_logs FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated users to select/manage analytics logs" 
ON public.analytics_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- G. admins policies
CREATE POLICY "Allow authenticated users to manage admins" 
ON public.admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 5. COLUMN LEVEL PERMISSIONS FOR SECURITY
-- -------------------------------------------------------------------------
-- Restrict public/anonymous updates on `apps` table to ONLY the `download_count` column.
-- This ensures that anonymous users can increment downloads but cannot modify app metadata.
REVOKE UPDATE ON public.apps FROM public, anon;
GRANT UPDATE (download_count) ON public.apps TO public, anon;
GRANT UPDATE ON public.apps TO authenticated;

-- -------------------------------------------------------------------------
-- 6. SEED INITIAL VALUES FOR GLOBAL SETTINGS
-- -------------------------------------------------------------------------
INSERT INTO public.settings (
    id, 
    company_name, 
    tagline, 
    logo_url, 
    favicon_url, 
    theme, 
    footer_text, 
    contact_email, 
    contact_phone, 
    address, 
    social_links
) VALUES (
    'global', 
    'GoTop Technologies', 
    'Technology That Takes You to the Top', 
    '/logo.png', 
    '/icon.png', 
    'light', 
    '© 2026 GoTop Technologies. All rights reserved.', 
    'support@gotoptech.com', 
    '+1 (555) 867-5309', 
    'GoTop Headquarters, Floor 88, Innovation Way, Seattle, WA', 
    '{"facebook": "", "twitter": "", "linkedin": "", "github": "", "telegram": ""}'::jsonb
) ON CONFLICT (id) DO NOTHING;
