import React from 'react';
import { Shield, Zap, Globe2, Bot, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  companyName?: string;
}

export const About: React.FC<AboutProps> = ({ companyName = "Neztech" }) => {
  const stats = [
    { label: "Roundtrip Latency", value: "< 500ms", detail: "Real-time speech exchange" },
    { label: "System Availability", value: "99.99%", detail: "Enterprise-grade uptime" },
    { label: "Global Accents & Languages", value: "50+", detail: "Natural neural voices" },
    { label: "Concurrent Sessions", value: "10,000+", detail: "Elastic WebRTC scaling" },
  ];

  const highlights = [
    "Ultra-low latency audio processing pipeline",
    "Natural interruption handling and full duplex speech",
    "Customizable voice personas and brand tone",
    "Direct integration with enterprise databases and CRMs",
    "Enterprise-grade encryption and privacy controls",
    "Continuous context retention across conversations"
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
          <Bot className="w-3.5 h-3.5" />
          <span>About {companyName}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pioneering the Next Era of <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Voice Intelligence</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          {companyName} crafts next-generation conversational voice systems engineered to deliver human-like, instantaneous conversations for modern digital products and enterprise operations.
        </p>
      </div>

      {/* Grid: Story & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Built for Zero-Friction Conversational Experiences</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Traditional IVRs and legacy voice bots leave callers frustrated with rigid robotic menus, laggy audio, and clumsy turn-taking. At {companyName}, we combine cutting-edge neural speech models with sub-second WebRTC audio streaming to create AI agents that listen, think, and reply with natural human cadence.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether handling 24/7 customer support, qualifying inbound leads, or scheduling appointments, {companyName} delivers reliable, intelligent, and scalable voice automation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-800/80">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-lg shadow-purple-500/20 border border-purple-500/30 mb-6 flex items-center justify-center">
              <img 
                src="/neztech-logo.png" 
                alt={`${companyName} Logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Our Vision
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              To make interacting with technology as natural, intuitive, and effortless as having a conversation with a thoughtful colleague.
            </p>
            
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Enterprise Data Privacy &amp; Security Compliance</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Global Distributed WebRTC Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 text-center hover:border-slate-700 transition"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 mb-1">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              {stat.label}
            </div>
            <div className="text-[11px] text-slate-500">
              {stat.detail}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
