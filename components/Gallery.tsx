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
    <section className="w-full h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden p-6">
       
       {/* High-End Desk Texture */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] opacity-100"></div>
       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

       {/* Title */}
       <div className="absolute top-24 z-30 text-center">
          <h2 className="text-premium text-2xl font-bold uppercase tracking-[0.3em] mb-2">Studio Archives</h2>
          <div className="w-12 h-1 bg-zinc-800 mx-auto"></div>
       </div>

       {/* The Portfolio Book */}
       <div className="relative w-full max-w-5xl aspect-[1.6/1] rounded-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex overflow-hidden z-20">
          
          {/* Leather Cover Texture Effect via CSS */}
          <div className="absolute inset-0 bg-[#1c1c1c] border-8 border-[#151515] rounded-lg"></div>

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
              <div className="w-1/2 bg-[#f0ebe0] m-3 mr-0 rounded-l-sm shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                 {/* Paper Grain */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-80 mix-blend-multiply"></div>
                 
                 <div className="relative p-12 h-full flex flex-col justify-center">
                    {leftLog && (
                      <>
                        <div className="mb-6 flex items-center gap-3 opacity-60">
                           <Quote className="w-8 h-8 text-black" />
                           <div className="h-px bg-black flex-grow"></div>
                        </div>
                        <p className="font-serif text-3xl md:text-4xl text-zinc-900 leading-tight mb-8 italic">
                           "{leftLog.entry}"
                        </p>
                        <div className="mt-auto">
                           <div className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-1">Artist Signature</div>
                           <div className="font-hand text-3xl text-black rotate-[-2deg]">{leftLog.artist}</div>
                           <div className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest mt-1">{leftLog.studio} • {leftLog.date}</div>
                        </div>
                      </>
                    )}
                 </div>
              </div>

              {/* Right Page */}
              <div className="w-1/2 bg-[#f0ebe0] m-3 ml-0 rounded-r-sm shadow-[inset_20px_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                 {/* Paper Grain */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-80 mix-blend-multiply"></div>
                 
                 <div className="relative p-12 h-full flex flex-col justify-center">
                    {rightLog && (
                      <>
                        <div className="mb-6 flex items-center gap-3 opacity-60">
                           <Quote className="w-8 h-8 text-black" />
                           <div className="h-px bg-black flex-grow"></div>
                        </div>
                        <p className="font-serif text-3xl md:text-4xl text-zinc-900 leading-tight mb-8 italic">
                           "{rightLog.entry}"
                        </p>
                        <div className="mt-auto text-right">
                           <div className="text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-1">Artist Signature</div>
                           <div className="font-hand text-3xl text-black rotate-[2deg] inline-block">{rightLog.artist}</div>
                           <div className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest mt-1">{rightLog.studio} • {rightLog.date}</div>
                        </div>
                      </>
                    )}
                    
                    {/* Decorative Stamp */}
                    <div className="absolute bottom-12 left-12 transform -rotate-12 opacity-80 mix-blend-multiply border-2 border-red-800 rounded px-2 py-1">
                      <span className="text-red-900 font-black text-xs uppercase tracking-widest">Client<br/>Approved</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
       </div>

       {/* Nav Controls */}
       <div className="absolute bottom-12 flex gap-4 z-40">
          <button onClick={prevPage} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center">
             <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={nextPage} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center">
             <ArrowRight className="w-4 h-4" />
          </button>
       </div>
    </section>
  );
};