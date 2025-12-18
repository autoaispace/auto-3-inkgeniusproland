// 手动处理认证回调的脚本
// 将此脚本添加到你的前端页面

(function() {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const email = urlParams.get('email');
    const id = urlParams.get('id');
    const name = urlParams.get('name');
    const avatar = urlParams.get('avatar');

    console.log('🔍 检查认证参数:', { authSuccess, email: !!email, id: !!id });

    if (authSuccess === 'true' && email && id) {
        console.log('✅ 发现认证成功参数，处理用户登录...');
        
        const user = {
            id: id,
            email: decodeURIComponent(email),
            name: name ? decodeURIComponent(name) : undefined,
            avatar: avatar ? decodeURIComponent(avatar) : undefined,
        };

        // 保存到localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ 用户信息已保存:', user);
        
        // 清除URL参数
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // 触发用户状态更新事件
        window.dispatchEvent(new CustomEvent('userLogin', { detail: user }));
        
        // 如果页面有刷新函数，调用它
        if (typeof window.location.reload === 'function') {
            setTimeout(() => window.location.reload(), 100);
        }
    }

    // 检查localStorage中的用户
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            console.log('📦 从localStorage加载用户:', user);
            // 触发用户状态更新事件
            window.dispatchEvent(new CustomEvent('userLogin', { detail: user }));
        } catch (error) {
            console.error('❌ localStorage用户数据格式错误:', error);
            localStorage.removeItem('user');
        }
    }
})();