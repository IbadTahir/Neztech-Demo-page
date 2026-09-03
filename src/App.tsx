import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceDemo } from './components/VoiceDemo';
import { Features } from './components/Features';
import { About } from './components/About';
import { Footer } from './components/Footer';

export function App() {
  const [isCallActive, setIsCallActive] = useState(false);
  const companyName = "Neztech";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. Header with company logo and company name */}
      <Navbar 
        companyName={companyName}
        isCallActive={isCallActive}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        
        {/* Interactive Demo Section */}
        <VoiceDemo 
          onCallStateChange={(active) => setIsCallActive(active)}
        />

        {/* Feature Capabilities */}
        <Features />

        {/* About Section */}
        <About companyName={companyName} />

      </main>

      {/* 3. Footer */}
      <Footer companyName={companyName} />
    </div>
  );
}

export default App;
