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
      setUserState(callbackUser);
      return;
    }

    // 否则从 localStorage 加载用户信息
    const savedUser = getUser();
    if (savedUser) {
      setUserState(savedUser);
    }
  }, []);

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
