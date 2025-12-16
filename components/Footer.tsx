import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-zinc-500 text-sm">
          © 2025 InkGenius Pro. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
          <a href="mailto:support@digworldai.com" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};