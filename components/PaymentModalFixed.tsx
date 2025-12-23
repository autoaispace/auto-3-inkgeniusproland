import React, { useState, useEffect } from 'react';
import { X, Zap, Star, Check, ExternalLink, Clock, CheckCircle, XCircle, Sparkles, Shield, CreditCard } from 'lucide-react';
import { div } from 'framer-motion/client';

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

const PaymentModalFixed: React.FC<PaymentModalProps> = ({
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

  // 处理弹窗关闭
  const handleClose = () => {
    // 恢复背景页面滚动
    document.body.style.overflow = 'unset';
    onClose();
  };

  // 初始化套餐数据和页面滚动控制
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        inset: 0
      }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{
          margin: 'auto',
          transform: 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
            {/* 选择套餐步骤 */}
            {currentStep === 'select' && (
              <div className="relative">
                {/* 背景装饰 */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-t-2xl"></div>
                
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 pb-4">
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        选择积分套餐
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600">解锁更多创意可能，开始您的纹身设计之旅</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/80 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Packages Grid */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                              <Star className="w-3 h-3" />
                              热门
                            </div>
                          </div>
                        )}

                        {/* Savings Badge */}
                        {pkg.savings && !pkg.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              {pkg.savings}
                            </div>
                          </div>
                        )}

                        <div className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
                          selectedPackage === pkg.id
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-100'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                        }`}>
                          {/* Selection Indicator */}
                          <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedPackage === pkg.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 group-hover:border-gray-400'
                          }`}>
                            {selectedPackage === pkg.id && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>

                          {/* Package Content */}
                          <div className="text-center">
                            <div className="text-2xl mb-2">{getPackageIcon(pkg)}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h3>
                            <p className="text-xs text-gray-600 mb-3">{pkg.description}</p>
                            
                            {/* Credits */}
                            <div className="mb-3">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span className="text-xl font-bold text-gray-900">
                                  {pkg.credits.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-600">积分</span>
                              </div>
                              
                              {pkg.bonus && (
                                <div className="flex items-center justify-center gap-1 text-green-600">
                                  <Sparkles className="w-3 h-3" />
                                  <span className="text-xs font-medium">
                                    +{pkg.bonus.toLocaleString()} 奖励
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                              {pkg.originalPrice && (
                                <div className="text-xs text-gray-500 line-through mb-1">
                                  {formatPrice(pkg.originalPrice, pkg.currency)}
                                </div>
                              )}
                              <div className="text-2xl font-bold text-gray-900">
                                {formatPrice(pkg.price, pkg.currency)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(pkg.price / (pkg.credits + (pkg.bonus || 0)) * 100).toFixed(2)}¢/积分
                              </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center justify-center gap-1 text-gray-600">
                                <Check className="w-3 h-3 text-green-500" />
                                <span>永不过期</span>
                              </div>
                              <div className="flex items-center justify-center gap-1 text-gray-600">
                                <Check className="w-3 h-3 text-green-500" />
                                <span>即时到账</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 rounded-b-2xl">
                  <div className="flex items-center justify-center gap-6 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>Whop 安全支付</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-blue-500" />
                      <span>多种支付方式</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span>积分永不过期</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      稍后再说
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={!selectedPackage || loading}
                      className="flex-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
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
            )}

            {/* 等待支付步骤 */}
            {currentStep === 'waiting' && (
              <div className="text-center p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">等待支付确认</h2>
                    <p className="text-gray-600 text-sm mt-1">请在新窗口中完成支付</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <Clock className="absolute inset-0 w-6 h-6 text-blue-500 m-auto" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    支付窗口已打开
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    请在新打开的窗口中完成支付流程
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handlePaymentCompleted}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    已完成支付
                  </button>
                  
                  <button
                    onClick={handlePaymentFailed}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    遇到问题
                  </button>
                </div>
              </div>
            )}

            {/* 支付完成步骤 */}
            {currentStep === 'completed' && (
              <div className="text-center p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-green-600 mb-2">
                    支付成功！
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    您的积分已经成功充值，可以立即开始使用
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                >
                  开始创作
                </button>
              </div>
            )}
        </div>
      </div>
  );
};

export default PaymentModalFixed;