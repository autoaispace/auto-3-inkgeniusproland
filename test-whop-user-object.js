// 测试从 Whop user 对象获取用户信息
console.log('🧪 测试 Whop user 对象解析');

// 模拟真实的 Whop webhook 数据
const realWhopEvent = {
  name: '真实 Whop webhook 数据',
  event: {
    type: 'payment.succeeded',
    data: {
      id: 'pay_PK8ICPnQclcLXj',
      status: 'paid',
      substatus: 'succeeded',
      plan: {
        id: 'plan_AvXNl6DA1jtOj'
      },
      product: {
        id: 'prod_FJhI6RgrgN3T2',
        title: 'inkgenius',
        route: 'test-7d-00b2'
      },
      user: {
        id: 'user_6RZqQ8FPNgkgH',
        name: null,
        username: 'nfmkr',
        email: 'nfmkr921@163.com'
      },
      membership: {
        id: 'mem_smHV4cKdNYfbgW',
        status: 'completed'
      },
      metadata: null // 关键：metadata 为 null
    }
  }
};

// 模拟修复后的处理逻辑
function processWhopWebhook(event) {
  console.log(`\n🔄 处理事件: ${event.name}`);
  console.log('📋 事件数据:', JSON.stringify(event.event, null, 2));
  
  const eventData = event.event.data || event.event;
  const metadata = eventData.metadata || {};
  
  console.log('📋 提取的元数据:', metadata);
  
  if (event.event.type === 'payment.succeeded') {
    console.log('✅ 确认为支付成功事件');
    
    // 尝试获取用户信息
    let userId = null;
    let userEmail = null;
    
    // 方法1: 从 metadata 获取
    if (metadata.user_id && metadata.user_email) {
      console.log('✅ 从 metadata 获取用户信息');
      userId = metadata.user_id;
      userEmail = metadata.user_email;
    }
    // 方法2: 从 eventData 直接获取
    else if (eventData.user_id && eventData.user_email) {
      console.log('✅ 从 eventData 获取用户信息');
      userId = eventData.user_id;
      userEmail = eventData.user_email;
    }
    // 方法3: 从 eventData.user 对象获取 (Whop标准格式) - 新增！
    else if (eventData.user && eventData.user.id && eventData.user.email) {
      console.log('✅ 从 eventData.user 对象获取用户信息');
      userId = eventData.user.id;
      userEmail = eventData.user.email;
    }
    // 方法4: 从 URL 参数获取
    else if (eventData.checkout_url || eventData.payment_url) {
      console.log('🔍 尝试从 URL 参数获取用户信息');
      // URL 解析逻辑...
    }
    
    // 检查是否获取到用户信息
    if (!userId || !userEmail) {
      console.error('❌ 无法获取用户信息，跳过处理');
      console.log('当前获取到的信息:', { userId, userEmail });
      
      return {
        success: false,
        reason: '缺少用户信息',
        eventData: eventData
      };
    }
    
    console.log('✅ 确认用户信息有效:', { userId, userEmail });
    
    // 固定添加1000积分
    const creditsToAdd = 1000;
    console.log('💰 将为用户添加积分:', creditsToAdd);
    
    // 模拟支付记录
    const paymentRecord = {
      userId: userId,
      userEmail: userEmail,
      packageId: 'credits_1000',
      packageName: '1000 积分',
      credits: creditsToAdd,
      bonusCredits: 0,
      amount: 10.00,
      currency: 'USD',
      status: 'completed',
      whopPaymentId: eventData.id || `whop_${Date.now()}`,
      whopUserId: eventData.user?.id,
      whopUsername: eventData.user?.username,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('💾 支付记录:', paymentRecord);
    console.log(`✅ 处理成功 - 将为用户 ${userId} (${userEmail}) 添加1000积分`);
    
    return {
      success: true,
      userId: userId,
      userEmail: userEmail,
      whopUserId: eventData.user?.id,
      whopUsername: eventData.user?.username,
      creditsAdded: creditsToAdd,
      paymentRecord: paymentRecord
    };
  } else {
    console.log('❌ 非支付成功事件，跳过处理');
    return { success: false, reason: '非支付成功事件' };
  }
}

// 测试真实数据
console.log('🚀 测试真实 Whop webhook 数据...\n');

console.log(`${'='.repeat(60)}`);
console.log(`测试: ${realWhopEvent.name}`);
console.log(`${'='.repeat(60)}`);

const result = processWhopWebhook(realWhopEvent);

console.log('\n📊 处理结果:', result);

console.log(`\n${'='.repeat(60)}`);
console.log('🎯 测试总结');
console.log(`${'='.repeat(60)}`);

if (result.success) {
  console.log('\n✅ 成功解析用户信息:');
  console.log(`  - Whop用户ID: ${result.whopUserId}`);
  console.log(`  - 用户邮箱: ${result.userEmail}`);
  console.log(`  - 用户名: ${result.whopUsername}`);
  console.log(`  - 将添加积分: ${result.creditsAdded}`);
  
  console.log('\n🔧 关键修复:');
  console.log('  - 添加了从 eventData.user 对象获取用户信息的逻辑');
  console.log('  - 这是 Whop 的标准用户信息传递方式');
  console.log('  - 即使 metadata 为 null，也能正确获取用户信息');
  
  console.log('\n🚀 下一步:');
  console.log('  1. 部署更新后的 webhook 处理逻辑');
  console.log('  2. 进行真实支付测试');
  console.log('  3. 确认用户积分正确增加');
} else {
  console.log('\n❌ 处理失败:');
  console.log(`  - 原因: ${result.reason}`);
  console.log('  - 需要进一步调试');
}

console.log('\n💡 重要发现:');
console.log('  - Whop 通过 data.user 对象传递用户信息');
console.log('  - metadata 可能为 null，但 user 对象包含完整信息');
console.log('  - user.id 是 Whop 用户ID，user.email 是用户邮箱');
console.log('  - 这解释了为什么之前的 metadata 解析失败');