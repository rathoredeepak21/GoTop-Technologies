import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Terms = () => {
  const { settings } = useSettings();

  return (
    <div className="relative min-h-[75vh] py-16 md:py-24 container-custom max-w-4xl">
      {/* Background decoration */}
      <div className="glow-circle-indigo top-10 left-1/4" />
      
      <div className="relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-50 border border-orange-100 text-[#F97316]">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-550 text-sm max-w-lg mx-auto">
            Last updated: June 26, 2026. Please read our operating regulations before accessing or downloading files.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#F97316]" />
              <span>1. Agreement & Acceptance</span>
            </h2>
            <p>
              By accessing this website or downloading software clients from the {settings.companyName} portal, you agree to comply with and be bound by these Terms of Service. If you do not accept these conditions, you must immediately terminate usage of this website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#F97316]" />
              <span>2. Permitted Use & Software Licenses</span>
            </h2>
            <p>
              All software listed on the GoTop Catalog represents our production APKs (or approved utility client files). You are granted a limited, non-exclusive, non-transferable, personal license to download and run the software on compatible Android platforms. You must not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 mt-2">
              <li>Modify, decompile, disassemble, or reverse-engineer the APK packages.</li>
              <li>Re-distribute or sell our application files on external, unauthorized marketplaces.</li>
              <li>Exploit our API endpoints or databases to scrape application telemetry logs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <AlertTriangle className="h-4.5 w-4.5 text-[#F97316]" />
              <span>3. Warranty Disclaimer</span>
            </h2>
            <p className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-xs text-amber-700">
              IMPORTANT: All application files and online services are provided on an "AS IS" and "AS AVAILABLE" basis. GoTop Technologies disclaims all warranties, express or implied, including but not limited to compatibility, merchantability, and fitness for a particular purpose. We do not warrant that files downloaded will be error-free or run on all device variants.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <HelpCircle className="h-4.5 w-4.5 text-[#F97316]" />
              <span>4. Changes to Terms</span>
            </h2>
            <p>
              We reserve the right to revise these Terms of Service at any time. Updates will be posted on this page with an adjusted date marker. Continued use of the portal after such modifications constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <p className="text-xs text-gray-500 italic">
              For any legal inquiries regarding this terms document, please reach out to our office at <span className="font-semibold text-[#0F172A] not-italic">{settings.contactEmail}</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
