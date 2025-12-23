import React, { useState, useEffect } from 'react';
import { Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface CreditsDisplayProps {
  className?: string;
  showRefreshButton?: boolean;
}

const CreditsDisplayMongoDB: React.FC<CreditsDisplayProps> = ({ 
  className = '', 
  showRefreshButton = true 
}) => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 获取用户积分
  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(null);

      // 从localStorage获取token
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('用户未登录');
      }

      const user = JSON.parse(userStr);
      const token = user.access_token || user.session?.access_token;
      
      if (!token) {
        throw new Error('未找到访问令牌');
      }

      console.log('🔄 从MongoDB获取用户积分...');

      const response = await fetch('/api/payment/user/credits', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCredits(data.data.credits);
        setLastUpdated(data.data.lastUpdated);
        console.log('✅ 积分获取成功:', data.data.credits);
      } else {
        throw new Error(data.message || '获取积分失败');
      }

    } catch (err) {
      console.error('❌ 获取积分失败:', err);
      setError(err instanceof Error ? err.message : '获取积分失败');
      
      // 如果API失败，尝试从localStorage获取（兜底）
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const fallbackCredits = user.user_metadata?.credits || 0;
          setCredits(fallbackCredits);
          console.log('⚠️ 使用localStorage中的积分:', fallbackCredits);
        }
      } catch (fallbackError) {
        console.error('❌ 兜底获取积分也失败:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取积分
  useEffect(() => {
    fetchCredits();
  }, []);

  // 手动刷新积分
  const handleRefresh = () => {
    fetchCredits();
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
        <span className="text-sm text-gray-600">加载积分中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-600">积分加载失败</span>
        {showRefreshButton && (
          <button
            onClick={handleRefresh}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            重试
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="font-medium text-gray-900">
          {credits.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">积分</span>
      </div>
      
      {showRefreshButton && (
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="刷新积分"
        >
          <RefreshCw className="w-3 h-3 text-gray-400 hover:text-gray-600" />
        </button>
      )}
      
      {lastUpdated && (
        <span className="text-xs text-gray-400">
          更新于 {new Date(lastUpdated).toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default CreditsDisplayMongoDB;