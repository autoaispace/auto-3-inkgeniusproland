// 在浏览器控制台直接运行这个代码来测试支付按钮
console.log('🧪 开始测试支付按钮功能...');

// 1. 检查用户信息
console.log('\n👤 检查用户信息:');
const userStr = localStorage.getItem('user');
console.log('localStorage.user:', userStr);

let userEmail = null;
let userId = null;

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('解析的用户对象:', user);
    userEmail = user.email || user.user_email;
    userId = user.id || user.user_id || user.sub;
    console.log('提取的邮箱:', userEmail);
    console.log('提取的用户ID:', userId);
  } catch (e) {
    console.log('解析用户对象失败:', e.message);
  }
}

// 2. 模拟支付按钮点击
console.log('\n🔄 模拟支付按钮点击...');

const selectedPackage = 'credits_1000';
console.log('选中的套餐:', selectedPackage);
console.log('用户邮箱:', userEmail);

// 检查条件
if (!selectedPackage) {
  console.log('❌ 没有选中套餐');
} else if (!userEmail) {
  console.log('❌ 没有用户邮箱 - 这就是为什么显示"请先登录"');
  console.log('💡 解决方案: 需要确保用户邮箱被正确传递给组件');
} else {
  console.log('✅ 条件检查通过，应该可以继续支付流程');
  
  // 3. 生成支付链接
  console.log('\n🔗 生成支付链接:');
  const baseUrl = 'https://whop.com/8429d376-ddb2-4fb6-bebf-b81b25deff04/test-7d-00b2/';
  const params = new URLSearchParams({
    'metadata[user_id]': userId || '6948dc4897532de886ec876d',
    'metadata[user_email]': userEmail,
    'metadata[package_id]': selectedPackage,
    'metadata[credits]': '1000',
  });
  
  const checkoutUrl = `${baseUrl}?${params.toString()}`;
  console.log('生成的支付链接:', checkoutUrl);
  
  // 4. 测试打开链接
  console.log('\n🪟 测试打开支付链接:');
  console.log('点击下面的链接测试支付:');
  console.log('%c' + checkoutUrl, 'color: blue; text-decoration: underline; cursor: pointer;');
  
  // 自动打开链接（可选）
  const shouldOpen = confirm('是否要打开支付链接进行测试？');
  if (shouldOpen) {
    window.open(checkoutUrl, '_blank');
  }
}

// 5. 检查组件状态
console.log('\n🔍 检查支付组件状态:');
console.log('如果你看到这些日志，说明 JavaScript 正在运行');
console.log('如果支付按钮还是没反应，可能是:');
console.log('1. 组件没有接收到 userEmail 参数');
console.log('2. 浏览器缓存了旧版本的代码');
console.log('3. 组件的事件处理器没有正确绑定');

// 6. 提供修复建议
console.log('\n🔧 修复建议:');
console.log('1. 强制刷新浏览器 (Ctrl+Shift+R)');
console.log('2. 清除浏览器缓存');
console.log('3. 在开发者工具中禁用缓存');
console.log('4. 检查组件是否接收到正确的 props');

console.log('\n✅ 测试完成！');