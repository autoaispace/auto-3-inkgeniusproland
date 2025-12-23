// 在浏览器控制台运行这个脚本来检查登录状态
console.log('🔍 检查登录状态...');

// 检查所有可能的 token 存储位置
const possibleTokenKeys = [
    'supabase_token',
    'supabase.auth.token',
    'sb-access-token',
    'sb-refresh-token',
    'access_token',
    'auth_token',
    'user_token'
];

let foundToken = null;
let tokenSource = '';

// 检查 localStorage
console.log('📋 localStorage 中的相关键:');
for (const key of possibleTokenKeys) {
    const value = localStorage.getItem(key);
    if (value) {
        console.log(`✅ ${key}: ${value.substring(0, 30)}...`);
        if (!foundToken) {
            foundToken = value;
            tokenSource = `localStorage.${key}`;
        }
    } else {
        console.log(`❌ ${key}: 未找到`);
    }
}

// 检查 sessionStorage
console.log('\n📋 sessionStorage 中的相关键:');
for (const key of possibleTokenKeys) {
    const value = sessionStorage.getItem(key);
    if (value) {
        console.log(`✅ ${key}: ${value.substring(0, 30)}...`);
        if (!foundToken) {
            foundToken = value;
            tokenSource = `sessionStorage.${key}`;
        }
    } else {
        console.log(`❌ ${key}: 未找到`);
    }
}

// 检查 Supabase 客户端
console.log('\n🔍 检查 Supabase 客户端:');
try {
    if (window.supabase && window.supabase.auth) {
        console.log('✅ 找到全局 Supabase 客户端');
        const session = await window.supabase.auth.getSession();
        if (session?.data?.session?.access_token) {
            console.log(`✅ Supabase session token: ${session.data.session.access_token.substring(0, 30)}...`);
            if (!foundToken) {
                foundToken = session.data.session.access_token;
                tokenSource = 'supabase.auth.getSession()';
            }
        } else {
            console.log('❌ Supabase session 中没有 access_token');
        }
    } else {
        console.log('❌ 未找到全局 Supabase 客户端');
    }
} catch (e) {
    console.log('❌ 检查 Supabase 客户端时出错:', e.message);
}

// 显示所有存储的键
console.log('\n📋 所有 localStorage 键:', Object.keys(localStorage));
console.log('📋 所有 sessionStorage 键:', Object.keys(sessionStorage));

// 总结
console.log('\n📊 总结:');
if (foundToken) {
    console.log(`✅ 找到 token: ${tokenSource}`);
    console.log(`📄 Token 预览: ${foundToken.substring(0, 50)}...`);

    // 尝试解析 token
    try {
        const payload = JSON.parse(atob(foundToken.split('.')[1]));
        console.log('👤 Token 中的用户信息:', {
            userId: payload.sub,
            email: payload.email || payload.user_email,
            exp: new Date(payload.exp * 1000).toLocaleString()
        });
    } catch (e) {
        console.log('⚠️ 无法解析 token:', e.message);
    }
} else {
    console.log('❌ 未找到任何 token');
    console.log('💡 建议: 请重新登录或检查登录流程');
}

console.log('\n🔧 如果仍有问题，请检查:');
console.log('1. 是否已经成功登录 Google 账户');
console.log('2. 登录后是否正确保存了 token');
console.log('3. token 是否已过期');
console.log('4. 是否使用了不同的存储键名');