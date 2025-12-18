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
    const callbackUser = handleAuthCallback();
    if (callbackUser) {
      console.log('✅ AuthProvider - User logged in:', callbackUser);
      setUserState(callbackUser);
      // 清除 URL 中的参数并重定向到首页
      if (window.location.pathname === '/auth/success' || window.location.search.includes('email=')) {
        const cleanUrl = window.location.origin + window.location.pathname.replace('/auth/success', '/');
        window.history.replaceState({}, document.title, cleanUrl);
      }
      return;
    }

    // 否则从 localStorage 加载用户信息
    const savedUser = getUser();
    if (savedUser) {
      console.log('📦 AuthProvider - Loaded user from localStorage:', savedUser);
      setUserState(savedUser);
    } else {
      console.log('ℹ️ AuthProvider - No user found');
    }
  }, []);

  // 监听 URL 变化，处理登录回调（用于处理直接访问 /auth/success 的情况）
  useEffect(() => {
    const checkAuthCallback = () => {
      // 只在有查询参数时检查
      if (window.location.search) {
        const callbackUser = handleAuthCallback();
        if (callbackUser) {
          console.log('✅ AuthProvider - User logged in (URL change):', callbackUser);
          setUserState(callbackUser);
          if (window.location.pathname === '/auth/success' || window.location.search.includes('email=')) {
            const cleanUrl = window.location.origin + window.location.pathname.replace('/auth/success', '/');
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      }
    };

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', checkAuthCallback);
    
    // 也监听 location 变化（用于单页应用路由）
    const interval = setInterval(() => {
      if (window.location.search && !user) {
        checkAuthCallback();
      }
    }, 100);

    return () => {
      window.removeEventListener('popstate', checkAuthCallback);
      clearInterval(interval);
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
