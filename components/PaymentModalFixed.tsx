import React, { useState, useEffect } from 'react';
import { X, Zap, Star, Check, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

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

type PaymentStep = 'select' | 'waiting' | 'completed';

const PaymentModalFixed: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userEmail: propUserEmail,
  onPaymentSuccess
}) => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('select');
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
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
    console.log('🔄 PaymentModalFixed 初始化 - 版本 2.0');
    
    if (isOpen) {
      console.log('✅ 支付模态框打开');
      setPackages(creditPackages);
      
      // 默认选择热门套餐
      const popularPackage = creditPackages.find(pkg => pkg.popular);
      if (popularPackage) {
        setSelectedPackage(popularPackage.id);
      }
      
      setCurrentStep('select');
      setError(null);
    }
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
    console.log('🚀 PaymentModalFixed handlePurchase 开始 - 强制获取用户信息');
    
    if (!selectedPackage) {
      console.log('❌ 没有选中套餐');
      setError('请选择积分套餐');
      return;
    }
    
    // 强制从 localStorage 获取用户信息
    console.log('🔍 强制从 localStorage 获取用户信息...');
    const userStr = localStorage.getItem('user');
    console.log('📄 localStorage.user:', userStr);
    
    if (!userStr) {
      console.log('❌ localStorage 中没有用户信息');
      setError('请先登录 - localStorage 中没有用户信息');
      return;
    }
    
    let userEmail, userId;
    
    try {
      const user = JSON.parse(userStr);
      console.log('👤 解析的用户对象:', user);
      
      userEmail = user.email || user.user_email;
      userId = user.id || user.user_id || user.sub;
      
      console.log('📧 提取的邮箱:', userEmail);
      console.log('🆔 提取的用户ID:', userId);
      
    } catch (e) {
      console.log('❌ 解析用户对象失败:', e.message);
      setError('用户信息解析失败: ' + e.message);
      return;
    }
    
    if (!userEmail) {
      console.log('❌ 用户对象中没有邮箱字段');
      setError('用户信息中缺少邮箱');
      return;
    }

    console.log('✅ 用户信息验证通过，开始支付流程');

    setLoading(true);
    setError(null);

    try {
      // 找到选中的套餐
      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      if (!selectedPkg) {
        throw new Error('未找到选中的套餐');
      }

      console.log('📦 选中的套餐:', selectedPkg);

      // 构建 Whop 支付链接
      const baseUrl = 'https://whop.com/8429d376-ddb2-4fb6-bebf-b81b25deff04/test-7d-00b2/';
      const params = new URLSearchParams({
        'metadata[user_id]': userId || '6948dc4897532de886ec876d',
        'metadata[user_email]': userEmail,
        'metadata[package_id]': selectedPackage,
        'metadata[credits]': selectedPkg.credits.toString(),
      });
      
      const checkoutUrl = `${baseUrl}?${params.toString()}`;
      
      console.log('🔗 PaymentModalFixed 生成的支付链接:', checkoutUrl);
      
      // 保存当前支付信息
      setCurrentPayment({
        package: {
          name: selectedPkg.name,
          credits: selectedPkg.credits,
          bonusCredits: selectedPkg.bonus || 0,
          amount: selectedPkg.price,
          currency: selectedPkg.currency
        }
      });
      
      console.log('🪟 打开支付窗口...');
      
      // 打开支付窗口
      const newWindow = window.open(
        checkoutUrl,
        'whop-payment',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );
      
      if (newWindow) {
        console.log('✅ 支付窗口已打开');
        setPaymentWindow(newWindow);
        setCurrentStep('waiting');
      } else {
        console.log('⚠️ 弹窗被阻止，直接跳转');
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('❌ 支付创建失败:', error);
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
                  <ExternalLink className="w-4 h-4" />
                  立即购买 (Fixed)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderWaitingStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">等待支付</h2>
          <p className="text-gray-600 mt-1">请在新窗口中完成支付</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Waiting Content */}
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <Clock className="w-16 h-16 text-blue-500 animate-pulse" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          支付窗口已打开
        </h3>
        
        <p className="text-gray-600 mb-6">
          请在新打开的窗口中完成支付流程
        </p>

        {currentPayment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <div>套餐：{currentPayment.package.name}</div>
              <div>积分：{currentPayment.package.credits.toLocaleString()}</div>
              {currentPayment.package.bonusCredits > 0 && (
                <div className="text-green-600">
                  奖励：+{currentPayment.package.bonusCredits.toLocaleString()} 积分
                </div>
              )}
              <div>金额：{formatPrice(currentPayment.package.amount, currentPayment.package.currency)}</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            支付完成后，积分将自动充值到您的账户
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePaymentCompleted}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              已完成支付
            </button>
            
            <button
              onClick={handlePaymentFailed}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              支付遇到问题
            </button>
          </div>
        </div>
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

        {currentPayment && (
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

  // 渲染时的调试信息
  console.log('🎨 PaymentModalFixed 渲染 - 版本 2.0');

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
        {currentStep === 'waiting' && renderWaitingStep()}
        {currentStep === 'completed' && renderCompletedStep()}
      </div>
    </div>
  );
};

export default PaymentModalFixed;