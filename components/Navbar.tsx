import React, { useState } from 'react';
import { Menu, Zap, Star, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { CreditsDisplay } from './CreditsDisplay';

interface NavbarProps {
  onLaunchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleNavClick = (item: string) => {
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Section with Social Proof */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 cursor-pointer group">
              <div className="relative">
                 <div className="w-8 h-8 md:w-10 md:h-10 bg-black border border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:border-white transition-colors">
                    <span className="font-gothic text-2xl md:text-3xl text-white pt-1">I</span>
                 </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-serif font-bold italic tracking-wide text-white leading-none">
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
                  handleNavClick(item);
                }}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors font-mono"
              >
                {item}
              </a>
            ))}
            
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 border border-zinc-700 rounded hover:border-zinc-600 transition-colors">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || user.email} 
                        className="w-6 h-6 rounded-full object-cover border border-zinc-600"
                        onError={(e) => {
                          // 如果图片加载失败，显示默认图标
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    )}
                    <span className="text-[10px] font-mono text-zinc-300 hidden lg:inline max-w-[120px] truncate">
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </div>
                  
                  {/* 积分显示组件 */}
                  <CreditsDisplay />
                  
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:text-zinc-300 transition-all flex items-center gap-2 border border-zinc-700 hover:border-zinc-500"
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="px-4 py-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:text-zinc-300 transition-all flex items-center gap-2 border border-zinc-700 hover:border-zinc-500"
                >
                  <LogIn className="w-3 h-3" />
                  Login
                </button>
              )}
              
              <button
                id="nav-btn-start"
                onClick={onLaunchClick}
                className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-2 border border-white"
              >
                <Zap className="w-3 h-3 fill-black" />
                Launch
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-1.5 px-2 py-1.5 border border-zinc-700 rounded">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name || user.email} 
                      className="w-5 h-5 rounded-full object-cover border border-zinc-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                      <User className="w-3 h-3 text-zinc-400" />
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-zinc-300 hidden sm:inline max-w-[80px] truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
                
                {/* 移动端积分显示 */}
                <CreditsDisplay className="hidden sm:flex" />
                
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:text-zinc-300 transition-all flex items-center gap-1 border border-zinc-700"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-2.5 py-1.5 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:text-zinc-300 transition-all flex items-center gap-1 border border-zinc-700"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
            {onLaunchClick && (
              <button
                onClick={onLaunchClick}
                className="px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 fill-black" />
                <span className="hidden sm:inline">Launch</span>
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-zinc-300 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              {['Suite', 'Features', 'Gallery'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className="block text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors font-mono py-2"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};