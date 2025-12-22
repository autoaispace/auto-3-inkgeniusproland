// 测试 Whop Webhook 的脚本
const crypto = require('crypto');

// 模拟 Whop Webhook 数据
const webhookData = {
  type: 'payment.completed',
  data: {
    id: 'whop_test_payment_123',
    status: 'completed',
    amount: 1000, // 10.00 USD in cents
    currency: 'usd',
    customer_email: 'test@example.com',
    metadata: {
      payment_id: '6948dc488d838d2e3a7dd3f7', // 替换为实际的 payment ID
      user_id: '6948dc4897532de886ec876d',
      user_email: 'nfkmr920@gmail.com',
      package_id: 'credits_1000',
      credits: '1000',
      bonus_credits: '0',
      amount: '10.00'
    }
  },
  created_at: new Date().toISOString()
};

// Webhook Secret (从环境变量获取)
const WEBHOOK_SECRET = 'ws_0c86b55019d496f7b4d7a2ffa1fe6d5a5de6ecd3fc565d9bd63ea5a9355578f6';

// 生成签名
function generateSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// 发送测试 Webhook
async function testWebhook() {
  const payload = JSON.stringify(webhookData);
  const signature = generateSignature(payload, WEBHOOK_SECRET);
  
  console.log('🧪 Testing Whop Webhook...');
  console.log('📋 Payload:', payload);
  console.log('🔐 Signature:', signature);
  
  try {
    const response = await fetch('https://inkgeniusapi.digworldai.com/api/payment/webhook/whop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'whop-signature': signature
      },
      body: payload
    });
    
    const result = await response.text();
    
    console.log('📡 Response Status:', response.status, response.statusText);
    console.log('📄 Response Body:', result);
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed!');
    }
    
  } catch (error) {
    console.error('❌ Webhook test error:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testWebhook();
}

module.exports = { testWebhook, webhookData, generateSignature };