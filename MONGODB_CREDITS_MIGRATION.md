# 🔄 积分系统迁移到MongoDB

## ✅ 已完成的更改

### 1. Webhook处理更新
- **修改前**: 积分存储在Supabase的 `user_metadata.credits`
- **修改后**: 积分存储在MongoDB的 `users` 集合

### 2. 新的积分存储逻辑
```javascript
// 查找或创建用户记录
const mongoUser = await db.collection('users').findOne({ 
  $or: [
    { _id: systemUserId },
    { email: userEmail },
    { user_id: systemUserId }
  ]
});

if (mongoUser) {
  // 更新现有用户积分
  await db.collection('users').updateOne(
    { _id: mongoUser._id },
    { 
      $set: { 
        credits: currentCredits + 1000,
        updatedAt: new Date()
      }
    }
  );
} else {
  // 创建新用户记录
  await db.collection('users').insertOne({
    user_id: systemUserId,
    email: userEmail,
    credits: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'whop_payment'
  });
}
```

### 3. 新增API端点
- **端点**: `GET /api/payment/user/credits`
- **功能**: 从MongoDB获取用户积分
- **认证**: 需要Bearer token

### 4. 新的前端组件
- **组件**: `CreditsDisplayMongoDB.tsx`
- **功能**: 从API获取并显示MongoDB中的积分
- **特性**: 自动刷新、错误处理、加载状态

## 📊 数据结构

### MongoDB users 集合
```javascript
{
  _id: ObjectId("..."),
  user_id: "84335d21-b801-4ce3-90af-71f7d14e47f9", // Supabase用户ID
  email: "nfkmr920@gmail.com",
  credits: 1000,
  createdAt: ISODate("..."),
  updatedAt: ISODate("..."),
  source: "whop_payment"
}
```

### MongoDB payments 集合 (已存在)
```javascript
{
  _id: ObjectId("..."),
  userId: "84335d21-b801-4ce3-90af-71f7d14e47f9",
  userEmail: "nfkmr920@gmail.com",
  whopUserId: "user_xYvHDvzTbFVQn",
  packageId: "credits_1000",
  credits: 1000,
  status: "completed",
  // ...其他字段
}
```

## 🔄 完整的支付流程

```
1. 用户完成Whop支付
    ↓
2. Whop发送webhook到 /api/payment/webhook/whop
    ↓
3. 从webhook获取用户信息 (data.user)
    ↓
4. 通过邮箱匹配系统用户ID
    ↓
5. 更新MongoDB中的用户积分 (+1000)
    ↓
6. 创建支付记录到payments集合
    ↓
7. 前端通过API获取最新积分显示
```

## 🧪 测试方法

### 1. 使用测试页面
打开 `test-mongodb-credits.html` 进行测试：
- 查看当前积分
- 测试支付流程
- 验证API响应

### 2. MongoDB查询
```javascript
// 查看所有用户积分
db.users.find({}, {email: 1, credits: 1, updatedAt: 1})

// 查看特定用户
db.users.findOne({email: "nfkmr920@gmail.com"})

// 查看支付记录
db.payments.find().sort({createdAt: -1}).limit(5)
```

### 3. API测试
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/payment/user/credits
```

## 🚀 前端集成

### 替换积分显示组件
```jsx
// 旧组件
import CreditsDisplay from './CreditsDisplay';

// 新组件
import CreditsDisplayMongoDB from './CreditsDisplayMongoDB';

// 使用
<CreditsDisplayMongoDB 
  showRefreshButton={true}
  className="my-custom-class"
/>
```

### 手动获取积分
```javascript
const fetchCredits = async () => {
  const token = getAuthToken(); // 获取用户token
  
  const response = await fetch('/api/payment/user/credits', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data.data.credits;
};
```

## 🎯 预期效果

### 支付完成后
1. ✅ MongoDB中用户积分自动增加1000
2. ✅ 支付记录保存到payments集合
3. ✅ 前端可以通过API获取最新积分
4. ✅ 积分显示组件自动更新

### 错误处理
- 用户不存在 → 创建新用户记录
- API调用失败 → 显示错误信息并提供重试
- MongoDB连接失败 → 记录错误但不中断支付流程

## 🔧 维护建议

1. **定期备份**: 备份MongoDB中的users和payments集合
2. **监控积分**: 定期检查积分数据的一致性
3. **性能优化**: 为email和user_id字段创建索引
4. **日志记录**: 监控积分更新的成功率

## 🎉 总结

现在积分系统完全基于MongoDB，提供了：
- ✅ 更好的数据一致性
- ✅ 更灵活的查询能力
- ✅ 更简单的前端集成
- ✅ 更可靠的积分管理

支付完成后，积分会立即更新到MongoDB，前端可以实时获取和显示最新的积分信息！