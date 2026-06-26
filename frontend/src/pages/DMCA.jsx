import React from 'react';
import { AlertCircle, FileDigit, Send, ShieldAlert } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DMCA = () => {
  const { settings } = useSettings();

  return (
    <div className="relative min-h-[75vh] py-16 md:py-24 container-custom max-w-4xl">
      {/* Background decoration */}
      <div className="glow-circle-blue top-10 left-1/4" />
      
      <div className="relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-50 border border-orange-100 text-[#F97316]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
            DMCA Compliance
          </h1>
          <p className="text-gray-550 text-sm max-w-lg mx-auto">
            Last updated: June 26, 2026. Respecting intellectual property rights and handling copyright claims.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-[#F97316]" />
              <span>1. Copyright Infringement Notice Policy</span>
            </h2>
            <p>
              {settings.companyName} respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act ("DMCA"), we will respond quickly to claims of copyright infringement committed on our portal that are reported to our designated agent.
            </p>
            <p>
              If you are a copyright owner, authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements by sending a formal DMCA Notice of Alleged Infringement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <FileDigit className="h-4.5 w-4.5 text-[#F97316]" />
              <span>2. Notice Requirements</span>
            </h2>
            <p>
              To file a copyright infringement claim with us, please provide a written communication that includes the following details:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
              <li>A physical or electronic signature of the person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed (e.g. details of original content).</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed (specifically, the public URL on our website).</li>
              <li>Your contact coordinates (Address, Telephone Desk, and Support Email).</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of the right that is allegedly infringed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#0F172A] flex items-center space-x-2">
              <Send className="h-4.5 w-4.5 text-[#F97316]" />
              <span>3. Submission Coordinates</span>
            </h2>
            <p>
              Please send your completed notice to our Designated Copyright Agent at the email address listed below. Email is our preferred method of communication to ensure expedited removal processing:
            </p>
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl text-center space-y-1.5">
              <div className="text-xs uppercase text-gray-500 font-bold">Designated Agent Email</div>
              <div className="text-base font-extrabold text-[#F97316] tracking-wide">{settings.contactEmail}</div>
              <div className="text-[10px] text-gray-500 font-mono">Attn: GoTop Copyright Compliance Department</div>
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <p className="text-xs text-gray-500 italic">
              GoTop Technologies reserves the right to remove any content or delete apps from our index that are suspected of infringing copyrights without prior warning.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DMCA;
