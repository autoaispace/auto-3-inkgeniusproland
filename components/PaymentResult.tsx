import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Zap, ArrowRight } from 'lucide-react';

interface PaymentResultProps {
  type: 'success' | 'cancel' | 'error';
  paymentId?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({
  type,
  paymentId,
  onClose,
  onRetry
}) => {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'success' && paymentId) {
      fetchPaymentDetails();
    }
  }, [type, paymentId]);

  const fetchPaymentDetails = async () => {
    if (!paymentId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
      
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'cancel':
        return <XCircle className="w-16 h-16 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return '支付成功！';
      case 'cancel':
        return '支付已取消';
      case 'error':
        return '支付失败';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'success':
        return '您的积分已成功充值到账户中';
      case 'cancel':
        return '您已取消支付，可以重新选择套餐';
      case 'error':
        return '支付过程中出现错误，请重试';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'success':
        return '继续使用';
      case 'cancel':
        return '重新购买';
      case 'error':
        return '重试';
    }
  };

  const handleAction = () => {
    switch (type) {
      case 'success':
        onClose?.();
        break;
      case 'cancel':
      case 'error':
        onRetry?.();
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {getTitle()}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {getMessage()}
        </p>

        {/* Payment Details */}
        {type === 'success' && paymentDetails && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">积分充值详情</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">套餐：</span>
                <span className="font-medium">{paymentDetails.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">积分：</span>
                <span className="font-medium">
                  {paymentDetails.credits.toLocaleString()}
                  {paymentDetails.bonusCredits > 0 && (
                    <span className="text-green-600">
                      {' '}+ {paymentDetails.bonusCredits.toLocaleString()} 奖励
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">支付金额：</span>
                <span className="font-medium">
                  ${paymentDetails.amount.toFixed(2)} {paymentDetails.currency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">加载支付详情...</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {type !== 'success' && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
          )}
          <button
            onClick={handleAction}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              type === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : type === 'cancel'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {getButtonText()}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Additional Info */}
        {type === 'success' && (
          <p className="text-xs text-gray-500 mt-4">
            积分已自动添加到您的账户，您可以立即开始使用
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;