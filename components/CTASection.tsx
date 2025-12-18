import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CTAProps {
  onStartClick: () => void;
}

export const CTASection: React.FC<CTAProps> = ({ onStartClick }) => {
  return (
    <section className="bg-black text-white w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
       {/* Background Texture Integration */}
       <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black"></div>
          {/* Abstract Ink/Smoke */}
           <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,100 Q50,0 100,100" stroke="white" strokeWidth="0.1" fill="none" />
             <path d="M0,100 Q50,20 100,100" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
       </div>

       <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 uppercase leading-[0.9] text-premium">
             Your Dream Tattoo is <br className="hidden sm:block"/>
             One Click Away.
          </h2>
          
          <p className="text-zinc-500 max-w-2xl mx-auto mb-8 sm:mb-12 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed uppercase tracking-widest px-2">
             Don't settle for generic Google images. <br className="hidden sm:block"/> Create a unique design that tells your story in seconds.
          </p>
          
          <button 
             onClick={onStartClick}
             className="group relative inline-flex items-center gap-3 sm:gap-6 px-6 sm:px-12 py-4 sm:py-6 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all overflow-hidden border-2 border-white rounded-sm"
          >
             <span className="relative z-10">Create My Tattoo For Free</span>
             <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
             
             {/* Ink Splash Effect on Hover */}
             <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 mix-blend-exclusion" />
          </button>
       </div>
    </section>
  );
};