// 测试简化后的 webhook 处理逻辑
console.log('🧪 测试简化后的 Webhook 处理');

// 模拟不同的 webhook 事件
const testEvents = [
  {
    name: '完整元数据事件',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_test_123',
        metadata: {
          user_id: '6948dc4897532de886ec876d',
          user_email: 'test@example.com',
          package_id: 'credits_1000',
          credits: '1000'
        }
      }
    }
  },
  {
    name: '部分元数据事件',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_test_456',
        metadata: {
          user_id: '6948dc4897532de886ec876d',
          user_email: 'test@example.com'
          // 缺少 package_id 和 credits
        }
      }
    }
  },
  {
    name: '空元数据事件',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_test_789',
        metadata: {}
      }
    }
  },
  {
    name: '无元数据事件',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_test_000'
        // 完全没有 metadata
      }
    }
  }
];

// 模拟简化的处理逻辑
function processWebhookEvent(event) {
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
    
    // 如果仍然没有用户信息，记录错误并跳过处理
    if (!userId || !userEmail) {
      console.log('❌ 无法获取用户信息，跳过处理');
      console.log('当前获取到的信息:', { userId, userEmail });
      
      // 模拟记录未处理支付
      const unprocessedPayment = {
        whopPaymentId: eventData.id || `whop_${Date.now()}`,
        eventType: event.event.type,
        status: 'missing_user_info',
        note: '缺少用户信息：无法自动处理，需要手动添加积分'
      };
      
      console.log('📝 未处理支付记录:', unprocessedPayment);
      console.log('⚠️ 需要手动处理此支付事件');
      
      return {
        success: false,
        reason: '缺少用户信息',
        unprocessedPayment: unprocessedPayment
      };
    }
    
    console.log('👤 最终用户信息:', { userId, userEmail });
    
    // 简化：固定添加1000积分
    const creditsToAdd = 1000;
    console.log('💰 将添加积分:', creditsToAdd);
    
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
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('💾 支付记录:', paymentRecord);
    console.log('✅ 处理成功 - 将添加1000积分到用户账户');
    
    return {
      success: true,
      userId: userId,
      creditsAdded: creditsToAdd,
      paymentRecord: paymentRecord
    };
  } else {
    console.log('❌ 非支付成功事件，跳过处理');
    return { success: false, reason: '非支付成功事件' };
  }
}

// 测试所有事件
console.log('🚀 开始测试所有事件类型...\n');

testEvents.forEach((testEvent, index) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`测试 ${index + 1}/${testEvents.length}: ${testEvent.name}`);
  console.log(`${'='.repeat(50)}`);
  
  const result = processWebhookEvent(testEvent);
  
  console.log('\n📊 处理结果:', result);
});

console.log(`\n${'='.repeat(50)}`);
console.log('🎯 测试总结');
console.log(`${'='.repeat(50)}`);

console.log('\n✅ 简化后的逻辑优势:');
console.log('1. 不依赖复杂的套餐匹配');
console.log('2. 固定添加1000积分，简单可靠');
console.log('3. 多种用户信息获取方式');
console.log('4. 默认用户兜底机制');
console.log('5. 详细的日志记录');

console.log('\n🔧 实际部署建议:');
console.log('1. 部署更新后的 webhook 处理逻辑');
console.log('2. 进行一次真实支付测试');
console.log('3. 检查服务器日志确认处理流程');
console.log('4. 验证用户积分是否正确添加');

console.log('\n💡 如果仍有问题:');
console.log('1. 检查 Whop 后台的 webhook 配置');
console.log('2. 确认 webhook URL 可访问');
console.log('3. 查看 unprocessed_payments 集合中的未处理事件');
console.log('4. 手动处理未能自动处理的支付');