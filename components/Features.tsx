import React from 'react';
import { Layers, ScanFace, Eraser, Crown, Box } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, number }: { icon: any, title: string, desc: string, number: string }) => (
  <div className="group relative bg-[#0e0e0e] border border-zinc-900 hover:border-zinc-700 transition-colors duration-500 h-full flex flex-col p-8 overflow-hidden rounded-sm">
    {/* Corner Accent */}
    <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity">
       <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white/20 stroke-1">
          <path d="M0,0 Q100,0 100,100" />
       </svg>
    </div>

    <div className="relative z-10 flex-grow">
      <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center mb-8 group-hover:border-white transition-colors rounded-full">
        <Icon className="w-5 h-5 text-white stroke-[1.5]" />
      </div>
      
      <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-4">{title}</h3>
      <p className="text-zinc-500 text-sm leading-7 font-mono group-hover:text-zinc-400 transition-colors">{desc}</p>
    </div>

    {/* Tech Footer */}
    <div className="relative z-10 mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center group-hover:border-zinc-800 transition-colors">
       <span className="text-[9px] uppercase tracking-widest text-zinc-600">Module {number}</span>
       <Box className="w-3 h-3 text-zinc-700 group-hover:text-white transition-colors" />
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col justify-center h-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
           <div className="max-w-xl">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                Core Architecture
              </h2>
              <h3 className="text-4xl md:text-6xl font-black text-premium uppercase tracking-tighter leading-none">
                 Engineered for <br/> Permanence.
              </h3>
           </div>
           <p className="text-zinc-500 font-mono text-xs max-w-xs mt-6 md:mt-0 text-right border-r border-zinc-800 pr-4">
              SYSTEM SPECS: <br/> V2.4 NEURAL TENSOR FLOW
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[400px]">
            <FeatureCard 
              icon={Layers} 
              number="01"
              title="Stencil Isolation" 
              desc="Proprietary algorithm separates contour lines from shading data. Generates 300DPI ready-to-print thermal stencils."
            />
            <FeatureCard 
              icon={ScanFace} 
              number="02"
              title="Anatomy Mapping" 
              desc="Lidar-assisted surface warping. Project designs onto biceps, forearms, or back curvature with physics-accurate distortion."
            />
            <FeatureCard 
              icon={Eraser} 
              number="03"
              title="Eclipse Engine" 
              desc="Analyze existing ink density. The model suggests high-saturation geometric or blackout concepts to completely obscure work."
            />
            <FeatureCard 
              icon={Crown} 
              number="04"
              title="Studio Vault" 
              desc="Client management ecosystem. Store concept iterations, consent forms, and high-fidelity reference renders in one encrypted vault."
            />
        </div>
    </section>
  );
};