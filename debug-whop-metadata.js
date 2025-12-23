// 调试 Whop 元数据传递问题
console.log('🔍 调试 Whop 元数据传递问题');

// 1. 检查 localStorage 中的用户信息
console.log('\n=== 1. 检查用户信息 ===');
const userStr = localStorage.getItem('user');
console.log('📄 localStorage.user:', userStr);

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('👤 解析的用户对象:', user);
    
    const userEmail = user.email || user.user_email;
    const userId = user.id || user.user_id || user.sub;
    
    console.log('📧 提取的邮箱:', userEmail);
    console.log('🆔 提取的用户ID:', userId);
    
    // 2. 生成支付链接
    console.log('\n=== 2. 生成支付链接 ===');
    const baseUrl = 'https://whop.com/checkout/plan_AvXNl6DA1jtOj/';
    
    // 方法1: URLSearchParams (当前方法)
    const params1 = new URLSearchParams({
      'metadata[user_id]': userId || '6948dc4897532de886ec876d',
      'metadata[user_email]': userEmail || 'test@example.com',
      'metadata[package_id]': 'credits_1000',
      'metadata[credits]': '1000',
    });
    const url1 = `${baseUrl}?${params1.toString()}`;
    console.log('🔗 方法1 (URLSearchParams):', url1);
    
    // 方法2: 手动构建 (备选方法)
    const metadataParams = [
      `metadata[user_id]=${encodeURIComponent(userId || '6948dc4897532de886ec876d')}`,
      `metadata[user_email]=${encodeURIComponent(userEmail || 'test@example.com')}`,
      `metadata[package_id]=${encodeURIComponent('credits_1000')}`,
      `metadata[credits]=${encodeURIComponent('1000')}`
    ].join('&');
    const url2 = `${baseUrl}?${metadataParams}`;
    console.log('🔗 方法2 (手动构建):', url2);
    
    // 方法3: 使用不同的参数名 (测试)
    const params3 = new URLSearchParams({
      'user_id': userId || '6948dc4897532de886ec876d',
      'user_email': userEmail || 'test@example.com',
      'package_id': 'credits_1000',
      'credits': '1000',
    });
    const url3 = `${baseUrl}?${params3.toString()}`;
    console.log('🔗 方法3 (简单参数名):', url3);
    
    // 3. 测试打开支付链接
    console.log('\n=== 3. 测试支付链接 ===');
    console.log('点击下面的链接测试支付:');
    
    // 创建测试按钮
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
    `;
    
    container.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #333;">🔍 Whop 元数据测试</h3>
      <div style="margin-bottom: 10px;">
        <strong>用户ID:</strong> ${userId || '未找到'}
      </div>
      <div style="margin-bottom: 15px;">
        <strong>邮箱:</strong> ${userEmail || '未找到'}
      </div>
      <button id="test-method1" style="display: block; width: 100%; margin: 5px 0; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        测试方法1 (URLSearchParams)
      </button>
      <button id="test-method2" style="display: block; width: 100%; margin: 5px 0; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
        测试方法2 (手动构建)
      </button>
      <button id="test-method3" style="display: block; width: 100%; margin: 5px 0; padding: 8px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">
        测试方法3 (简单参数)
      </button>
      <button id="close-debug" style="display: block; width: 100%; margin: 10px 0 0 0; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
        关闭
      </button>
    `;
    
    document.body.appendChild(container);
    
    // 绑定事件
    document.getElementById('test-method1').onclick = () => {
      console.log('🚀 测试方法1:', url1);
      window.open(url1, 'whop-test-1', 'width=800,height=600');
    };
    
    document.getElementById('test-method2').onclick = () => {
      console.log('🚀 测试方法2:', url2);
      window.open(url2, 'whop-test-2', 'width=800,height=600');
    };
    
    document.getElementById('test-method3').onclick = () => {
      console.log('🚀 测试方法3:', url3);
      window.open(url3, 'whop-test-3', 'width=800,height=600');
    };
    
    document.getElementById('close-debug').onclick = () => {
      document.body.removeChild(container);
    };
    
  } catch (e) {
    console.error('❌ 解析用户信息失败:', e);
  }
} else {
  console.log('❌ localStorage 中没有用户信息');
}

console.log('\n=== 4. Whop 配置建议 ===');
console.log('如果元数据仍然为空，可能需要在 Whop 后台配置:');
console.log('1. 登录 Whop 商家后台');
console.log('2. 找到产品设置');
console.log('3. 启用 "Custom Metadata" 或 "Webhook Metadata"');
console.log('4. 确保 webhook 端点配置正确');
console.log('5. 检查产品是否支持元数据传递');