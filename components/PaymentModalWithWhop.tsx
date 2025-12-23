import React, { useState, useEffect } from 'react';
import { X, Zap, Star, Check, CheckCircle, XCircle } from 'lucide-react';

// 注意：需要安装 @whop/checkout
// npm install @whop/checkout
// import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  popular: boolean;
  bonus?: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onPaymentSuccess?: (credits: number) => void;
}

type PaymentStep = 'select' | 'checkout' | 'completed';

const PaymentModalWithWhop: React.FC<PaymentModalProps> = ({
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPayment, setCurrentPayment] = useState<any>(null);

  // 硬编码套餐数据
  const creditPackages: CreditPackage[] = [
    {
      id: 'credits_100',
      name: '100 积分',
      credits: 100,
      price: 1.00,
      currency: 'USD',
      description: '基础积分包 - 100积分',
      popular: false
    },
    {
      id: 'credits_1000',
      name: '1000 积分',
      credits: 1000,
      price: 10.00,
      currency: 'USD',
      description: '标准积分包 - 1000积分',
      popular: true
    },
    {
      id: 'credits_15000',
      name: '15000 积分',
      credits: 15000,
      price: 100.00,
      currency: 'USD',
      description: '超值积分包 - 15000积分（50%奖励）',
      popular: false,
      bonus: 5000
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
      setSessionId(null);
    }
  }, [isOpen]);

  const handlePurchase = async () => {
    if (!selectedPackage || !userEmail) {
      setError('请选择套餐并确保已登录');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 获取用户token
      const token = localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
      
      if (!token) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      const apiUrl = 'https://inkgeniusapi.digworldai.com';
      console.log('🔄 Creating embedded payment...');

      const response = await fetch(`${apiUrl}/api/payment/create-embedded`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: selectedPackage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Embedded payment created:', data);

      if (data.success && data.data?.sessionId) {
        setSessionId(data.data.sessionId);
        setCurrentPayment(data.data);
        setCurrentStep('checkout');
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

  const handlePaymentComplete = (paymentId: string) => {
    console.log('✅ Payment completed:', paymentId);
    setCurrentStep('completed');
    
    // 触发积分刷新
    if (onPaymentSuccess && currentPayment?.package) {
      const totalCredits = currentPayment.package.credits + (currentPayment.package.bonusCredits || 0);
      onPaymentSuccess(totalCredits);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    setError('支付过程中出现错误，请重试');
    setCurrentStep('select');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getPackageFeatures = (pkg: CreditPackage) => {
    const features = [`${pkg.credits.toLocaleString()} 积分`];
    
    if (pkg.bonus) {
      features.push(`额外赠送 ${pkg.bonus.toLocaleString()} 积分`);
    }
    
    if (pkg.popular) {
      features.push('最受欢迎');
    }
    
    return features;
  };

  const renderSelectStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">购买积分</h2>
          <p className="text-gray-600 mt-1">选择适合您的积分套餐</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Packages */}
      <div className="p-6 space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${pkg.popular ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-6">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  最受欢迎
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPackage === pkg.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {getPackageFeatures(pkg).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <Zap className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(pkg.price, pkg.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  {(pkg.price / (pkg.credits + (pkg.bonus || 0)) * 100).toFixed(2)}¢/积分
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>• 支付安全由 Whop 保障</p>
            <p>• 积分永不过期</p>
            <p>• 支持多种支付方式</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handlePurchase}
              disabled={!selectedPackage || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  立即购买
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderCheckoutStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">完成支付</h2>
          <p className="text-gray-600 mt-1">请填写支付信息</p>
        </div>
        <button
          onClick={() => setCurrentStep('select')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Checkout Content */}
      <div className="p-6">
        {currentPayment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium text-gray-900">订单详情</div>
              <div>套餐：{currentPayment.package.name}</div>
              <div>积分：{currentPayment.package.credits.toLocaleString()}</div>
              {currentPayment.package.bonusCredits > 0 && (
                <div className="text-green-600">
                  奖励：+{currentPayment.package.bonusCredits.toLocaleString()} 积分
                </div>
              )}
              <div className="font-medium text-gray-900">
                金额：{formatPrice(currentPayment.package.amount, currentPayment.package.currency)}
              </div>
            </div>
          </div>
        )}

        {/* Whop Embedded Checkout */}
        {sessionId && (
          <div className="border rounded-lg bg-white">
            {/* 
            真实的 Whop 内嵌支付组件
            需要先安装: npm install @whop/checkout
            */}
            {/*
            <WhopCheckoutEmbed
              sessionId={sessionId}
              returnUrl={`${window.location.origin}/payment/complete`}
              onComplete={handlePaymentComplete}
              onError={handlePaymentError}
            />
            */}
            
            {/* 临时的开发占位符 */}
            <div className="p-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  🚀 准备集成 Whop 支付组件
                </h3>
                <div className="text-blue-800 text-sm space-y-2 mb-4">
                  <p><strong>Session ID:</strong> {sessionId}</p>
                  <p><strong>状态:</strong> 等待集成真实的 Whop 组件</p>
                </div>
                <div className="bg-white border border-blue-300 rounded p-4 text-left">
                  <p className="text-blue-900 font-medium mb-2">集成步骤:</p>
                  <ol className="text-blue-800 text-sm space-y-1">
                    <li>1. 安装依赖: <code className="bg-blue-100 px-1 rounded">npm install @whop/checkout</code></li>
                    <li>2. 导入组件: <code className="bg-blue-100 px-1 rounded">import &#123; WhopCheckoutEmbed &#125; from "@whop/checkout/react"</code></li>
                    <li>3. 替换此占位符为真实组件</li>
                    <li>4. 配置 returnUrl 和回调函数</li>
                  </ol>
                </div>
                
                {/* 开发测试按钮 */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-blue-700">开发测试 - 模拟支付完成：</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handlePaymentComplete(`test_${Date.now()}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      模拟支付成功
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep('select')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      返回选择
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderCompletedStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-green-600">支付成功！</h2>
          <p className="text-gray-600 mt-1">积分已充值到您的账户</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Success Content */}
      <div className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          支付成功完成！
        </h3>
        
        <p className="text-gray-600 mb-6">
          您的积分已经成功充值，可以立即开始使用
        </p>

        {currentPayment?.package && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm space-y-1">
              <div className="font-medium text-green-800">充值详情</div>
              <div className="text-green-700">
                +{currentPayment.package.credits.toLocaleString()} 积分
              </div>
              {currentPayment.package.bonusCredits > 0 && (
                <div className="text-green-600">
                  +{currentPayment.package.bonusCredits.toLocaleString()} 奖励积分
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          继续使用
        </button>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-4"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        inset: 0
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {currentStep === 'select' && renderSelectStep()}
        {currentStep === 'checkout' && renderCheckoutStep()}
        {currentStep === 'completed' && renderCompletedStep()}
      </div>
    </div>
  );
};

export default PaymentModalWithWhop;