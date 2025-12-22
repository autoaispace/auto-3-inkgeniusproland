import React, { useState, useEffect } from 'react';
import { X, Zap, Star, Check, ExternalLink, Clock, CheckCircle, XCircle, Sparkles, Shield, CreditCard } from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  popular: boolean;
  bonus?: number;
  originalPrice?: number;
  savings?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onPaymentSuccess?: (credits: number) => void;
}

type PaymentStep = 'select' | 'waiting' | 'completed';

const PaymentModalOptimized: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onPaymentSuccess
}) => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('select');
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [currentPayment, setCurrentPayment] = useState<any>(null);

  // 优化的套餐数据
  const creditPackages: CreditPackage[] = [
    {
      id: 'credits_100',
      name: 'Starter',
      credits: 100,
      price: 1.00,
      currency: 'USD',
      description: '适合初次体验',
      popular: false
    },
    {
      id: 'credits_1000',
      name: 'Popular',
      credits: 1000,
      price: 10.00,
      currency: 'USD',
      description: '最受欢迎的选择',
      popular: true,
      savings: '最佳性价比'
    },
    {
      id: 'credits_15000',
      name: 'Pro',
      credits: 15000,
      price: 100.00,
      originalPrice: 150.00,
      currency: 'USD',
      description: '专业用户首选',
      popular: false,
      bonus: 5000,
      savings: '节省 $50'
    }
  ];

  // 初始化套餐数据
  useEffect(() => {
    if (isOpen) {
      setPackages(creditPackages);
      // 默认选择热门套餐
      const popularPackage = creditPackages.find(pkg => pkg.popular);
      if (popularPackage) {
        setSelectedPackage(popularPackage.id);
      }
      setCurrentStep('select');
      setError(null);
      
      // 锁定背景页面滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复背景页面滚动
      document.body.style.overflow = 'unset';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 监听支付窗口关闭
  useEffect(() => {
    if (paymentWindow) {
      const checkClosed = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkClosed);
          setPaymentWindow(null);
        }
      }, 1000);

      return () => clearInterval(checkClosed);
    }
  }, [paymentWindow]);

  const handlePurchase = async () => {
    if (!selectedPackage || !userEmail) {
      setError('请选择套餐并确保已登录');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
      
      if (!token) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      const apiUrl = 'https://inkgeniusapi.digworldai.com';

      const response = await fetch(`${apiUrl}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data?.checkoutUrl) {
        setCurrentPayment(data.data);
        
        const newWindow = window.open(
          data.data.checkoutUrl,
          'whop-payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );
        
        if (newWindow) {
          setPaymentWindow(newWindow);
          setCurrentStep('waiting');
        } else {
          window.location.href = data.data.checkoutUrl;
        }
      } else {
        throw new Error(data.message || '创建支付失败');
      }
    } catch (error) {
      console.error('❌ Payment creation failed:', error);
      setError(`支付创建失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompleted = () => {
    setCurrentStep('completed');
    if (onPaymentSuccess && currentPayment) {
      const totalCredits = currentPayment.package.credits + (currentPayment.package.bonusCredits || 0);
      onPaymentSuccess(totalCredits);
    }
  };

  const handleClose = () => {
    // 恢复背景页面滚动
    document.body.style.overflow = 'unset';
    onClose();
  };

  const handlePaymentFailed = () => {
    setCurrentStep('select');
    setError('支付未完成，请重试或联系客服');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getPackageIcon = (pkg: CreditPackage) => {
    if (pkg.id === 'credits_100') return '🚀';
    if (pkg.id === 'credits_1000') return '⭐';
    if (pkg.id === 'credits_15000') return '💎';
    return '⚡';
  };

  const renderSelectStep = () => (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-t-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-8 pb-6">
        <div className="text-center flex-1">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              选择积分套餐
            </h2>
          </div>
          <p className="text-gray-600">解锁更多创意可能，开始您的纹身设计之旅</p>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/80 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-8 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Packages Grid */}
      <div className="px-4 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                selectedPackage === pkg.id
                  ? 'scale-105 z-10'
                  : 'hover:scale-102'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" />
                    热门选择
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {pkg.savings && !pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {pkg.savings}
                  </div>
                </div>
              )}

              <div className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-100'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
              }`}>
                {/* Selection Indicator */}
                <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {selectedPackage === pkg.id && (
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" />
                  )}
                </div>

                {/* Package Icon */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl mb-2">{getPackageIcon(pkg)}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{pkg.description}</p>
                </div>

                {/* Credits Display */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {pkg.credits.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">积分</span>
                  </div>
                  
                  {pkg.bonus && (
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs sm:text-sm font-medium">
                        +{pkg.bonus.toLocaleString()} 奖励积分
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-3 sm:mb-4">
                  {pkg.originalPrice && (
                    <div className="text-xs sm:text-sm text-gray-500 line-through mb-1">
                      {formatPrice(pkg.originalPrice, pkg.currency)}
                    </div>
                  )}
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatPrice(pkg.price, pkg.currency)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(pkg.price / (pkg.credits + (pkg.bonus || 0)) * 100).toFixed(2)}¢/积分
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                    <span>永不过期</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                    <span>即时到账</span>
                  </div>
                  {pkg.bonus && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
                      <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                      <span>包含奖励积分</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Whop 安全支付</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>支持多种支付方式</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>积分永不过期</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            稍后再说
          </button>
          <button
            onClick={handlePurchase}
            disabled={!selectedPackage || loading}
            className="flex-1 sm:flex-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                立即购买
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderWaitingStep = () => (
    <div className="text-center p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">等待支付确认</h2>
          <p className="text-gray-600 mt-1">请在新窗口中完成支付</p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Waiting Animation */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <Clock className="absolute inset-0 w-8 h-8 text-blue-500 m-auto" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          支付窗口已打开
        </h3>
        
        <p className="text-gray-600 mb-6">
          请在新打开的窗口中完成支付流程，支付完成后积分将自动充值
        </p>
      </div>

      {/* Payment Details */}
      {currentPayment && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-4">支付详情</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">套餐：</span>
              <span className="font-medium">{currentPayment.package.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">积分：</span>
              <span className="font-medium">{currentPayment.package.credits.toLocaleString()}</span>
            </div>
            {currentPayment.package.bonusCredits > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">奖励积分：</span>
                <span className="font-medium text-green-600">
                  +{currentPayment.package.bonusCredits.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-blue-200 pt-3">
              <span className="text-gray-600">支付金额：</span>
              <span className="font-bold text-lg">
                {formatPrice(currentPayment.package.amount, currentPayment.package.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handlePaymentCompleted}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          已完成支付
        </button>
        
        <button
          onClick={handlePaymentFailed}
          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
        >
          <XCircle className="w-4 h-4" />
          遇到问题
        </button>
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="text-center p-8">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          支付成功！
        </h2>
        
        <p className="text-gray-600 mb-6">
          您的积分已经成功充值，可以立即开始使用
        </p>
      </div>

      {/* Success Details */}
      {currentPayment && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h4 className="font-semibold text-green-800 mb-4">充值成功</h4>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-700">
              +{currentPayment.package.credits.toLocaleString()} 积分
            </div>
            {currentPayment.package.bonusCredits > 0 && (
              <div className="text-lg font-medium text-green-600">
                +{currentPayment.package.bonusCredits.toLocaleString()} 奖励积分
              </div>
            )}
            <div className="text-sm text-green-600 mt-4">
              积分已添加到您的账户，立即生效
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleClose}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
      >
        开始创作
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={handleClose}
    >
      <div className="min-h-screen flex items-start sm:items-center justify-center p-2 sm:p-4 py-4 sm:py-8">
        <div 
          className="bg-white rounded-2xl w-full max-w-6xl my-4 sm:my-8 shadow-2xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {currentStep === 'select' && renderSelectStep()}
          {currentStep === 'waiting' && renderWaitingStep()}
          {currentStep === 'completed' && renderCompletedStep()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModalOptimized;