import React, { useState, useEffect } from 'react';
import { X, Zap, Star, Check } from 'lucide-react';

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

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onPaymentSuccess
}) => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取积分套餐
  useEffect(() => {
    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/packages`);
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data);
        // 默认选择热门套餐
        const popularPackage = data.data.find((pkg: CreditPackage) => pkg.popular);
        if (popularPackage) {
          setSelectedPackage(popularPackage.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setError('加载套餐失败，请重试');
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !userEmail) {
      setError('请选择套餐并确保已登录');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 获取用户token（这里需要根据你的认证系统调整）
      const token = localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
      
      if (!token) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create`, {
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

      const data = await response.json();

      if (data.success) {
        // 跳转到 Whop 支付页面
        window.location.href = data.data.checkoutUrl;
      } else {
        setError(data.message || '创建支付失败');
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      setError('支付创建失败，请重试');
    } finally {
      setLoading(false);
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
      </div>
    </div>
  );
};

export default PaymentModal;