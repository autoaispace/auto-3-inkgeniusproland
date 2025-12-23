// 快速测试不同的 Whop URL 格式
console.log('🔍 测试 Whop URL 格式');

const planId = 'plan_AvXNl6DA1jtOj';
const oldProductId = '8429d376-ddb2-4fb6-bebf-b81b25deff04';

// 可能的URL格式
const urlFormats = [
    `https://whop.com/${planId}/`,                          // 格式1: 直接计划ID
    `https://whop.com/checkout/${planId}/`,                 // 格式2: checkout路径
    `https://whop.com/plan/${planId}/`,                     // 格式3: plan路径
    `https://checkout.whop.com/${planId}/`,                 // 格式4: checkout子域名
    `https://whop.com/products/${planId}/`,                 // 格式5: products路径
    `https://whop.com/${oldProductId}/test-7d-00b2/`,       // 格式6: 旧格式对比
];

console.log('\n📋 可能的URL格式:');
urlFormats.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
});

// 测试函数
function testUrls() {
    console.log('\n🧪 开始测试URL...');
    
    urlFormats.forEach((baseUrl, index) => {
        const params = new URLSearchParams({
            'metadata[user_id]': '6948dc4897532de886ec876d',
            'metadata[user_email]': 'test@example.com',
            'metadata[package_id]': 'credits_1000',
            'metadata[credits]': '1000',
        });
        
        const fullUrl = `${baseUrl}?${params.toString()}`;
        
        console.log(`\n🔗 格式${index + 1}:`);
        console.log(fullUrl);
        
        // 在浏览器中可以这样测试
        if (typeof window !== 'undefined') {
            const link = document.createElement('a');
            link.href = fullUrl;
            link.target = '_blank';
            link.textContent = `测试格式${index + 1}`;
            link.style.display = 'block';
            link.style.margin = '5px 0';
            link.style.padding = '5px';
            link.style.background = '#007bff';
            link.style.color = 'white';
            link.style.textDecoration = 'none';
            link.style.borderRadius = '4px';
            
            document.body.appendChild(link);
        }
    });
}

// 如果在浏览器中运行
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', testUrls);
} else {
    // 如果在Node.js中运行
    testUrls();
}

console.log('\n💡 建议:');
console.log('1. 检查 Whop 后台中的计划ID是否正确');
console.log('2. 确认计划是否已发布/激活');
console.log('3. 尝试不同的URL格式');
console.log('4. 查看 Whop 文档了解正确的URL格式');
console.log('5. 考虑使用 Whop API 而不是直接链接');