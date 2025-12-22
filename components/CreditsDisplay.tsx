import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface UserCredits {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
  lastEarnedAt?: string;
  lastSpentAt?: string;
}

interface CreditsDisplayProps {
  className?: string;
}

export const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  // 获取用户积分信息
  const fetchUserCredits = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/credits/by-email/${encodeURIComponent(user.email)}`);
      const data = await response.json();

      if (data.success) {
        setCredits(data.data);
        console.log('✅ 获取用户积分成功:', data.data);
      } else {
        setError(data.message || '获取积分信息失败');
        console.error('❌ 获取积分失败:', data.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误';
      setError(errorMessage);
      console.error('❌ 获取积分错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 当用户登录状态改变时获取积分
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchUserCredits();
    } else {
      setCredits(null);
      setError(null);
    }
  }, [isAuthenticated, user?.email]);

  // 如果用户未登录，不显示积分
  if (!isAuthenticated || !user) {
    return null;
  }

  // 加载状态
  if (loading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 border border-zinc-700 rounded hover:border-zinc-600 transition-colors ${className}`}>
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide">
          Loading...
        </span>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 border border-red-700 rounded hover:border-red-600 transition-colors ${className}`}>
        <Coins className="w-4 h-4 text-red-400" />
        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wide">
          Error
        </span>
      </div>
    );
  }

  // 显示积分
  return (
    <div className={`flex items-center gap-2 px-3 py-2 border border-zinc-700 rounded hover:border-zinc-600 transition-colors cursor-pointer group ${className}`}>
      <Coins className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide leading-none">
          Credits
        </span>
        <span className="text-sm font-bold text-white leading-none">
          {credits?.credits?.toLocaleString() || '0'}
        </span>
      </div>
      
      {/* 悬停时显示更多信息 */}
      <div className="hidden group-hover:block absolute top-full right-0 mt-2 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 min-w-[200px]">
        <div className="text-xs text-zinc-300 space-y-2">
          <div className="flex justify-between">
            <span>当前积分:</span>
            <span className="text-yellow-400 font-bold">{credits?.credits?.toLocaleString()}</span>
          </div>
          {credits?.lastEarnedAt && (
            <div className="flex justify-between items-center">
              <span>最后获得:</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">
                  {new Date(credits.lastEarnedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          {credits?.lastSpentAt && (
            <div className="flex justify-between items-center">
              <span>最后消费:</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-400" />
                <span className="text-red-400">
                  {new Date(credits.lastSpentAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <div className="pt-2 border-t border-zinc-700">
            <button 
              onClick={() => {/* TODO: 打开积分详情页面 */}}
              className="text-blue-400 hover:text-blue-300 text-xs"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};