// 高级 Whop API 诊断工具
import crypto from 'crypto';

const WHOP_CONFIG = {
  API_KEY: 'apik_vkhfnrxPZ9o5Z_C3874913_C_890ba9febdd7bd7df18d1cb8762fdad7146740d771dbb409461236a9e96684',
  COMPANY_ID: 'biz_WsbzpUKOA4tjCs',
  PLAN_ID: 'plan_5Wc0DVhD7zmNn',
  BASE_URL: 'https://api.whop.com/api/v2'
};

// 1. 检查 Whop API 文档和端点
async function checkWhopAPIDocumentation() {
  console.log('📚 Checking Whop API Documentation & Endpoints');
  console.log('=' .repeat(60));
  
  const endpoints = [
    'https://api.whop.com/health',
    'https://api.whop.com/api/v2',
    'https://api.whop.com/api/v3',
    'https://api.whop.com/v2',
    'https://api.whop.com'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`   Response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

// 2. 检查 API 密钥的详细信息
async function analyzeAPIKey() {
  console.log('\n🔑 API Key Analysis');
  console.log('=' .repeat(60));
  
  console.log(`Full API Key: ${WHOP_CONFIG.API_KEY}`);
  console.log(`Key Length: ${WHOP_CONFIG.API_KEY.length}`);
  console.log(`Key Format: ${/^apik_[a-zA-Z0-9_]+$/.test(WHOP_CONFIG.API_KEY) ? 'Valid' : 'Invalid'}`);
  
  // 分析密钥结构
  const keyParts = WHOP_CONFIG.API_KEY.split('_');
  console.log(`Key Parts: ${keyParts.length}`);
  keyParts.forEach((part, index) => {
    console.log(`   Part ${index}: ${part} (${part.length} chars)`);
  });
}

// 3. 测试不同的认证方式
async function testAuthenticationMethods() {
  console.log('\n🔐 Testing Different Authentication Methods');
  console.log('=' .repeat(60));
  
  const authMethods = [
    {
      name: 'Bearer Token',
      headers: { 'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}` }
    },
    {
      name: 'API Key Header',
      headers: { 'X-API-Key': WHOP_CONFIG.API_KEY }
    },
    {
      name: 'Whop-API-Key Header',
      headers: { 'Whop-API-Key': WHOP_CONFIG.API_KEY }
    },
    {
      name: 'Authorization API Key',
      headers: { 'Authorization': `API-Key ${WHOP_CONFIG.API_KEY}` }
    }
  ];
  
  for (const method of authMethods) {
    console.log(`\n🧪 Testing: ${method.name}`);
    try {
      const response = await fetch(`${WHOP_CONFIG.BASE_URL}/plans/${WHOP_CONFIG.PLAN_ID}`, {
        headers: {
          ...method.headers,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`   Status: ${response.status}`);
      if (response.ok) {
        console.log(`   ✅ SUCCESS with ${method.name}`);
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${error.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// 4. 检查 Whop 账户状态
async function checkAccountStatus() {
  console.log('\n🏢 Checking Account Status');
  console.log('=' .repeat(60));
  
  const statusEndpoints = [
    '/me',
    '/account',
    '/user',
    '/profile',
    `/companies/${WHOP_CONFIG.COMPANY_ID}/status`,
    `/companies/${WHOP_CONFIG.COMPANY_ID}/settings`
  ];
  
  for (const endpoint of statusEndpoints) {
    console.log(`\n🔍 Testing: ${endpoint}`);
    try {
      const response = await fetch(`${WHOP_CONFIG.BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`   Status: ${response.status}`);
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Data available`);
        console.log(`   Keys: ${Object.keys(result).join(', ')}`);
      } else {
        const error = await response.text();
        console.log(`   ❌ ${error.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// 5. 检查支付处理状态
async function checkPaymentProcessingStatus() {
  console.log('\n💳 Checking Payment Processing Status');
  console.log('=' .repeat(60));
  
  // 检查公司的支付设置
  try {
    const response = await fetch(`${WHOP_CONFIG.BASE_URL}/companies/${WHOP_CONFIG.COMPANY_ID}`, {
      headers: {
        'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const company = await response.json();
      console.log('✅ Company Information:');
      console.log(`   Name: ${company.name || 'N/A'}`);
      console.log(`   Status: ${company.status || 'N/A'}`);
      console.log(`   Payment Enabled: ${company.payment_enabled || 'N/A'}`);
      console.log(`   Stripe Connected: ${company.stripe_connected || 'N/A'}`);
    } else {
      console.log('❌ Cannot access company information');
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// 6. 尝试不同的 API 版本
async function testAPIVersions() {
  console.log('\n🔄 Testing Different API Versions');
  console.log('=' .repeat(60));
  
  const apiVersions = [
    'https://api.whop.com/api/v1',
    'https://api.whop.com/api/v2',
    'https://api.whop.com/api/v3',
    'https://api.whop.com/v1',
    'https://api.whop.com/v2',
    'https://api.whop.com/v3'
  ];
  
  for (const baseUrl of apiVersions) {
    console.log(`\n🧪 Testing API Version: ${baseUrl}`);
    try {
      const response = await fetch(`${baseUrl}/plans/${WHOP_CONFIG.PLAN_ID}`, {
        headers: {
          'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`   Status: ${response.status}`);
      if (response.ok) {
        console.log(`   ✅ Working API version: ${baseUrl}`);
        
        // 尝试 checkout
        const checkoutResponse = await fetch(`${baseUrl}/checkout/sessions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            plan_id: WHOP_CONFIG.PLAN_ID,
            customer_email: 'test@example.com'
          })
        });
        
        console.log(`   Checkout Status: ${checkoutResponse.status}`);
        if (checkoutResponse.ok) {
          console.log(`   🎉 CHECKOUT WORKS with ${baseUrl}!`);
          return baseUrl;
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  return null;
}

// 7. 检查 Whop 服务状态
async function checkWhopServiceStatus() {
  console.log('\n🌐 Checking Whop Service Status');
  console.log('=' .repeat(60));
  
  try {
    // 检查 Whop 状态页面
    const statusResponse = await fetch('https://status.whop.com/api/v2/status.json');
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log(`✅ Whop Service Status: ${status.status?.description || 'Unknown'}`);
    }
  } catch (error) {
    console.log(`❌ Cannot check service status: ${error.message}`);
  }
  
  // 检查 API 响应时间
  const startTime = Date.now();
  try {
    await fetch('https://api.whop.com');
    const responseTime = Date.now() - startTime;
    console.log(`⏱️  API Response Time: ${responseTime}ms`);
  } catch (error) {
    console.log(`❌ API not reachable: ${error.message}`);
  }
}

// 主诊断函数
async function runComprehensiveDiagnosis() {
  console.log('🚀 Whop API 高级诊断工具');
  console.log('=' .repeat(60));
  console.log(`时间: ${new Date().toISOString()}`);
  console.log('');
  
  await analyzeAPIKey();
  await checkWhopServiceStatus();
  await checkWhopAPIDocumentation();
  await testAuthenticationMethods();
  await checkAccountStatus();
  await checkPaymentProcessingStatus();
  const workingAPIVersion = await testAPIVersions();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 诊断总结');
  console.log('=' .repeat(60));
  
  if (workingAPIVersion) {
    console.log(`✅ 找到可用的 API 版本: ${workingAPIVersion}`);
    console.log('🎉 支付功能应该可以正常工作！');
  } else {
    console.log('❌ 所有 API 版本都无法创建 checkout session');
    console.log('\n🔧 建议的解决方案:');
    console.log('1. 联系 Whop 支持团队确认 API 密钥权限');
    console.log('2. 检查 Whop 账户是否启用了支付处理');
    console.log('3. 确认计划和公司 ID 是否正确');
    console.log('4. 检查是否需要完成 KYC 或其他验证流程');
  }
}

runComprehensiveDiagnosis().catch(console.error);