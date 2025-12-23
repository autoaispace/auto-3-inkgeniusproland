// 测试用户匹配逻辑
console.log('🧪 测试用户匹配逻辑');

// 模拟真实的 Whop webhook 数据
const realWhopEvent = {
  type: 'payment.succeeded',
  data: {
    id: 'pay_PK8ICPnQclcLXj',
    user: {
      id: 'user_6RZqQ8FPNgkgH', // Whop 用户ID
      username: 'nfmkr',
      email: 'nfmkr921@163.com'  // 关键：用于匹配系统用户
    },
    metadata: null
  }
};

// 模拟系统中的用户数据
const mockSystemUsers = [
  {
    id: '6948dc4897532de886ec876d', // 系统用户ID
    email: 'nfmkr921@163.com',      // 匹配的邮箱
    user_metadata: {
      credits: 500 // 当前积分
    }
  },
  {
    id: 'another_user_id',
    email: 'other@example.com',
    user_metadata: {
      credits: 1000
    }
  }
];

// 模拟用户匹配逻辑
function processUserMatching(webhookData, systemUsers) {
  console.log('\n🔄 开始处理用户匹配...');
  
  const eventData = webhookData.data;
  
  // 从 Whop 数据获取用户信息
  let whopUserId = null;
  let userEmail = null;
  
  if (eventData.user && eventData.user.id && eventData.user.email) {
    whopUserId = eventData.user.id;
    userEmail = eventData.user.email;
    console.log('✅ 从 eventData.user 对象获取用户信息');
  }
  
  if (!whopUserId || !userEmail) {
    console.error('❌ 无法获取用户信息');
    return { success: false, reason: '缺少用户信息' };
  }
  
  console.log('📋 Whop 用户信息:', { whopUserId, userEmail });
  
  // 确定系统用户ID
  let systemUserId = whopUserId;
  let matchedUser = null;
  
  // 如果是Whop用户ID，通过邮箱查找系统用户
  if (whopUserId.startsWith('user_')) {
    console.log('🔍 检测到Whop用户ID，尝试通过邮箱查找系统用户...');
    
    matchedUser = systemUsers.find(u => u.email === userEmail);
    
    if (matchedUser) {
      systemUserId = matchedUser.id;
      console.log(`✅ 通过邮箱找到系统用户: ${userEmail} -> ${systemUserId}`);
    } else {
      console.log(`⚠️ 系统中未找到邮箱为 ${userEmail} 的用户`);
      console.log('📝 将使用Whop用户ID，但可能需要手动处理');
    }
  }
  
  console.log('👤 最终使用的用户ID:', systemUserId);
  
  // 模拟积分更新
  const creditsToAdd = 1000;
  let currentCredits = 0;
  let newCredits = creditsToAdd;
  
  if (matchedUser) {
    currentCredits = matchedUser.user_metadata?.credits || 0;
    newCredits = currentCredits + creditsToAdd;
    console.log(`💰 积分更新: ${currentCredits} + ${creditsToAdd} = ${newCredits}`);
  } else {
    console.log(`💰 新用户积分: ${creditsToAdd} (无法找到现有积分)`);
  }
  
  // 创建支付记录
  const paymentRecord = {
    userId: systemUserId,        // 系统用户ID (用于积分更新)
    userEmail: userEmail,        // 用户邮箱
    whopUserId: whopUserId,      // 原始Whop用户ID (用于记录)
    packageId: 'credits_1000',
    packageName: '1000 积分',
    credits: creditsToAdd,
    bonusCredits: 0,
    amount: 10.00,
    currency: 'USD',
    status: 'completed',
    whopPaymentId: eventData.id,
    userMatched: !!matchedUser,  // 是否成功匹配到系统用户
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log('💾 支付记录:', paymentRecord);
  
  return {
    success: true,
    systemUserId: systemUserId,
    whopUserId: whopUserId,
    userEmail: userEmail,
    userMatched: !!matchedUser,
    currentCredits: currentCredits,
    newCredits: newCredits,
    creditsAdded: creditsToAdd,
    paymentRecord: paymentRecord
  };
}

// 执行测试
console.log('🚀 开始测试用户匹配逻辑...\n');

console.log('📋 测试数据:');
console.log('Whop用户ID:', realWhopEvent.data.user.id);
console.log('用户邮箱:', realWhopEvent.data.user.email);
console.log('系统用户数量:', mockSystemUsers.length);

const result = processUserMatching(realWhopEvent, mockSystemUsers);

console.log('\n📊 处理结果:', result);

console.log('\n🎯 测试总结:');

if (result.success) {
  console.log('✅ 用户匹配成功!');
  console.log(`  - Whop用户ID: ${result.whopUserId}`);
  console.log(`  - 系统用户ID: ${result.systemUserId}`);
  console.log(`  - 用户邮箱: ${result.userEmail}`);
  console.log(`  - 匹配状态: ${result.userMatched ? '已匹配' : '未匹配'}`);
  console.log(`  - 积分变化: ${result.currentCredits} -> ${result.newCredits}`);
  
  if (result.userMatched) {
    console.log('\n🎉 完美！系统能够正确匹配用户并更新积分');
  } else {
    console.log('\n⚠️ 注意：未能匹配到系统用户，可能需要手动处理');
  }
} else {
  console.log('❌ 用户匹配失败:', result.reason);
}

console.log('\n🔧 关键改进:');
console.log('1. ✅ 从 eventData.user 对象获取用户信息');
console.log('2. ✅ 通过邮箱匹配系统用户');
console.log('3. ✅ 保存Whop用户ID用于记录');
console.log('4. ✅ 使用系统用户ID更新积分');
console.log('5. ✅ 标记用户匹配状态');

console.log('\n🚀 实际效果:');
console.log('- 即使Whop使用不同的用户ID系统');
console.log('- 也能通过邮箱正确匹配到系统用户');
console.log('- 确保积分添加到正确的账户');
console.log('- 完整记录支付信息便于审计');