// 认证问题诊断脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 开始诊断认证配置...\n');

// 检查前端环境变量
console.log('1. 检查前端环境变量:');
const frontendEnvPath = '.env.local';
if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  console.log('   ✅ .env.local 存在');
  if (frontendEnv.includes('VITE_BACKEND_URL')) {
    console.log('   ✅ VITE_BACKEND_URL 已配置');
  } else {
    console.log('   ❌ VITE_BACKEND_URL 未配置');
  }
} else {
  console.log('   ❌ .env.local 不存在');
}

// 检查后端环境变量
console.log('\n2. 检查后端环境变量:');
const backendEnvPath = 'auto-3-back-express/.env';
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  console.log('   ✅ 后端 .env 存在');
  
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'MONGODB_URI',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (backendEnv.includes(varName)) {
      console.log(`   ✅ ${varName} 已配置`);
    } else {
      console.log(`   ❌ ${varName} 未配置`);
    }
  });
} else {
  console.log('   ❌ 后端 .env 不存在');
}

// 检查后端是否编译
console.log('\n3. 检查后端编译状态:');
const distPath = 'auto-3-back-express/dist';
if (fs.existsSync(distPath)) {
  console.log('   ✅ dist 目录存在');
  if (fs.existsSync(path.join(distPath, 'index.js'))) {
    console.log('   ✅ 编译文件存在');
  } else {
    console.log('   ❌ 编译文件不存在，需要运行 npm run build');
  }
} else {
  console.log('   ❌ dist 目录不存在，需要运行 npm run build');
}

// 检查package.json脚本
console.log('\n4. 检查项目配置:');
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('   ✅ 前端 package.json 存在');
  if (packageJson.scripts && packageJson.scripts.dev) {
    console.log('   ✅ dev 脚本存在');
  }
}

const backendPackageJsonPath = 'auto-3-back-express/package.json';
if (fs.existsSync(backendPackageJsonPath)) {
  const backendPackageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
  console.log('   ✅ 后端 package.json 存在');
  if (backendPackageJson.scripts && backendPackageJson.scripts.start) {
    console.log('   ✅ start 脚本存在');
  }
}

console.log('\n🔧 建议的修复步骤:');
console.log('1. 确保 Google Cloud Console 中配置了正确的回调URL:');
console.log('   - http://localhost:8080/api/auth/callback');
console.log('2. 重新编译后端: cd auto-3-back-express && npm run build');
console.log('3. 重启后端服务: cd auto-3-back-express && npm start');
console.log('4. 启动前端服务: npm run dev');
console.log('5. 使用 test-auth.html 进行测试');

console.log('\n📋 测试URL:');
console.log('- 后端健康检查: http://localhost:8080/health');
console.log('- 数据库测试: http://localhost:8080/api/auth/test/db');
console.log('- Google登录: http://localhost:8080/api/auth/google');
console.log('- 认证测试页面: ./test-auth.html');