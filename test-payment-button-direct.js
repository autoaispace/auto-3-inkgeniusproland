// 在浏览器控制台运行这个脚本，会在页面上添加一个测试支付按钮
console.log('🔧 添加测试支付按钮到页面...');

// 创建测试按钮
const testButton = document.createElement('button');
testButton.innerHTML = '🧪 测试支付按钮';
testButton.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999999;
  background: #007bff;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
`;

// 添加点击事件
testButton.addEventListener('click', function() {
  console.log('🚀 测试支付按钮被点击');
  
  // 检查用户信息
  const userStr = localStorage.getItem('user');
  console.log('📄 localStorage.user:', userStr);
  
  if (!userStr) {
    alert('❌ localStorage 中没有用户信息');
    return;
  }
  
  try {
    const user = JSON.parse(userStr);
    console.log('👤 用户对象:', user);
    
    const userEmail = user.email || user.user_email;
    const userId = user.id || user.user_id || user.sub;
    
    console.log('📧 用户邮箱:', userEmail);
    console.log('🆔 用户ID:', userId);
    
    if (!userEmail) {
      alert('❌ 用户对象中没有邮箱字段');
      return;
    }
    
    // 生成支付链接
    const baseUrl = 'https://whop.com/plan_AvXNl6DA1jtOj/';
    const params = new URLSearchParams({
      'metadata[user_id]': userId || '6948dc4897532de886ec876d',
      'metadata[user_email]': userEmail,
      'metadata[package_id]': 'credits_1000',
      'metadata[credits]': '1000',
    });
    
    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    console.log('🔗 生成的支付链接:', checkoutUrl);
    
    // 显示成功信息
    alert(`✅ 支付链接生成成功！\n\n用户: ${userEmail}\n积分: 1000\n\n即将打开支付页面...`);
    
    // 打开支付链接
    window.open(checkoutUrl, '_blank');
    
  } catch (e) {
    console.error('❌ 处理失败:', e);
    alert('❌ 处理用户信息失败: ' + e.message);
  }
});

// 添加到页面
document.body.appendChild(testButton);

console.log('✅ 测试按钮已添加到页面右上角');
console.log('点击测试按钮来验证支付流程是否正常');

// 5秒后自动移除按钮（可选）
setTimeout(() => {
  if (document.body.contains(testButton)) {
    // testButton.remove(); // 取消注释这行来自动移除按钮
  }
}, 30000); // 30秒后移除

console.log('💡 如果测试按钮能正常工作，说明数据没问题，是组件缓存的问题');
console.log('💡 如果测试按钮也不工作，说明是数据获取的问题');