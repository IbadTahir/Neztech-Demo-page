import React, { useState } from 'react';
import { Sparkles, Menu, X, Radio } from 'lucide-react';

interface NavbarProps {
  companyName?: string;
  isCallActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  companyName = "Neztech",
  isCallActive = false 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Company Logo and Name */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group cursor-pointer">
              {/* Logo Container */}
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg shadow-purple-500/20 border border-purple-500/30 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
                <img 
                  src="/neztech-logo.png" 
                  alt="Neztech Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </div>

            {/* Company Name & Badge */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {companyName}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  AI Voice
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Conversational AI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#demo" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <span>Interactive Demo</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Capabilities
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
          </nav>

          {/* Right Action / Status Area */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              isCallActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400'
            }`}>
              <Radio className={`w-3.5 h-3.5 ${isCallActive ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
              <span>{isCallActive ? 'LIVE CALL' : 'ASSISTANT READY'}</span>
            </div>

            <a 
              href="#demo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Demo</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <a 
              href="#demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
            >
              Interactive Demo
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
            >
              Capabilities
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-400"
            >
              About
            </a>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {isCallActive ? 'Live Call in Progress' : 'Voice Assistant Ready'}
              </span>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-semibold"
              >
                Launch Demo
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
