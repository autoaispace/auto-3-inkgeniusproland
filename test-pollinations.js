// 测试 Pollinations.ai API 的简单脚本
import fetch from 'node-fetch';

async function testPollinations() {
    console.log('🧪 测试 Pollinations.ai API...');
    
    const prompt = 'dragon tattoo design black and white line art';
    const encodedPrompt = encodeURIComponent(`professional tattoo design, ${prompt}, high contrast, clean lines, tattoo stencil, detailed artwork`);
    
    const params = new URLSearchParams({
        width: '512',
        height: '512',
        seed: '12345',
        model: 'flux',
        enhance: 'true'
    });
    
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    
    console.log('📡 请求URL:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'InkGenius-Pro/1.0',
                'Accept': 'image/*'
            }
        });
        
        console.log('📊 响应状态:', response.status, response.statusText);
        console.log('📋 内容类型:', response.headers.get('content-type'));
        console.log('📏 内容长度:', response.headers.get('content-length'));
        
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.startsWith('image/')) {
                console.log('✅ 成功获取图像数据');
                console.log('🎯 API测试通过！');
                return true;
            } else {
                console.log('❌ 返回的不是图像数据');
                return false;
            }
        } else {
            console.log('❌ API请求失败');
            return false;
        }
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        return false;
    }
}

// 运行测试
testPollinations().then(success => {
    if (success) {
        console.log('\n🎉 Pollinations.ai 集成准备就绪！');
        console.log('💡 建议立即部署更新的服务');
    } else {
        console.log('\n⚠️ 需要进一步调试 Pollinations.ai 集成');
    }
});