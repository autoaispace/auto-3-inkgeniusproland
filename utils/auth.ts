// 认证工具函数

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  accessToken?: string; // 添加访问token字段
}

// 存储用户信息到 localStorage
export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
  // 单独存储token以便API调用
  if (user.accessToken) {
    localStorage.setItem('supabase_access_token', user.accessToken);
  }
};

// 从 localStorage 获取用户信息
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    // 如果用户信息中没有token，尝试从单独的存储中获取
    if (!user.accessToken) {
      const token = localStorage.getItem('supabase_access_token');
      if (token) {
        user.accessToken = token;
      }
    }
    return user;
  } catch {
    return null;
  }
};

// 获取访问token
export const getAccessToken = (): string | null => {
  const user = getUser();
  if (user?.accessToken) {
    return user.accessToken;
  }
  // 后备方案：从单独的存储中获取
  return localStorage.getItem('supabase_access_token');
};

// 清除用户信息
export const clearUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('supabase_access_token');
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
  const authSuccess = urlParams.get('auth_success');
  const accessToken = urlParams.get('access_token');

  console.log('🔍 Checking auth callback params:', { 
    email, 
    name, 
    id, 
    avatar: !!avatar, 
    authSuccess,
    hasAccessToken: !!accessToken,
    fullUrl: window.location.href 
  });

  if (email && id && authSuccess === 'true') {
    const user: User = {
      id,
      email: decodeURIComponent(email),
      name: name ? decodeURIComponent(name) : undefined,
      avatar: avatar ? decodeURIComponent(avatar) : undefined,
      accessToken: accessToken || undefined,
    };
    
    console.log('🔐 Auth callback - User info received:', {
      ...user,
      accessToken: user.accessToken ? '***' : undefined // 隐藏token内容
    });
    setUser(user);
    
    return user;
  }
  
  console.log('⚠️ Auth callback - Missing required params or auth_success flag:', { 
    hasEmail: !!email, 
    hasId: !!id, 
    authSuccess 
  });
  return null;
};
