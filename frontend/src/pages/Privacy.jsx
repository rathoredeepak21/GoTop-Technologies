import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Privacy = () => {
  const { settings } = useSettings();

  return (
    <div className="relative min-h-[75vh] py-16 md:py-24 container-custom max-w-4xl">
      {/* Background decoration */}
      <div className="glow-circle-blue top-10 left-1/4" />
      
      <div className="relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-50 border border-orange-100 text-[#F97316]">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Last updated: June 26, 2026. Learn how we handle your metadata and maintain system transparency.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <Eye className="h-4.5 w-4.5 text-[#F97316]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We believe in data transparency and user privacy. {settings.companyName} does not require account registration or collect personal identifiable information (PII) to browse our applications catalog. However, we automatically collect basic telemetry details to verify system performance and populate our dashboard charts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 mt-2">
              <li><strong>Telemetry Logs:</strong> Page visits and download events.</li>
              <li><strong>Client Context:</strong> Basic IP addresses (anonymized/logged for traffic validation) and browser User Agent strings.</li>
              <li><strong>Download Markers:</strong> The specific application name when you trigger an APK download.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <Lock className="h-4.5 w-4.5 text-[#F97316]" />
              <span>2. How We Use Data</span>
            </h2>
            <p>
              The metadata collected is solely used to enhance the service quality and secure our catalog ecosystem. We use it to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 mt-2">
              <li>Calculate global download counters and update the trending apps carousel on the homepage.</li>
              <li>Generate aggregate analytical graphs in the protected Administrator Console.</li>
              <li>Monitor and prevent malicious brute-force attempts on our download gateways.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <FileText className="h-4.5 w-4.5 text-[#F97316]" />
              <span>3. Cloud Storage and Hosting</span>
            </h2>
            <p>
              Our application ecosystem relies on trusted serverless providers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 mt-2">
              <li><strong>Supabase:</strong> Configured to securely host database settings, categories, app logs, and storage assets (screenshots and logos).</li>
              <li><strong>GitHub Releases:</strong> All Android APK binaries are compiled and served directly from public GitHub release channels to bypass local storage limits.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <p className="text-xs text-gray-500 italic">
              If you have any questions regarding this Privacy Policy or wish to request data clearance, please write to our support desk at <span className="font-semibold text-[#0F172A] not-italic">{settings.contactEmail}</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
