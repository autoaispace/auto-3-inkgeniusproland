import React from 'react';
import { Menu, Zap, Star } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section with Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                 <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:border-white transition-colors">
                    <span className="font-gothic text-3xl text-white pt-1">I</span>
                 </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold italic tracking-wide text-white leading-none">
                  InkGenius
                </span>
              </div>
            </div>

            {/* Social Proof - Moved to right of title */}
            <div className="hidden lg:flex items-center gap-2 border border-zinc-800 bg-zinc-900/50 px-3 py-1 rounded-full">
               <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-white text-white" />)}
               </div>
               <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wide">
                 Trusted by 50k+ Studios
               </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['Suite', 'Features', 'Gallery'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors font-mono"
              >
                {item}
              </a>
            ))}
            
            <button
              id="nav-btn-start"
              className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-2 border border-white"
            >
              <Zap className="w-3 h-3 fill-black" />
              Launch
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};