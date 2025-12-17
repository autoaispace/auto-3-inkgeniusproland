import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Showcase } from './components/Showcase';
import { Gallery } from './components/Gallery';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { EmailModal } from './components/EmailModal';
import { WaitlistModal } from './components/WaitlistModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ContactSupport } from './components/ContactSupport';
import { AppState, TabMode } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type PageView = 'home' | 'privacy' | 'terms' | 'contact';

// Global Spotlight Component
const Spotlight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay"
      style={{
        background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 100%)`
      }}
    />
  );
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [activeTab, setActiveTab] = useState<TabMode>(TabMode.DESIGN);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const handleStartGeneration = () => {
    setIsToolModalOpen(false);
    setAppState(AppState.LOADING);
  };

  const handleLoadingComplete = () => {
    setAppState(AppState.EMAIL_GATE);
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setAppState(AppState.WAITLIST);
  };

  const handleCloseModal = () => {
    setAppState(AppState.HOME);
  };

  const openToolModal = () => {
    setIsToolModalOpen(true);
  };

  const handleNavigateToPage = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle smooth scroll navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['suite', 'features', 'gallery'].includes(hash)) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-black text-white">
        <PrivacyPolicy onBack={handleBackToHome} />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-black text-white">
        <TermsOfService onBack={handleBackToHome} />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen bg-black text-white">
        <ContactSupport onBack={handleBackToHome} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white selection:bg-white selection:text-black scroll-smooth">
      <Navbar onLaunchClick={openToolModal} />
      <Spotlight />

      <main className={`w-full transition-all duration-500 ${isToolModalOpen ? 'blur-sm scale-95 opacity-50' : ''}`}>
        <div className={`transition-opacity duration-700 ease-in-out ${appState === AppState.LOADING ? 'opacity-0' : 'opacity-100'}`}>
          
          <div className="snap-start h-screen w-full overflow-hidden relative flex flex-col">
            <Hero 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onGenerate={handleStartGeneration} 
            />
          </div>
          
          <div className="snap-start min-h-screen w-full flex items-center bg-black relative border-t border-zinc-900 z-10">
            <Features />
          </div>

          <div className="snap-start min-h-screen w-full flex items-center bg-black relative border-t border-zinc-900 z-10">
            <Showcase />
          </div>
          
          <div className="snap-start min-h-screen w-full flex items-center bg-[#0a0a0a] relative border-t border-zinc-900 z-10">
            <Gallery />
          </div>
          
          <div className="snap-start h-screen w-full flex flex-col relative bg-black border-t border-zinc-900 z-10">
            <CTASection onStartClick={openToolModal} />
            <div className="absolute bottom-0 w-full z-20">
               <Footer onNavigateToPage={handleNavigateToPage} />
            </div>
          </div>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isToolModalOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6"
           >
              <div 
                 className="absolute inset-0 bg-black/95 backdrop-blur-md"
                 onClick={() => setIsToolModalOpen(false)}
              />
              
              {/* Modal Container */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="relative w-full h-full md:max-w-7xl md:h-[85vh] bg-[#050505] border-0 md:border border-zinc-800 shadow-2xl overflow-hidden rounded-none md:rounded-lg flex flex-col"
              >
                 <button 
                   onClick={() => setIsToolModalOpen(false)}
                   className="absolute top-5 right-5 z-50 p-2 bg-black/50 border border-zinc-800 hover:bg-white hover:text-black transition-colors rounded-full backdrop-blur-sm"
                 >
                    <X className="w-5 h-5" />
                 </button>
                 
                 {/* Reuse Hero as Tool Interface with modal mode active */}
                 <div className="w-full h-full">
                    <Hero 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab} 
                      onGenerate={handleStartGeneration}
                      isModal={true}
                    />
                 </div>
              </motion.div>
           </motion.div>
        )}

        {appState === AppState.LOADING && (
          <LoadingScreen onComplete={handleLoadingComplete} key="loading" />
        )}

        {appState === AppState.EMAIL_GATE && (
          <EmailModal 
            key="email-gate"
            onSubmit={handleEmailSubmit} 
            onClose={handleCloseModal}
          />
        )}

        {appState === AppState.WAITLIST && (
          <WaitlistModal 
            key="waitlist"
            email={userEmail}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}