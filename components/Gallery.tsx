import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const allLogs = [
  {
    date: "OCT 12",
    entry: "The Stencil tool is a godsend. Cut my prep time in half. Lines are crisp, thermal ready immediately.",
    artist: "Needles_J",
    studio: "Void NYC"
  },
  {
    date: "NOV 04",
    entry: "Used the Cover-Up engine on a difficult tribal piece today. Client was amazed at the geometric blackout options.",
    artist: "K. Sato",
    studio: "Tokyo Ink"
  },
  {
    date: "NOV 18",
    entry: "AR Try-On helped close a full sleeve deal. Being able to show them the flow on their own arm is powerful.",
    artist: "M. Thorne",
    studio: "Iron & Blood"
  },
  {
    date: "DEC 01",
    entry: "Finally a tool that understands flow. Not just generating images, but actual tattooable designs.",
    artist: "Elena R.",
    studio: "Berlin Art"
  },
  {
    date: "DEC 15",
    entry: "Generated a sick Neo-Trad wolf. The shading reference was perfect for my needle depth.",
    artist: "S. O'Connor",
    studio: "Dublin Ink"
  },
  {
    date: "DEC 22",
    entry: "My apprentice uses this to study composition. It's like having a master artist guiding the layout.",
    artist: "Master Chen",
    studio: "Shanghai"
  },
];

export const Gallery: React.FC = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 2; // 1 log per page side
  const totalPages = Math.ceil(allLogs.length / itemsPerPage);

  const nextPage = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentLogs = allLogs.slice(page * itemsPerPage, (page * itemsPerPage) + itemsPerPage);
  const leftLog = currentLogs[0];
  const rightLog = currentLogs[1];

  return (
    <section id="gallery" className="w-full min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden p-4 sm:p-6 py-20 sm:py-24">
       
       {/* High-End Desk Texture */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] opacity-100"></div>
       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

       {/* Title */}
       <div className="absolute top-16 sm:top-20 md:top-24 z-30 text-center px-4">
          <h2 className="text-premium text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2">Studio Archives</h2>
          <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-zinc-800 mx-auto"></div>
       </div>

       {/* The Portfolio Book */}
       <div className="relative w-full max-w-5xl aspect-[1.6/1] rounded-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex overflow-hidden z-20 mt-16 sm:mt-20">
          
          {/* Leather Cover Texture Effect via CSS */}
          <div className="absolute inset-0 bg-[#1c1c1c] border-4 sm:border-6 md:border-8 border-[#151515] rounded-lg"></div>

          {/* Spine Shadow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 z-30 bg-gradient-to-r from-black/0 via-black/40 to-black/0 pointer-events-none mix-blend-multiply"></div>

          <AnimatePresence mode="wait">
            <motion.div 
               key={page}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="relative z-10 w-full h-full flex"
            >
              {/* Left Page */}
              <div className="w-1/2 bg-[#f0ebe0] m-2 sm:m-3 mr-0 rounded-l-sm shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                 {/* Paper Grain */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-80 mix-blend-multiply"></div>
                 
                 <div className="relative p-4 sm:p-6 md:p-12 h-full flex flex-col justify-center overflow-y-auto">
                    {leftLog && (
                      <>
                        <div className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3 opacity-60">
                           <Quote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black" />
                           <div className="h-px bg-black flex-grow"></div>
                        </div>
                        <p className="font-serif text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-zinc-900 leading-tight mb-4 sm:mb-6 md:mb-8 italic">
                           "{leftLog.entry}"
                        </p>
                        <div className="mt-auto">
                           <div className="text-[10px] sm:text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-1">Artist Signature</div>
                           <div className="font-hand text-xl sm:text-2xl md:text-3xl text-black rotate-[-2deg]">{leftLog.artist}</div>
                           <div className="text-[9px] sm:text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest mt-1">{leftLog.studio} • {leftLog.date}</div>
                        </div>
                      </>
                    )}
                 </div>
              </div>

              {/* Right Page */}
              <div className="w-1/2 bg-[#f0ebe0] m-2 sm:m-3 ml-0 rounded-r-sm shadow-[inset_20px_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                 {/* Paper Grain */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-80 mix-blend-multiply"></div>
                 
                 <div className="relative p-4 sm:p-6 md:p-12 h-full flex flex-col justify-center overflow-y-auto">
                    {rightLog && (
                      <>
                        <div className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3 opacity-60">
                           <Quote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black" />
                           <div className="h-px bg-black flex-grow"></div>
                        </div>
                        <p className="font-serif text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-zinc-900 leading-tight mb-4 sm:mb-6 md:mb-8 italic">
                           "{rightLog.entry}"
                        </p>
                        <div className="mt-auto text-right">
                           <div className="text-[10px] sm:text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-1">Artist Signature</div>
                           <div className="font-hand text-xl sm:text-2xl md:text-3xl text-black rotate-[2deg] inline-block">{rightLog.artist}</div>
                           <div className="text-[9px] sm:text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest mt-1">{rightLog.studio} • {rightLog.date}</div>
                        </div>
                      </>
                    )}
                    
                    {/* Decorative Stamp */}
                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:left-12 transform -rotate-12 opacity-80 mix-blend-multiply border-2 border-red-800 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                      <span className="text-red-900 font-black text-[9px] sm:text-xs uppercase tracking-widest">Client<br/>Approved</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
       </div>

       {/* Nav Controls */}
       <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 flex gap-3 sm:gap-4 z-40">
          <button onClick={prevPage} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center">
             <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button onClick={nextPage} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center">
             <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
       </div>
    </section>
  );
};