import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Activity, 
  Clock, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';

interface TranscriptItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  time: string;
}

interface VoiceDemoProps {
  onCallStateChange?: (isActive: boolean) => void;
}

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || "";
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "";

const createVapiClient = (key: string): any => {
  const VapiConstructor: any = typeof Vapi === 'function' ? Vapi : (Vapi as any)?.default;
  if (!VapiConstructor) {
    throw new Error('Could not load voice client constructor');
  }
  return new VapiConstructor(key);
};

export const VoiceDemo: React.FC<VoiceDemoProps> = ({ onCallStateChange }) => {
  // Call & Assistant State
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic bar heights for the 24 wave bars
  const [barHeights, setBarHeights] = useState<number[]>(new Array(24).fill(10));
  const [activeVolume, setActiveVolume] = useState<number>(0);

  // Transcripts State
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: 'welcome-msg',
      role: 'system',
      content: 'Welcome to the Neztech Voice AI Demo! Click "Start Call" below to begin a live conversation with your assistant.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Refs
  const vapiRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Real-time Web Audio API Analyser Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Shared ref for latest speaking / mute state in 60fps loop
  const isSpeakingRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const assistantVolumeRef = useRef<number>(0);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Function to start Web Audio Analyser on microphone
  const startAudioAnalyser = async () => {
    try {
      // Access microphone stream for live waveform frequency analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderLoop = () => {
        if (!analyserRef.current) return;

        if (isMutedRef.current) {
          // When muted, keep bars at resting level
          setBarHeights(new Array(24).fill(10));
          setActiveVolume(0);
          animationFrameRef.current = requestAnimationFrame(renderLoop);
          return;
        }

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average microphone input volume
        let micSum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          micSum += dataArray[i];
        }
        const avgMic = micSum / dataArray.length; // 0 to 255
        const normalizedMic = Math.min(1, avgMic / 70); // sensitive scale

        // Combine with assistant voice if assistant is speaking
        const assistantVol = assistantVolumeRef.current;
        const effectiveVol = Math.max(normalizedMic, assistantVol);
        setActiveVolume(effectiveVol);

        const newHeights: number[] = [];
        const time = Date.now() / 150;

        for (let i = 0; i < 24; i++) {
          const centerFactor = 1 - Math.abs(i - 11.5) / 12; // taller towards center
          
          if (effectiveVol > 0.04) {
            // Active voice audio (either user speaking or assistant speaking)
            const freqBin = Math.min(dataArray.length - 1, Math.floor((i / 24) * 16));
            const freqVal = dataArray[freqBin] / 255;
            
            // Dynamic lively wave calculation
            const waveOscillation = Math.sin(time + i * 0.5) * 12;
            const dynamicScale = Math.max(freqVal, effectiveVol) * 60 * centerFactor;
            const h = Math.max(10, Math.min(78, 12 + dynamicScale + waveOscillation));
            newHeights.push(Math.round(h));
          } else {
            // Idle ambient subtle breathing motion
            const idleWave = Math.sin(time + i * 0.3) * 3;
            newHeights.push(Math.max(8, Math.round(10 + idleWave * centerFactor)));
          }
        }

        setBarHeights(newHeights);
        animationFrameRef.current = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    } catch (err) {
      console.warn('Microphone analyser setup notice:', err);
    }
  };

  // Stop Web Audio Analyser
  const stopAudioAnalyser = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setBarHeights(new Array(24).fill(10));
    setActiveVolume(0);
  };

  // Initialize Vapi client once
  useEffect(() => {
    try {
      if (PUBLIC_KEY) {
        const vapiInstance = createVapiClient(PUBLIC_KEY);
        vapiRef.current = vapiInstance;

        // Register Event Handlers
        vapiInstance.on('call-start', () => {
          setStatus('connected');
          setErrorMessage(null);
          addTranscript('system', 'Voice session established. Speak into your microphone.');
          // Start real-time microphone analysis
          startAudioAnalyser();
        });

        vapiInstance.on('call-end', () => {
          setStatus('idle');
          setIsSpeaking(false);
          setIsListening(false);
          assistantVolumeRef.current = 0;
          stopAudioAnalyser();
          addTranscript('system', 'Voice call ended.');
        });

        vapiInstance.on('speech-start', () => {
          setIsSpeaking(true);
          setIsListening(false);
        });

        vapiInstance.on('speech-end', () => {
          setIsSpeaking(false);
          setIsListening(true);
          assistantVolumeRef.current = 0;
        });

        // Assistant volume level
        vapiInstance.on('volume-level', (volume: number) => {
          assistantVolumeRef.current = Math.min(1, Math.max(0, volume * 1.6));
        });

        // Local microphone volume level fallback from Vapi
        vapiInstance.on('local-volume-level', (vol: number) => {
          if (!audioContextRef.current && vol > 0.05) {
            assistantVolumeRef.current = Math.min(1, vol * 2.0);
          }
        });

        vapiInstance.on('message', (message: any) => {
          if (message.type === 'transcript') {
            const role = message.role === 'user' ? 'user' : 'assistant';
            const text = message.transcript;
            if (text && text.trim().length > 0) {
              if (message.transcriptType === 'final') {
                addTranscript(role, text);
              }
            }
          }
        });

        vapiInstance.on('error', (err: any) => {
          console.error('Voice stream error:', err);
          const msg = err?.message || 'Connection or microphone error occurred.';
          setErrorMessage(msg);
          setStatus('error');
          stopAudioAnalyser();
          addTranscript('system', `Notice: ${msg}`);
        });
      }
    } catch (err: any) {
      console.error('Failed to initialize voice client:', err);
      setErrorMessage(err?.message || 'Failed to initialize voice engine.');
    }

    return () => {
      stopAudioAnalyser();
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  // Handle call timer
  useEffect(() => {
    if (status === 'connected') {
      onCallStateChange?.(true);
      timerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      onCallStateChange?.(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, onCallStateChange]);

  // Auto-scroll transcript container internally without moving the outer page
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Helper to add transcript
  const addTranscript = (role: 'user' | 'assistant' | 'system', content: string) => {
    setTranscripts((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role,
        content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Start Call Handler
  const handleStartCall = async () => {
    try {
      setStatus('connecting');
      setErrorMessage(null);

      if (!vapiRef.current) {
        vapiRef.current = createVapiClient(PUBLIC_KEY);
      }

      await vapiRef.current.start(ASSISTANT_ID);
      setIsListening(true);
    } catch (err: any) {
      console.error('Call start failed:', err);
      setStatus('error');
      const errTxt = err?.message || 'Failed to start call. Check microphone permissions.';
      setErrorMessage(errTxt);
    }
  };

  // Stop Call Handler
  const handleStopCall = () => {
    try {
      stopAudioAnalyser();
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      setStatus('idle');
      setIsSpeaking(false);
      setIsListening(false);
      assistantVolumeRef.current = 0;
    } catch (err: any) {
      console.error('Stop call error:', err);
      setStatus('idle');
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (vapiRef.current && status === 'connected') {
      const nextMute = !isMuted;
      vapiRef.current.setMuted(nextMute);
      setIsMuted(nextMute);
      isMutedRef.current = nextMute;
    }
  };

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="demo" className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Voice Experience</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Real-Time Voice AI <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Demo</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Experience human-quality two-way voice conversations with sub-second latency, natural conversational cadence, and dynamic intelligence.
        </p>
      </div>

      {/* Main Interactive Demo Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Console: Interactive Call Controls & Audio Visualizer (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-[520px] max-h-[520px]">
          
          {/* Top Bar inside Demo card */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <h2 className="text-base font-semibold text-white">Neztech Voice Assistant</h2>
                <p className="text-xs text-slate-400 font-mono">Real-time Conversational Stream</p>
              </div>
            </div>

            {/* Call Timer */}
            {status === 'connected' && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono border border-slate-700">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>

          {/* Middle Area: Start Call Button (idle) OR Active Waves (in-call) */}
          <div className="flex flex-col items-center justify-center my-auto py-8">
            
            {status === 'idle' || status === 'error' ? (
              /* Idle / Ready: Show Start Call Orb */
              <div className="flex flex-col items-center">
                <button
                  onClick={handleStartCall}
                  className="group relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[3px] shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 mb-6"
                >
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center space-y-1.5 group-hover:bg-slate-900 transition">
                    <Phone className="w-9 h-9 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Start Call
                    </span>
                  </div>
                </button>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-slate-400">
                  {status === 'error' ? (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errorMessage || 'Connection failed'}
                    </span>
                  ) : (
                    <span>Click the button above to begin demo</span>
                  )}
                </div>
              </div>
            ) : status === 'connecting' ? (
              /* Connecting State */
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-cyan-500/50 flex flex-col items-center justify-center space-y-2 animate-pulse mb-6">
                  <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-[10px] font-mono text-cyan-300 uppercase">Connecting...</span>
                </div>
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Connecting to Voice Assistant...
                </span>
              </div>
            ) : (
              /* Connected / Live Call State: ONLY Waves appear in the middle! */
              <div className="w-full flex flex-col items-center justify-center py-4 animate-in fade-in duration-300">
                
                {/* Dynamic Waves Visualizer in Middle (Reactivity to user voice and assistant voice) */}
                <div className="relative w-full max-w-md h-32 flex items-center justify-center gap-1.5 px-4 mb-6">
                  
                  {/* Glowing ambient halo behind waves reacting to active volume */}
                  <div 
                    className="absolute inset-0 m-auto rounded-full bg-cyan-500/15 transition-all duration-150 pointer-events-none"
                    style={{
                      width: `${160 + activeVolume * 150}px`,
                      height: `${90 + activeVolume * 100}px`,
                      filter: 'blur(32px)'
                    }}
                  />

                  {/* 24 Dynamic Soundwave Bars directly reacting at 60 FPS */}
                  {barHeights.map((h, i) => {
                    return (
                      <div
                        key={i}
                        className={`w-2 rounded-full transition-all duration-75 ${
                          isMuted
                            ? 'bg-rose-500/40'
                            : isSpeaking
                            ? 'bg-gradient-to-t from-cyan-400 via-indigo-400 to-purple-400 shadow-md shadow-cyan-400/40'
                            : activeVolume > 0.08
                            ? 'bg-gradient-to-t from-emerald-400 via-teal-300 to-cyan-400 shadow-md shadow-emerald-400/40'
                            : 'bg-gradient-to-t from-emerald-500/70 to-cyan-500/70'
                        }`}
                        style={{
                          height: `${h}px`
                        }}
                      />
                    );
                  })}
                </div>

                {/* Live Speaking / Listening Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-xs font-semibold mb-6">
                  {isMuted ? (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <MicOff className="w-3.5 h-3.5" />
                      Microphone is muted
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Assistant is speaking...
                    </span>
                  ) : activeVolume > 0.08 ? (
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Speaking...
                    </span>
                  ) : isListening ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Listening to your voice...
                    </span>
                  ) : (
                    <span className="text-slate-300">Live Voice Stream Connected</span>
                  )}
                </div>

                {/* Call Controls: Mute Mic & End Call Button on the right */}
                <div className="flex items-center justify-center gap-4">
                  {/* Mute / Unmute Button */}
                  <button
                    onClick={handleToggleMute}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isMuted 
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-500/10' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                    <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                  </button>

                  {/* End Call Button on the right side of Mute Mic */}
                  <button
                    onClick={handleStopCall}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 shadow-lg shadow-rose-600/25 active:scale-95 transition-all duration-200"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Console: Real-time Transcript (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col h-[520px] max-h-[520px] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-4 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
                Live Transcript
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Real-Time Stream
            </span>
          </div>

          {/* Transcript Content Area */}
          <div ref={transcriptContainerRef} className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 font-sans text-sm custom-scrollbar">
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <Activity className="w-8 h-8 mb-2 opacity-40" />
                <span>No conversation messages yet.</span>
              </div>
            ) : (
              transcripts.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col ${
                    item.role === 'user' 
                      ? 'items-end' 
                      : item.role === 'assistant' 
                      ? 'items-start' 
                      : 'items-center'
                  }`}
                >
                  {item.role === 'system' ? (
                    <div className="my-1 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 text-center max-w-[90%]">
                      {item.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                        item.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono opacity-70">
                        <span className="font-semibold uppercase tracking-wider">
                          {item.role === 'user' ? 'You' : 'Neztech AI'}
                        </span>
                        <span>{item.time}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
