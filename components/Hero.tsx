import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Layers, Shirt, Eraser, Upload, Sparkles, MoveRight, Camera, Settings } from 'lucide-react';
import { TabMode } from '../types';
import { InkBackground } from './InkBackground';

interface HeroProps {
  activeTab: TabMode;
  setActiveTab: (tab: TabMode) => void;
  onGenerate: () => void;
  isModal?: boolean;
}

const tabConfig = {
  [TabMode.DESIGN]: {
    id: TabMode.DESIGN,
    label: 'Design',
    displayTitle: 'Neural Ink Gen',
    icon: PenTool,
    desc: "Concept to flash generation with needle-depth awareness.",
    placeholder: "Describe concept...",
    action: 'Generate Design'
  },
  [TabMode.STENCIL]: {
    id: TabMode.STENCIL,
    label: 'Stencil',
    displayTitle: 'Thermal Extract',
    icon: Layers,
    desc: "Isolates structural paths for thermal printing.",
    placeholder: "Awaiting source...",
    action: 'Create Stencil'
  },
  [TabMode.TRY_ON]: {
    id: TabMode.TRY_ON,
    label: 'Try-On',
    displayTitle: 'Anatomy Map',
    icon: Shirt,
    desc: "Project designs onto body geometry.",
    placeholder: "Upload body canvas...",
    action: 'Start Projection'
  },
  [TabMode.COVER_UP]: {
    id: TabMode.COVER_UP,
    label: 'Cover-Up',
    displayTitle: 'Eclipse Engine',
    icon: Eraser,
    desc: "Calculates blackout patterns to obscure ink.",
    placeholder: "Upload tattoo...",
    action: 'Analyze Density'
  },
};

// Decorative Screw Head
const Screw = ({ className }: { className?: string }) => (
  <div className={`w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center ${className}`}>
    <div className="w-full h-[1px] bg-black transform rotate-45"></div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab, onGenerate, isModal = false }) => {
  const activeConfig = tabConfig[activeTab];

  return (
    <section 
      className={`relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-black select-none ${isModal ? 'p-0' : 'pt-0'}`}
    >
      
      {/* --- BACKGROUND IMAGE & OVERLAY --- */}
      {/* Darkened background to allow Spotlight (mix-blend-screen) to "illuminate" it */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=2000&auto=format&fit=crop" 
          alt="Tattoo Art Background" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Stronger darken to make spotlight pop */}
        <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>
      
      {/* Atmosphere */}
      <InkBackground />

      {/* Main Content Container: If modal, take full width/height without padding constraints */}
      <div className={`relative z-10 w-full h-full flex flex-col justify-center ${isModal ? '' : 'max-w-7xl mx-auto px-6'}`}>
        
        {/* 1. HEADLINES (Simplified) */}
        {!isModal && (
          <div className="text-center mb-10 md:mb-16 relative">
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl text-premium">
               InkGenius
             </h1>
             <p className="text-zinc-400 font-serif italic text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
               The Operating System for Modern Tattooing.
             </p>
          </div>
        )}

        {/* 2. CONSOLE INTERFACE */}
        <div className={`
           flex flex-col lg:flex-row gap-0 items-stretch bg-[#0a0a0a] relative overflow-hidden 
           ${isModal 
             ? 'w-full h-full border-0 rounded-none shadow-none' 
             : 'h-[55vh] min-h-[500px] border border-zinc-800 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm ring-1 ring-white/5'
           }
        `}>
           
           {/* Hardware Screws - Only show if NOT modal (cleaner look in modal) */}
           {!isModal && (
             <>
               <Screw className="absolute top-3 left-3 z-30" />
               <Screw className="absolute top-3 right-3 z-30" />
               <Screw className="absolute bottom-3 left-3 z-30" />
               <Screw className="absolute bottom-3 right-3 z-30" />
             </>
           )}

           {/* LEFT: CONTROLS */}
           <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col z-20 bg-zinc-950">
              <div className="h-16 border-b border-zinc-800 flex items-center px-6 bg-black/20 justify-between">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
                    Tool Selector
                 </span>
                 <Settings className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              
              <div className="flex-grow flex flex-col relative py-2 overflow-y-auto">
                 {/* Texture */}
                 <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

                {Object.values(tabConfig).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative group flex-grow flex items-center px-8 py-4 lg:py-0 transition-all duration-300 border-l-2 ${
                        isActive 
                        ? 'bg-zinc-900 border-white text-white' 
                        : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                      }`}
                    >
                       <div className="flex items-center gap-5 w-full relative z-10">
                          <tab.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                          <div className="text-left">
                            <span className={`block text-sm font-bold uppercase tracking-wider leading-none mb-1 font-sans`}>
                              {tab.label}
                            </span>
                            <span className="text-[9px] font-mono opacity-50 block">{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                          </div>
                       </div>
                       {isActive && <MoveRight className="absolute right-6 w-4 h-4 text-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>
           </div>

           {/* RIGHT: WORKSPACE */}
           <div className="w-full lg:w-2/3 flex flex-col relative z-10 bg-[#050505]">
               {/* Grid Background */}
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

               {/* Header */}
               <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/40 backdrop-blur">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                       System Ready
                     </span>
                  </div>
                  <div className="flex gap-1.5">
                     <div className="w-8 h-0.5 bg-zinc-800"></div>
                     <div className="w-2 h-0.5 bg-zinc-800"></div>
                  </div>
               </div>

               {/* Input Area */}
               <div className="flex-grow relative overflow-hidden p-10 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col relative z-10"
                    >
                        <h3 className="text-xl text-white font-serif italic mb-6 opacity-80">{activeConfig.displayTitle}</h3>

                        {/* Prompt Input / File Upload */}
                        {activeTab === TabMode.TRY_ON ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-h-[400px]">
                             <div className="border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col items-center justify-center p-6 group rounded-sm">
                                <Upload className="w-8 h-8 text-zinc-600 group-hover:text-white mb-4 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">Load Tattoo</span>
                             </div>
                             <div className="border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col items-center justify-center p-6 group rounded-sm">
                                <Camera className="w-8 h-8 text-zinc-600 group-hover:text-white mb-4 transition-colors" />
                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">Capture Body</span>
                             </div>
                          </div>
                        ) : activeTab === TabMode.DESIGN ? (
                           <div className="flex-grow relative group">
                              <textarea 
                                className="w-full h-full bg-transparent text-3xl md:text-5xl font-black text-white/90 placeholder-zinc-800 focus:outline-none resize-none leading-[1.1] tracking-tighter font-sans uppercase"
                                placeholder={activeConfig.placeholder}
                                autoFocus
                              />
                              <div className="absolute bottom-0 right-0 p-2">
                                <Sparkles className="w-6 h-6 text-zinc-700 group-hover:text-white transition-colors" />
                              </div>
                           </div>
                        ) : (
                           <div 
                             onClick={() => document.getElementById('file-upload')?.click()}
                             className="flex-grow border border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-6 group rounded-sm"
                           >
                              <div className="w-20 h-20 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-white transition-colors shadow-2xl">
                                 <Upload className="w-8 h-8 text-zinc-600 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">
                                 Upload Reference Image
                              </span>
                              <input type="file" id="file-upload" className="hidden" />
                           </div>
                        )}
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* Footer Action Bar */}
               <div className="h-20 border-t border-zinc-800 flex bg-zinc-950 relative z-20 shrink-0">
                  <div className="flex-grow border-r border-zinc-800 flex items-center px-8 justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Est. Render Time</span>
                        <span className="text-xs text-white font-mono">1.2s</span>
                     </div>
                  </div>
                  <button 
                     onClick={onGenerate}
                     className="w-1/2 md:w-2/5 bg-white text-black hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                     <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em]">
                        {activeConfig.action}
                     </span>
                     <Sparkles className="w-4 h-4 relative z-10" />
                     {/* Ink transition */}
                     <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 mix-blend-exclusion" />
                  </button>
               </div>
           </div>
        </div>

      </div>
    </section>
  );
};