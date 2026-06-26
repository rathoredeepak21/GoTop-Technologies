import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 70 } }
  };

  // Safe destructuring with defaults
  const {
    companyName = 'GoTop Technologies',
    aboutJourneyHeading = 'Our Journey',
    aboutJourneyP1 = '',
    aboutJourneyP2 = '',
    aboutJourneyQuote = '',
    aboutJourneyImg = '',
    aboutMissionText = '',
    aboutVisionText = '',
    aboutLeadership = [],
    aboutRoadmapsDesc = '',
    aboutRoadmaps = []
  } = settings || {};

  const brandName = companyName.split(' ')[0] || 'GoTop';

  return (
    <div className="relative overflow-hidden min-h-screen py-16">
      {/* Background Mesh Gradients */}
      <div className="glow-circle-blue top-1/3 right-10" />
      <div className="glow-circle-indigo bottom-1/3 left-10" />

      <div className="container-custom relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-semibold text-[#F97316] uppercase tracking-[0.2em]">Our Identity</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#0F172A]">About {brandName}</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Learn about our founding story, mission parameters, and the engineering principles guiding our products.
          </p>
          <div className="neon-divider w-24 mx-auto pt-2" />
        </div>

        {/* Company Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A] border-l-4 border-[#F97316] pl-4">
              {aboutJourneyHeading}
            </h2>
            {aboutJourneyP1 && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light whitespace-pre-line">
                {aboutJourneyP1}
              </p>
            )}
            {aboutJourneyP2 && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light whitespace-pre-line">
                {aboutJourneyP2}
              </p>
            )}
            {aboutJourneyQuote && (
              <div className="p-4 rounded-xl bg-[#F97316]/5 border border-[#F97316]/25">
                <span className="text-[#F97316] font-semibold text-sm">"{aboutJourneyQuote}"</span>
              </div>
            )}
          </motion.div>

          {aboutJourneyImg && (
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F97316]/10 to-indigo-500/10 filter blur-3xl opacity-40 rounded-full" />
              <img 
                src={aboutJourneyImg} 
                alt={`${brandName} office brainstorming`}
                className="rounded-2xl border border-slate-200 shadow-2xl object-cover max-h-[380px] w-full"
              />
            </motion.div>
          )}
        </section>

        {/* Mission and Vision Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
        >
          {/* Mission Card */}
          <motion.div variants={cardVariants} className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/25 w-12 flex justify-center">
              <Compass className="h-6 w-6 text-[#F97316]" />
            </div>
            <h3 className="text-[#0F172A] font-bold text-xl font-display">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {aboutMissionText}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div variants={cardVariants} className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/25 w-12 flex justify-center">
              <Eye className="h-6 w-6 text-[#F97316]" />
            </div>
            <h3 className="text-[#0F172A] font-bold text-xl font-display">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {aboutVisionText}
            </p>
          </motion.div>
        </motion.section>

        {/* Team Section */}
        {aboutLeadership && aboutLeadership.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-display font-extrabold text-[#0F172A]">Our Leadership</h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                The creative minds directing {brandName} engineering and product development.
              </p>
              <div className="neon-divider w-16 mx-auto pt-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutLeadership.map((member, idx) => (
                <div key={idx} className="glass-panel rounded-2xl overflow-hidden group">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center group-hover:scale-102 transition-transform duration-300 filter brightness-95"
                  />
                  <div className="p-6 text-center border-t border-slate-100">
                    <h4 className="text-[#0F172A] font-bold text-lg font-display">{member.name}</h4>
                    <span className="text-[#F97316] text-xs font-semibold">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Future Goals */}
        {aboutRoadmaps && aboutRoadmaps.length > 0 && (
          <section className="relative bg-[#0F172A] border border-slate-800 p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full filter blur-[40px]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-white font-extrabold text-2xl font-display">Future Roadmaps</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {aboutRoadmapsDesc}
                </p>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {aboutRoadmaps.map((goal, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl space-y-2">
                    <span className="text-[#F97316] text-xs font-bold font-display">{goal.year}</span>
                    <h4 className="text-white font-semibold text-sm">{goal.title}</h4>
                    <p className="text-slate-300 text-xs leading-normal">{goal.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default About;
