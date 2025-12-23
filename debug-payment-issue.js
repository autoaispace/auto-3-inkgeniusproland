// 在浏览器控制台运行这个脚本来调试支付问题
console.log('🔍 调试支付弹窗问题...');

// 1. 检查 localStorage 中的用户信息
console.log('\n👤 检查用户信息:');
const userStr = localStorage.getItem('user');
console.log('localStorage.user:', userStr);

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('✅ 用户对象:', user);
    console.log('📧 用户邮箱:', user.email || user.user_email);
    console.log('🆔 用户ID:', user.id || user.user_id || user.sub);
  } catch (e) {
    console.log('❌ 解析用户对象失败:', e.message);
  }
}

// 2. 检查是否有支付组件在页面上
console.log('\n🔍 检查支付组件:');
const paymentModals = document.querySelectorAll('[class*="PaymentModal"], [class*="payment-modal"]');
console.log('找到的支付模态框元素:', paymentModals.length);

// 3. 检查是否有支付按钮
const paymentButtons = document.querySelectorAll('button[class*="立即购买"], button:contains("立即购买"), button[class*="purchase"]');
console.log('找到的支付按钮:', paymentButtons.length);

// 4. 强制触发支付流程测试
console.log('\n🧪 强制测试支付流程:');

// 模拟点击支付按钮的逻辑
function testPaymentFlow() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('❌ localStorage 中没有用户信息');
    return;
  }
  
  try {
    const user = JSON.parse(userStr);
    const userEmail = user.email || user.user_email;
    const userId = user.id || user.user_id || user.sub;
    
    if (!userEmail) {
      console.log('❌ 用户对象中没有邮箱');
      return;
    }
    
    console.log('✅ 用户信息正常:', { userEmail, userId });
    
    // 生成支付链接
    const baseUrl = 'https://whop.com/8429d376-ddb2-4fb6-bebf-b81b25deff04/test-7d-00b2/';
    const params = new URLSearchParams({
      'metadata[user_id]': userId || '6948dc4897532de886ec876d',
      'metadata[user_email]': userEmail,
      'metadata[package_id]': 'credits_1000',
      'metadata[credits]': '1000',
    });
    
    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    console.log('🔗 生成的支付链接:', checkoutUrl);
    
    // 测试打开链接
    const shouldOpen = confirm('支付链接生成成功！是否要打开测试？');
    if (shouldOpen) {
      window.open(checkoutUrl, '_blank');
    }
    
  } catch (e) {
    console.log('❌ 测试失败:', e.message);
  }
}

// 5. 检查是否有 React 组件状态问题
console.log('\n⚛️ 检查 React 组件状态:');
console.log('如果支付按钮还是显示"请先登录"，可能的原因:');
console.log('1. 组件使用了缓存的旧代码');
console.log('2. 组件没有正确接收到用户信息');
console.log('3. 组件的状态没有正确更新');

// 6. 提供解决方案
console.log('\n🔧 解决方案:');
console.log('1. 强制刷新页面 (Ctrl+Shift+R)');
console.log('2. 清除浏览器缓存');
console.log('3. 检查组件是否使用了最新版本');

// 运行测试
testPaymentFlow();

console.log('\n📋 调试完成！');
console.log('如果测试成功生成了支付链接，说明数据没问题，是组件的问题');
console.log('如果测试失败，说明是数据获取的问题');