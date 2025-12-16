import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, Share2, Zap, X, Copy } from 'lucide-react';

interface WaitlistModalProps {
  email: string;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ email, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  const handleVIPClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://inkgenius.pro/invite?ref=user123");
    alert("Invite link copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 z-[70] bg-white text-black px-6 py-3 font-mono text-xs uppercase tracking-wider border border-zinc-200 shadow-xl"
          >
            Pass Limit Reached. Use Speed Boost.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-black border border-zinc-800 shadow-2xl z-60 flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors z-50">
          <X className="w-6 h-6" />
        </button>

        {/* Left: Status */}
        <div className="w-full md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col justify-center">
            <div className="text-zinc-500 font-mono text-xs uppercase mb-2">Queue Status</div>
            <div className="text-5xl font-bold text-white mb-6">#1,482</div>
            <div className="p-4 border border-zinc-800 bg-black">
               <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-white shrink-0" />
                  <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                    GPU CLUSTER LOAD: 98%<br/>
                    ESTIMATED WAIT: 14 DAYS
                  </p>
               </div>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="w-full md:w-7/12 p-8">
           <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Expedite Process</h3>
           
           <div className="space-y-4">
              {/* Option 1 */}
              <div className="p-6 border border-zinc-800 hover:border-zinc-600 transition-colors bg-black group">
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="text-white font-bold uppercase text-sm">Community Boost</h4>
                    <span className="text-zinc-500 font-mono text-xs">FREE</span>
                 </div>
                 <p className="text-zinc-400 text-xs mb-4">Jump 500 spots for every artist you invite.</p>
                 <button 
                   id="btn-share-viral"
                   onClick={handleShare}
                   className="w-full py-2 border border-zinc-700 text-zinc-300 text-xs uppercase hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2"
                 >
                    <Copy className="w-3 h-3" /> Copy Link
                 </button>
              </div>

              {/* Option 2 */}
              <div className="p-6 border border-white/20 bg-zinc-900/50 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2">
                    <Zap className="w-4 h-4 text-white" />
                 </div>
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="text-white font-bold uppercase text-sm">Priority Access</h4>
                    <span className="text-white font-mono text-xs">$9.90</span>
                 </div>
                 <p className="text-zinc-300 text-xs mb-4">Bypass queue. Immediate GPU allocation.</p>
                 <button 
                   id="btn-buy-attempt"
                   onClick={handleVIPClick}
                   className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                 >
                    Unlock Instant
                 </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};