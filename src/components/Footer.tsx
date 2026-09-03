import React from 'react';

interface FooterProps {
  companyName?: string;
}

export const Footer: React.FC<FooterProps> = ({ companyName = "Neztech" }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-md shadow-purple-500/20 border border-purple-500/30 flex items-center justify-center overflow-hidden">
            <img 
              src="/neztech-logo.png" 
              alt="Neztech Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <span className="text-base font-bold text-white">{companyName}</span>
            <span className="text-xs text-slate-400 ml-2 font-mono">Conversational AI</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-xs text-slate-400 font-medium">
          <a href="#demo" className="hover:text-cyan-400 transition">Interactive Demo</a>
          <a href="#features" className="hover:text-cyan-400 transition">Capabilities</a>
          <a href="#about" className="hover:text-cyan-400 transition">About</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400 font-mono">
          &copy; {new Date().getFullYear()} {companyName} Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
