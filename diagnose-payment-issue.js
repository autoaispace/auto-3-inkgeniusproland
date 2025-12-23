// 在浏览器控制台运行这个脚本来诊断支付问题
console.log('🔍 诊断支付组件问题...');

// 1. 检查 localStorage 中的用户信息
console.log('\n👤 检查用户信息:');
const userStr = localStorage.getItem('user');
if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('✅ localStorage.user:', user);
    console.log('📧 用户邮箱:', user.email || user.user_email || '未找到');
    console.log('🆔 用户ID:', user.id || user.user_id || user.sub || '未找到');
  } catch (e) {
    console.log('❌ 无法解析用户对象:', e.message);
  }
} else {
  console.log('❌ localStorage 中没有 user 对象');
}

// 2. 模拟支付组件的检查逻辑
console.log('\n🔄 模拟支付组件检查:');

// 模拟组件接收的 props
const mockProps = {
  userEmail: undefined, // 这里可能是问题所在
  isOpen: true
};

console.log('📋 组件接收的 props:', mockProps);

// 模拟 handlePurchase 的检查逻辑
const selectedPackage = 'credits_1000'; // 假设已选择
const userEmail = mockProps.userEmail;

console.log('🔍 检查条件:');
console.log('- selectedPackage:', selectedPackage || '未选择');
console.log('- userEmail:', userEmail || '未提供');

if (!selectedPackage || !userEmail) {
  console.log('❌ 检查失败: 会显示"请选择套餐并确保已登录"');
  console.log('💡 问题原因: userEmail 参数没有传递给组件');
} else {
  console.log('✅ 检查通过: 会继续支付流程');
}

// 3. 检查如何修复
console.log('\n🔧 修复建议:');
console.log('1. 确保在使用 PaymentModalNew 组件时传递了 userEmail 参数');
console.log('2. 检查父组件是否正确获取了用户邮箱');
console.log('3. 可能需要从 localStorage.user 中提取邮箱');

// 4. 提供修复代码示例
console.log('\n💻 修复代码示例:');
console.log(`
// 在父组件中:
const [user, setUser] = useState(null);

useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }
}, []);

// 使用组件时:
<PaymentModalNew
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  userEmail={user?.email || user?.user_email} // 关键：传递用户邮箱
  onPaymentSuccess={handlePaymentSuccess}
/>
`);

// 5. 测试直接修改组件的方法
console.log('\n🧪 临时测试方法:');
console.log('如果你想快速测试，可以修改组件让它自动获取用户邮箱:');
console.log(`
// 在 PaymentModalNew 组件中添加:
useEffect(() => {
  if (isOpen && !userEmail) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const email = user.email || user.user_email;
        if (email) {
          // 这里需要一个方法来设置 userEmail
          console.log('自动获取到用户邮箱:', email);
        }
      } catch (e) {
        console.error('Failed to get user email:', e);
      }
    }
  }
}, [isOpen, userEmail]);
`);

console.log('\n🎯 总结:');
console.log('问题很可能是 userEmail 参数没有传递给 PaymentModalNew 组件');
console.log('这导致组件在第一步检查时就失败了，显示"请选择套餐并确保已登录"');
console.log('解决方案是确保父组件正确传递用户邮箱参数');