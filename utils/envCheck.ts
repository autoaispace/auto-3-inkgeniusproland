// 环境变量检查工具
export const checkEnvironment = () => {
  const env = {
    // Vite 环境变量
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    
    // React 环境变量（通过 define 传递）
    REACT_APP_API_URL: (globalThis as any).process?.env?.REACT_APP_API_URL,
    
    // 运行时环境
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };
  
  console.log('🔍 Environment Check:', env);
  
  // 确定最终使用的API URL
  const apiUrl = env.VITE_API_URL || 
                 env.VITE_BACKEND_URL || 
                 env.REACT_APP_API_URL || 
                 'https://inkgeniusapi.digworldai.com';
  
  console.log('🌐 Final API URL:', apiUrl);
  
  return {
    ...env,
    finalApiUrl: apiUrl
  };
};

// 在开发环境下自动运行检查
if (import.meta.env.DEV) {
  checkEnvironment();
}