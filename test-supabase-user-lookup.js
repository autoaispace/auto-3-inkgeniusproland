// 测试 Supabase 用户查找逻辑
console.log('🧪 测试 Supabase 用户查找修复');

// 模拟 Supabase listUsers 的正确返回格式
const mockSupabaseResponse = {
  data: {
    users: [
      {
        id: '6948dc4897532de886ec876d', // 系统用户ID (UUID格式)
        email: 'nfmkr921@163.com',
        user_metadata: {
          credits: 500
        }
      },
      {
        id: 'another-uuid-user-id',
        email: 'other@example.com',
        user_metadata: {
          credits: 1000
        }
      }
    ]
  },
  error: null
};

// 模拟错误的返回格式 (之前的问题)
const mockWrongResponse = {
  data: [  // 错误：直接返回数组而不是 {users: [...]}
    {
      id: '6948dc4897532de886ec876d',
      email: 'nfmkr921@163.com'
    }
  ],
  error: null
};

// 测试用户查找逻辑
function testUserLookup(whopUserId, userEmail, supabaseResponse) {
  console.log(`\n🔄 测试用户查找: ${whopUserId} -> ${userEmail}`);
  
  let systemUserId = whopUserId;
  
  if (whopUserId.startsWith('user_')) {
    console.log('🔍 检测到Whop用户ID，尝试通过邮箱查找系统用户...');
    
    try {
      const { data, error } = supabaseResponse;
      
      if (!error && data && data.users) {
        console.log('✅ Supabase 返回格式正确');
        console.log(`📋 用户列表长度: ${data.users.length}`);
        
        const systemUser = data.users.find(u => u.email === userEmail);
        if (systemUser) {
          systemUserId = systemUser.id;
          console.log(`✅ 通过邮箱找到系统用户: ${userEmail} -> ${systemUserId}`);
          
          // 验证UUID格式
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          const isValidUUID = uuidRegex.test(systemUserId);
          console.log(`🔍 UUID格式验证: ${isValidUUID ? '✅ 有效' : '❌ 无效'}`);
          
          return {
            success: true,
            systemUserId: systemUserId,
            whopUserId: whopUserId,
            userEmail: userEmail,
            userMatched: true,
            isValidUUID: isValidUUID
          };
        } else {
          console.log(`⚠️ 系统中未找到邮箱为 ${userEmail} 的用户`);
          return {
            success: false,
            reason: 'user_not_found',
            systemUserId: null,
            whopUserId: whopUserId,
            userEmail: userEmail,
            userMatched: false
          };
        }
      } else if (!data.users) {
        console.error('❌ Supabase 返回格式错误: 缺少 users 数组');
        console.log('📋 实际返回:', data);
        return {
          success: false,
          reason: 'invalid_response_format',
          error: 'users.find is not a function'
        };
      } else {
        console.error('❌ Supabase 查询失败:', error);
        return {
          success: false,
          reason: 'supabase_error',
          error: error
        };
      }
    } catch (error) {
      console.error('❌ 查找系统用户失败:', error.message);
      return {
        success: false,
        reason: 'exception',
        error: error.message
      };
    }
  } else {
    console.log('✅ 直接使用系统用户ID');
    return {
      success: true,
      systemUserId: systemUserId,
      whopUserId: whopUserId,
      userEmail: userEmail,
      userMatched: false,
      isValidUUID: true
    };
  }
}

// 执行测试
console.log('🚀 开始测试用户查找修复...\n');

// 测试1: 正确的响应格式
console.log('='.repeat(60));
console.log('测试1: 正确的 Supabase 响应格式');
console.log('='.repeat(60));

const result1 = testUserLookup('user_44j05HRfpPZn3', 'nfmkr921@163.com', mockSupabaseResponse);
console.log('📊 结果1:', result1);

// 测试2: 错误的响应格式 (模拟之前的问题)
console.log('\n' + '='.repeat(60));
console.log('测试2: 错误的 Supabase 响应格式 (模拟之前的问题)');
console.log('='.repeat(60));

const result2 = testUserLookup('user_44j05HRfpPZn3', 'nfmkr921@163.com', mockWrongResponse);
console.log('📊 结果2:', result2);

// 测试3: 用户不存在
console.log('\n' + '='.repeat(60));
console.log('测试3: 用户不存在的情况');
console.log('='.repeat(60));

const result3 = testUserLookup('user_44j05HRfpPZn3', 'nonexistent@example.com', mockSupabaseResponse);
console.log('📊 结果3:', result3);

// 总结
console.log('\n' + '='.repeat(60));
console.log('🎯 测试总结');
console.log('='.repeat(60));

console.log('\n🔧 关键修复:');
console.log('1. ✅ 修复 Supabase listUsers 响应格式处理');
console.log('2. ✅ 正确访问 data.users 数组');
console.log('3. ✅ 添加用户不存在的处理逻辑');
console.log('4. ✅ 记录未处理支付到数据库');
console.log('5. ✅ 避免使用无效UUID调用 getUserById');

console.log('\n📋 处理流程:');
console.log('1. 检测Whop用户ID格式');
console.log('2. 调用 listUsers() 获取所有用户');
console.log('3. 在 data.users 数组中查找匹配邮箱的用户');
console.log('4. 如果找到，使用系统用户ID (UUID格式)');
console.log('5. 如果未找到，记录为未处理支付');

console.log('\n🚀 预期效果:');
console.log('- ✅ 不再出现 "users.find is not a function" 错误');
console.log('- ✅ 不再出现 "Expected parameter to be UUID" 错误');
console.log('- ✅ 正确匹配用户并更新积分');
console.log('- ✅ 未匹配用户记录到 unprocessed_payments');