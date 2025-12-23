import https from 'https';
import http from 'http';

// 测试内嵌支付的 webhook 数据 - 模拟 Whop 发送的 payment.succeeded 事件
const testEmbeddedWebhookData = {
  type: 'payment.succeeded',
  data: {
    id: 'whop_embedded_' + Date.now(),
    status: 'completed',
    amount: 1000, // $10.00 in cents
    currency: 'USD',
    metadata: {
      user_id: '6948dc4897532de886ec876d',
      user_email: 'nfkmr920@gmail.com',
      package_id: 'credits_1000',
      credits: '1000',
      bonus_credits: '0',
      package_name: '1000 积分'
    },
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString()
  }
};

// 测试不同套餐的 webhook 数据
const testPackages = [
  {
    id: 'credits_100',
    name: '100 积分',
    credits: 100,
    price: 1.00,
    bonus: 0
  },
  {
    id: 'credits_1000',
    name: '1000 积分',
    credits: 1000,
    price: 10.00,
    bonus: 0
  },
  {
    id: 'credits_15000',
    name: '15000 积分',
    credits: 15000,
    price: 100.00,
    bonus: 5000
  }
];

// 测试不同的 webhook URL
const webhookUrls = [
  'https://inkgeniusapi.digworldai.com/api/payment/webhook/whop',
  'http://localhost:3000/api/payment/webhook/whop'
];

async function testWebhook(url, webhookData) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(webhookData);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Whop-Webhook/1.0'
      }
    };

    console.log(`\n🔄 Testing webhook: ${url}`);
    console.log('📋 Payload:', JSON.stringify(webhookData, null, 2));

    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Response Status: ${res.statusCode}`);
        console.log(`📄 Response Body:`, data);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode, data });
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request failed: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

function createWebhookData(packageInfo) {
  return {
    type: 'payment.succeeded',
    data: {
      id: `whop_embedded_${packageInfo.id}_${Date.now()}`,
      status: 'completed',
      amount: packageInfo.price * 100, // Convert to cents
      currency: 'USD',
      metadata: {
        user_id: '6948dc4897532de886ec876d',
        user_email: 'nfkmr920@gmail.com',
        package_id: packageInfo.id,
        credits: packageInfo.credits.toString(),
        bonus_credits: packageInfo.bonus.toString(),
        package_name: packageInfo.name
      },
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    }
  };
}

async function runTests() {
  console.log('🚀 Starting Whop Embedded Payment Webhook Tests');
  console.log('=' .repeat(60));
  
  for (const url of webhookUrls) {
    console.log(`\n🌐 Testing URL: ${url}`);
    console.log('-'.repeat(40));
    
    for (const pkg of testPackages) {
      console.log(`\n📦 Testing package: ${pkg.name}`);
      
      try {
        const webhookData = createWebhookData(pkg);
        const result = await testWebhook(url, webhookData);
        
        if (result.success) {
          console.log(`✅ ${pkg.name} - SUCCESS`);
        } else {
          console.log(`❌ ${pkg.name} - FAILED (Status: ${result.status})`);
        }
      } catch (error) {
        console.log(`❌ ${pkg.name} - ERROR: ${error.message}`);
      }
      
      // 等待一秒避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n📋 Test Summary:');
  console.log('- 测试了内嵌支付的 payment.succeeded webhook');
  console.log('- 验证了不同积分套餐的处理');
  console.log('- 包含了 bonus_credits 的处理');
  console.log('- 测试了多个环境的 webhook 端点');
  
  console.log('\n🔍 检查要点:');
  console.log('1. 后端是否正确识别了 payment.succeeded 事件');
  console.log('2. 是否正确解析了 metadata 中的用户和套餐信息');
  console.log('3. 是否创建了支付记录');
  console.log('4. 是否更新了用户积分（包括奖励积分）');
  console.log('5. 日志中是否显示 "Embedded payment processed successfully"');
  
  console.log('\n🎯 预期日志输出:');
  console.log('📨 Received Whop webhook');
  console.log('✅ Processing payment completion event');
  console.log('🔄 Processing embedded payment...');
  console.log('💾 Payment record created');
  console.log('✅ User credits updated');
  console.log('✅ Embedded payment processed successfully');
}

// 运行测试
runTests().catch(console.error);