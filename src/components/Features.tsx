import React from 'react';
import { Zap, ShieldCheck, Cpu, Code2, Headphones, Layers } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Ultra-Low Latency Voice",
      description: "Sub-500ms end-to-end voice roundtrips powered by streaming speech-to-text, LLM generation, and realistic neural voice synthesis.",
      tag: "Real-Time"
    },
    {
      icon: Cpu,
      title: "Conversational AI Intelligence",
      description: "Direct connection with high-performance voice models, custom neural speech synthesis, and real-time conversational intelligence.",
      tag: "Connected"
    },
    {
      icon: Layers,
      title: "Full Duplex Interruption",
      description: "Natural conversational flow where users can interrupt the assistant at any point without awkward delays or echo.",
      tag: "Conversational"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Grade Security",
      description: "End-to-end encrypted WebRTC audio streams, secure token authorization, and privacy-first data handling policies.",
      tag: "Secure"
    },
    {
      icon: Code2,
      title: "Webhook & Function Calling",
      description: "Equip your voice assistant with backend tool executions — query databases, book appointments, or trigger external webhooks live.",
      tag: "Programmable"
    },
    {
      icon: Headphones,
      title: "Cross-Platform Audio",
      description: "Optimized noise cancellation and auto-gain control directly in modern web browsers across desktop and mobile devices.",
      tag: "Responsive"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
          Enterprise Voice Architecture
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for frictionless voice interactions
        </p>
        <p className="mt-4 text-slate-400 text-base">
          Everything required to deploy intelligent, human-quality voice bots directly into customer-facing web applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
