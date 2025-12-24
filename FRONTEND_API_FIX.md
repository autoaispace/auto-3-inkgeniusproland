# 🔧 前端API连接问题修复

## ❌ 问题分析
前端代码尝试连接到 `http://localhost:3001`，导致 `net::ERR_CONNECTION_REFUSED` 错误。

**根本原因**：
1. 这是一个Vite项目，但使用了Create React App的环境变量格式
2. Vite项目中，客户端环境变量必须以 `VITE_` 开头
3. 环境变量没有正确传递到生产构建中

## ✅ 修复内容

### 1. 环境变量配置
更新 `.env.local` 文件，添加Vite格式的环境变量：
```env
VITE_API_URL=https://inkgeniusapi.digworldai.com
VITE_BACKEND_URL=https://inkgeniusapi.digworldai.com
REACT_APP_API_URL=https://inkgeniusapi.digworldai.com  # 保持兼容性
```

### 2. 图像生成服务更新
修改 `utils/imageGeneration.ts`：
```typescript
constructor() {
  // 使用Vite环境变量，带有多重后备
  this.baseUrl = import.meta.env.VITE_API_URL || 
                 import.meta.env.VITE_BACKEND_URL || 
                 process.env.REACT_APP_API_URL || 
                 'https://inkgeniusapi.digworldai.com';
}
```

### 3. Vite配置更新
更新 `vite.config.ts`，确保环境变量正确传递：
```typescript
define: {
  'process.env.REACT_APP_API_URL': JSON.stringify(env.VITE_API_URL || env.VITE_BACKEND_URL)
}
```

### 4. 环境检查工具
创建 `utils/envCheck.ts` 用于调试环境变量配置。

## 🚀 部署步骤

### 1. 重新构建前端
```bash
npm run build
```

### 2. 部署到生产环境
确保生产环境的环境变量正确设置：
- `VITE_API_URL=https://inkgeniusapi.digworldai.com`
- `VITE_BACKEND_URL=https://inkgeniusapi.digworldai.com`

### 3. 验证修复
部署后，检查浏览器控制台：
- 应该看到 `🔗 API Base URL: https://inkgeniusapi.digworldai.com`
- 不应该再有 `localhost:3001` 的请求

## 🔍 调试信息

### 环境变量检查
在浏览器控制台中会显示：
```
🔍 Environment Check: {
  VITE_API_URL: "https://inkgeniusapi.digworldai.com",
  VITE_BACKEND_URL: "https://inkgeniusapi.digworldai.com",
  MODE: "production",
  ...
}
🌐 Final API URL: https://inkgeniusapi.digworldai.com
```

### 网络请求检查
修复后，API请求应该发送到：
- `https://inkgeniusapi.digworldai.com/api/gemini/text-to-image`
- `https://inkgeniusapi.digworldai.com/api/gemini/image-to-image`

## ⚠️ 注意事项

1. **Vite vs CRA**: 这是一个Vite项目，不是Create React App
2. **环境变量前缀**: Vite使用 `VITE_` 前缀，CRA使用 `REACT_APP_` 前缀
3. **构建时注入**: 环境变量在构建时注入，运行时无法更改
4. **生产环境**: 确保生产环境正确设置了 `VITE_API_URL`

## 🧪 测试方法

### 1. 本地测试
```bash
npm run dev
```
检查控制台输出的API URL

### 2. 生产测试
```bash
npm run build
npm run preview
```
验证构建后的环境变量

### 3. 功能测试
- 打开应用
- 尝试生成图像
- 检查网络面板中的API请求URL

---

**修复时间**: 2024年12月24日  
**状态**: ✅ 代码已修复，需要重新构建和部署