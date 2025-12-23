// 在浏览器控制台运行这个脚本来检查用户信息
console.log('🔍 详细检查用户登录状态...');

// 检查 localStorage 中的 user 对象
console.log('\n👤 检查用户信息:');
const userStr = localStorage.getItem('user');
if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('✅ 找到用户对象:', user);
    
    // 检查可能的 token 字段
    const possibleTokenFields = ['access_token', 'accessToken', 'token', 'jwt', 'authToken'];
    let foundToken = null;
    
    for (const field of possibleTokenFields) {
      if (user[field]) {
        foundToken = user[field];
        console.log(`✅ 在 user.${field} 中找到 token: ${foundToken.substring(0, 30)}...`);
        break;
      }
    }
    
    if (!foundToken) {
      console.log('❌ 用户对象中没有找到 token');
      console.log('📋 用户对象的所有字段:', Object.keys(user));
    }
    
    // 检查用户 ID
    const userId = user.id || user.user_id || user.sub;
    console.log('👤 用户 ID:', userId || '未找到');
    
    // 检查用户邮箱
    const userEmail = user.email || user.user_email;
    console.log('📧 用户邮箱:', userEmail || '未找到');
    
  } catch (e) {
    console.log('❌ 无法解析用户对象:', e.message);
    console.log('📄 原始用户数据:', userStr);
  }
} else {
  console.log('❌ localStorage 中没有找到 user 对象');
}

// 测试支付链接生成
console.log('\n🔗 测试支付链接生成:');
let testUserId = '6948dc4897532de886ec876d';
let testUserEmail = 'nfkmr920@gmail.com';

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    testUserId = user.id || user.user_id || user.sub || testUserId;
    testUserEmail = user.email || user.user_email || testUserEmail;
  } catch (e) {
    console.log('使用默认测试用户信息');
  }
}

const baseUrl = 'https://whop.com/8429d376-ddb2-4fb6-bebf-b81b25deff04/test-7d-00b2/';
const params = new URLSearchParams({
  'metadata[user_id]': testUserId,
  'metadata[user_email]': testUserEmail,
  'metadata[package_id]': 'credits_1000',
  'metadata[credits]': '1000',
});

const testUrl = `${baseUrl}?${params.toString()}`;
console.log('🔗 生成的支付链接:', testUrl);
console.log('👤 使用的用户信息:', { userId: testUserId, email: testUserEmail });

console.log('\n💡 解决方案:');
console.log('1. 修复后的组件现在会检查 localStorage 中的 user 对象');
console.log('2. 即使没有 token 也会继续支付流程');
console.log('3. 使用 test-payment-url-generator.html 可以手动生成支付链接');
console.log('4. 支付链接会直接跳转到 Whop 支付页面');

// 显示 API 接口信息
console.log('\n🔧 API 接口信息:');
console.log('内嵌支付 API: POST https://inkgeniusapi.digworldai.com/api/payment/create-embedded');
console.log('请求体: {"packageId": "credits_1000"}');
console.log('需要 Authorization 头: Bearer <token>');
console.log('Webhook URL: https://inkgeniusapi.digworldai.com/api/payment/webhook/whop');