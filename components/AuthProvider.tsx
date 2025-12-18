import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getUser, setUser, clearUser, handleAuthCallback, loginWithGoogle, logout as logoutApi } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // 检查 URL 中是否有登录回调参数
    const checkAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const id = urlParams.get('id');
      
      console.log('🔍 AuthProvider - Checking URL params:', { 
        email: !!email, 
        id: !!id, 
        fullSearch: window.location.search,
        pathname: window.location.pathname
      });
      
      if (email && id) {
        const callbackUser = handleAuthCallback();
        if (callbackUser) {
          console.log('✅ AuthProvider - User logged in:', callbackUser);
          setUserState(callbackUser);
          // 清除 URL 中的参数
          const cleanPath = window.location.pathname.replace('/auth/success', '') || '/';
          const cleanUrl = window.location.origin + cleanPath;
          console.log('🧹 Cleaning URL from', window.location.href, 'to', cleanUrl);
          window.history.replaceState({}, document.title, cleanUrl);
          return true;
        } else {
          console.warn('⚠️ AuthProvider - handleAuthCallback returned null');
        }
      }
      return false;
    };

    // 先检查 URL 参数
    if (!checkAuthCallback()) {
      // 如果没有 URL 参数，从 localStorage 加载用户信息
      const savedUser = getUser();
      if (savedUser) {
        console.log('📦 AuthProvider - Loaded user from localStorage:', savedUser);
        setUserState(savedUser);
      } else {
        console.log('ℹ️ AuthProvider - No user found in URL or localStorage');
      }
    }
  }, []);

  // 监听 URL 变化，处理登录回调（处理页面加载后 URL 变化的情况）
  useEffect(() => {
    const handleLocationChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('email') && urlParams.has('id')) {
        const callbackUser = handleAuthCallback();
        if (callbackUser) {
          console.log('✅ AuthProvider - User logged in (location change):', callbackUser);
          setUserState(callbackUser);
          const cleanPath = window.location.pathname.replace('/auth/success', '') || '/';
          const cleanUrl = window.location.origin + cleanPath;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    };

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', handleLocationChange);
    
    // 定期检查 URL 变化（处理重定向后的情况）
    const checkInterval = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('email') && urlParams.has('id') && !user) {
        handleLocationChange();
      }
    }, 500);

    // 5秒后清除定时器（避免无限检查）
    setTimeout(() => clearInterval(checkInterval), 5000);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(checkInterval);
    };
  }, [user]);

  const login = () => {
    loginWithGoogle();
  };

  const logout = async () => {
    clearUser();
    setUserState(null);
    await logoutApi();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
