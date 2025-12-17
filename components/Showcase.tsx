import React, { useState } from 'react';

interface ShowcaseItemProps {
  beforeImg: string;
  afterImg: string;
  title: string;
  subtitle: string;
}

const GridItem: React.FC<ShowcaseItemProps> = ({ beforeImg, afterImg, title, subtitle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative w-full h-full overflow-hidden group border border-zinc-900 bg-zinc-950"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
       {/* Image Layer */}
       <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
         <img 
            src={hovered ? afterImg : beforeImg} 
            alt={title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
         />
         <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500" />
       </div>

       {/* Overlay Content */}
       <div className="absolute inset-0 p-8 flex flex-col justify-end items-start pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm p-4 border border-zinc-800 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <h3 className="text-xl font-bold text-premium uppercase tracking-tighter mb-1">{title}</h3>
             <p className="text-[10px] font-mono text-zinc-400 uppercase">{subtitle}</p>
          </div>
       </div>

       {/* Label Indicator */}
       <div className="absolute top-4 right-4">
          <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest border border-zinc-800">
             {hovered ? 'OUTPUT' : 'INPUT'}
          </span>
       </div>
    </div>
  );
};

export const Showcase: React.FC = () => {
  return (
    <section className="w-full h-screen flex flex-col bg-black">
       {/* Header Bar */}
       <div className="h-20 border-b border-zinc-900 flex items-center justify-between px-6 bg-black z-20">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
             <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em]">System Output</h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">RENDER_MODE: HIGH_FIDELITY</span>
       </div>

       {/* 2x2 Full Screen Grid */}
       <div className="flex-grow grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-0">
           <GridItem 
             title="Color Packing"
             subtitle="Saturation Preview"
             beforeImg="/images/t1.png"
             afterImg="/images/t11.png"
           />
           <GridItem 
             title="Stencil Extraction"
             subtitle="Clean Line Work"
             beforeImg="/images/t2.png"
             afterImg="/images/t22.png"
           />
           <GridItem 
             title="Anatomy Mapping"
             subtitle="AR Body Fit"
             beforeImg="/images/t3.png"
             afterImg="/images/t33.png"
           />
           <GridItem 
             title="Cover-Up Logic"
             subtitle="Density Calculation"
             beforeImg="/images/t4.png"
             afterImg="/images/t44.jpg"
           />
       </div>
    </section>
  );
};