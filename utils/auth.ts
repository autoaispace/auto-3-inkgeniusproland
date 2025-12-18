// 认证工具函数

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// 存储用户信息到 localStorage
export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// 从 localStorage 获取用户信息
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// 清除用户信息
export const clearUser = () => {
  localStorage.removeItem('user');
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};

// 启动 Google 登录
export const loginWithGoogle = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};

// 登出
export const logout = async () => {
  try {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearUser();
    window.location.reload();
  }
};

// 处理登录成功回调（从 URL 参数中获取用户信息）
export const handleAuthCallback = (): User | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const name = urlParams.get('name');
  const id = urlParams.get('id');
  const avatar = urlParams.get('avatar');

  console.log('🔍 Checking auth callback params:', { email, name, id, avatar: !!avatar });

  if (email && id) {
    const user: User = {
      id,
      email: decodeURIComponent(email),
      name: name ? decodeURIComponent(name) : undefined,
      avatar: avatar ? decodeURIComponent(avatar) : undefined,
    };
    
    console.log('🔐 Auth callback - User info received:', user);
    setUser(user);
    
    return user;
  }
  
  console.log('⚠️ Auth callback - Missing required params (email or id)');
  return null;
};
