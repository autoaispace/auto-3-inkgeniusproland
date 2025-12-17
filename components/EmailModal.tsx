import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscribeEmail } from '../utils/api';

interface EmailModalProps {
  onSubmit: (email: string) => void;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await subscribeEmail(email);
      
      if (result.success) {
        setSubmitStatus('success');
        // Call onSubmit after a short delay to show success state
        setTimeout(() => {
          onSubmit(email);
        }, 1000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to subscribe. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-zinc-950 border border-white/20 p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="inline-block p-3 border border-zinc-800 rounded-sm mb-6">
             <Lock className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">Generation Complete</h2>
          <p className="text-zinc-500 text-sm mb-8 font-mono">
            High-fidelity assets rendered. Securely transmit data to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="ARTIST@STUDIO.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-700 text-sm font-mono focus:outline-none focus:border-white transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {submitStatus === 'error' && errorMessage && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-950/20 border border-red-900/50 px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono bg-emerald-950/20 border border-emerald-900/50 px-3 py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription successful!</span>
              </div>
            )}
            
            <button
              type="submit"
              id="form-email-submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full py-3 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Success
                </>
              ) : (
                <>
                  Access Files <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};