import React from 'react';
import { motion } from 'framer-motion';

export const InkBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Abstract Needle Lines */}
      <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
         <motion.path 
           d="M0,20 Q50,5 100,20" 
           stroke="white" 
           strokeWidth="0.2" 
           fill="none"
           animate={{ d: ["M0,20 Q50,5 100,20", "M0,20 Q50,35 100,20", "M0,20 Q50,5 100,20"] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.path 
           d="M0,80 Q50,95 100,80" 
           stroke="white" 
           strokeWidth="0.2" 
           fill="none"
           animate={{ d: ["M0,80 Q50,95 100,80", "M0,80 Q50,65 100,80", "M0,80 Q50,95 100,80"] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         />
      </svg>

      {/* Ink Splatters */}
      <motion.div 
        className="absolute top-[-10%] left-[10%] w-[1px] bg-zinc-800"
        style={{ height: '40vh' }}
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
       <motion.div 
        className="absolute top-[-5%] right-[20%] w-[1px] bg-zinc-800"
        style={{ height: '60vh' }}
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 5 }}
      />
    </div>
  );
};