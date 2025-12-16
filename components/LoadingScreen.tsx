import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  useEffect(() => {
    const duration = 2500; 
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep === 5) addLog("Initializing neural tensor cores...");
      if (currentStep === 20) addLog("Analyzing input vector geometry...");
      if (currentStep === 35) addLog("Optimizing contrast thresholds...");
      if (currentStep === 45) addLog("Generating latent noise patterns...");
      if (currentStep === 60) addLog("Refining contour edges...");
      if (currentStep === 75) addLog("Upscaling to 4K resolution...");
      if (currentStep === 90) addLog("Finalizing output buffer...");

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <div className="w-full max-w-lg p-8 border border-zinc-800 bg-zinc-950 font-mono text-sm">
         <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-2">
            <span className="animate-pulse text-white">PROCESSING</span>
            <span className="text-zinc-500">{Math.round(progress)}%</span>
         </div>
         
         <div className="h-32 flex flex-col justify-end gap-1 text-zinc-400 mb-6">
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs">
                {log}
              </motion.div>
            ))}
         </div>

         <div className="w-full h-1 bg-zinc-900">
           <motion.div 
             className="h-full bg-white"
             style={{ width: `${progress}%` }}
           />
         </div>
      </div>
    </motion.div>
  );
};