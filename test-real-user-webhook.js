// 测试真实用户的 webhook 处理逻辑
console.log('🧪 测试真实用户的 Webhook 处理');

// 模拟真实的 webhook 事件
const realUserEvents = [
  {
    name: '真实用户支付成功 - 完整元数据',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_real_123',
        metadata: {
          user_id: 'real_user_abc123',
          user_email: 'user@example.com',
          package_id: 'credits_1000',
          credits: '1000'
        }
      }
    }
  },
  {
    name: '真实用户支付成功 - 只有用户信息',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_real_456',
        metadata: {
          user_id: 'real_user_def456',
          user_email: 'another@example.com'
          // 缺少 package_id 和 credits，但有用户信息
        }
      }
    }
  },
  {
    name: '支付成功但缺少用户信息 - 应该记录为未处理',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_missing_789',
        metadata: {
          // 完全没有用户信息
          some_other_field: 'value'
        }
      }
    }
  },
  {
    name: '支付成功但元数据为空 - 应该记录为未处理',
    event: {
      type: 'payment.succeeded',
      data: {
        id: 'pay_empty_000',
        metadata: {}
      }
    }
  }
];

// 模拟正确的处理逻辑
function processRealUserWebhook(event) {
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
    
    // 如果无法获取用户信息，记录错误并跳过处理
    if (!userId || !userEmail) {
      console.error('❌ 无法获取用户信息，跳过处理');
      console.log('当前获取到的信息:', { userId, userEmail });
      
      // 记录未处理支付
      const unprocessedPayment = {
        whopPaymentId: eventData.id || `whop_${Date.now()}`,
        eventType: event.event.type,
        eventData: eventData,
        metadata: metadata,
        status: 'missing_user_info',
        createdAt: new Date(),
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
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('💾 支付记录:', paymentRecord);
    console.log(`✅ 处理成功 - 将为用户 ${userId} 添加1000积分`);
    
    return {
      success: true,
      userId: userId,
      userEmail: userEmail,
      creditsAdded: creditsToAdd,
      paymentRecord: paymentRecord
    };
  } else {
    console.log('❌ 非支付成功事件，跳过处理');
    return { success: false, reason: '非支付成功事件' };
  }
}

// 测试所有事件
console.log('🚀 开始测试真实用户支付场景...\n');

const results = [];

realUserEvents.forEach((testEvent, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`测试 ${index + 1}/${realUserEvents.length}: ${testEvent.name}`);
  console.log(`${'='.repeat(60)}`);
  
  const result = processRealUserWebhook(testEvent);
  results.push({ event: testEvent.name, result });
  
  console.log('\n📊 处理结果:', result);
});

console.log(`\n${'='.repeat(60)}`);
console.log('🎯 测试总结');
console.log(`${'='.repeat(60)}`);

console.log('\n📈 处理结果统计:');
const successCount = results.filter(r => r.result.success).length;
const failureCount = results.filter(r => !r.result.success).length;

console.log(`✅ 成功处理: ${successCount} 个事件`);
console.log(`❌ 需要手动处理: ${failureCount} 个事件`);

console.log('\n✅ 成功处理的事件:');
results.filter(r => r.result.success).forEach(r => {
  console.log(`  - ${r.event}: 用户 ${r.result.userId} 获得 ${r.result.creditsAdded} 积分`);
});

console.log('\n⚠️ 需要手动处理的事件:');
results.filter(r => !r.result.success).forEach(r => {
  console.log(`  - ${r.event}: ${r.result.reason}`);
});

console.log('\n🔧 正确的处理逻辑:');
console.log('1. ✅ 只有在获取到真实用户信息时才处理支付');
console.log('2. ✅ 无法获取用户信息时记录为未处理事件');
console.log('3. ✅ 固定添加1000积分，简单可靠');
console.log('4. ✅ 详细日志记录，便于调试');
console.log('5. ✅ 手动处理机制，确保不丢失任何支付');

console.log('\n💡 实际部署后的操作:');
console.log('1. 监控 unprocessed_payments 集合');
console.log('2. 定期检查是否有需要手动处理的支付');
console.log('3. 手动为相关用户添加积分');
console.log('4. 优化元数据传递，减少手动处理的情况');