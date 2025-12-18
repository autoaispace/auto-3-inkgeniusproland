import React from 'react';

interface FooterProps {
  onNavigateToPage?: (page: 'privacy' | 'terms' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToPage }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, page: 'privacy' | 'terms' | 'contact') => {
    e.preventDefault();
    if (onNavigateToPage) {
      onNavigateToPage(page);
    }
  };

  return (
    <footer className="bg-black/50 border-t border-white/5 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="text-zinc-500 text-xs sm:text-sm text-center md:text-left">
          © 2025 InkGenius Pro. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          <a 
            href="#" 
            onClick={(e) => handleClick(e, 'privacy')}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            onClick={(e) => handleClick(e, 'terms')}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            onClick={(e) => handleClick(e, 'contact')}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};