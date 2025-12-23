// Whop API 深度诊断脚本
import crypto from 'crypto';

const WHOP_CONFIG = {
  API_KEY: 'apik_fyoI9W7S8OmPg_C3874913_C_d697a279f365b833c10c337b40a2b5c8b3be49c694d4efdec3b2d6f59f36fe',
  COMPANY_ID: 'biz_WsbzpUKOA4tjCs',
  PLAN_ID: 'plan_5Wc0DVhD7zmNn',
  BASE_URL: 'https://api.whop.com/api/v2'
};

// 测试不同的 API 端点和方法
async function comprehensiveDiagnosis() {
  console.log('🔍 Whop API 深度诊断');
  console.log('=' .repeat(60));
  console.log(`🔐 API Key: ${WHOP_CONFIG.API_KEY.substring(0, 30)}...`);
  console.log(`🏢 Company: ${WHOP_CONFIG.COMPANY_ID}`);
  console.log(`📋 Plan: ${WHOP_CONFIG.PLAN_ID}`);
  console.log('');

  const diagnosticTests = [
    {
      name: '🔑 API Key Format Check',
      test: () => {
        const keyPattern = /^apik_[a-zA-Z0-9_]+$/;
        const isValid = keyPattern.test(WHOP_CONFIG.API_KEY);
        console.log(`   Format: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        console.log(`   Length: ${WHOP_CONFIG.API_KEY.length} chars`);
        return isValid;
      }
    },
    {
      name: '🌐 API Base URL Connectivity',
      test: async () => {
        try {
          const response = await fetch('https://api.whop.com/health');
          console.log(`   Status: ${response.status}`);
          return response.ok;
        } catch (error) {
          console.log(`   Error: ${error.message}`);
          return false;
        }
      }
    },
    {
      name: '🔐 Authorization Header Test',
      test: async () => {
        try {
          const response = await fetch(`${WHOP_CONFIG.BASE_URL}/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
              'Content-Type': 'application/json',
              'User-Agent': 'InkGenius-Test/1.0'
            }
          });
          
          const result = await response.text();
          console.log(`   Status: ${response.status} ${response.statusText}`);
          console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
          
          if (result) {
            try {
              const jsonResult = JSON.parse(result);
              console.log(`   Response: ${JSON.stringify(jsonResult, null, 2)}`);
            } catch {
              console.log(`   Response: ${result.substring(0, 200)}...`);
            }
          }
          
          return response.ok;
        } catch (error) {
          console.log(`   Error: ${error.message}`);
          return false;
        }
      }
    },
    {
      name: '📋 Alternative Plan Endpoint Test',
      test: async () => {
        try {
          // 尝试不同的端点格式
          const endpoints = [
            `/plans/${WHOP_CONFIG.PLAN_ID}`,
            `/v2/plans/${WHOP_CONFIG.PLAN_ID}`,
            `/plans?id=${WHOP_CONFIG.PLAN_ID}`
          ];
          
          for (const endpoint of endpoints) {
            console.log(`   Testing: ${endpoint}`);
            const response = await fetch(`${WHOP_CONFIG.BASE_URL}${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log(`   Status: ${response.status}`);
            if (response.ok) {
              const result = await response.json();
              console.log(`   ✅ Success with: ${endpoint}`);
              console.log(`   Plan Name: ${result.name || 'N/A'}`);
              return true;
            }
          }
          return false;
        } catch (error) {
          console.log(`   Error: ${error.message}`);
          return false;
        }
      }
    },
    {
      name: '🏢 Company Endpoint Test',
      test: async () => {
        try {
          const response = await fetch(`${WHOP_CONFIG.BASE_URL}/companies/${WHOP_CONFIG.COMPANY_ID}`, {
            headers: {
              'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`   Status: ${response.status}`);
          if (response.ok) {
            const result = await response.json();
            console.log(`   Company Name: ${result.name || 'N/A'}`);
            return true;
          } else {
            const error = await response.text();
            console.log(`   Error: ${error}`);
          }
          return false;
        } catch (error) {
          console.log(`   Error: ${error.message}`);
          return false;
        }
      }
    },
    {
      name: '💳 Checkout Session Test (Minimal)',
      test: async () => {
        try {
          const minimalPayload = {
            plan_id: WHOP_CONFIG.PLAN_ID,
            customer_email: 'test@example.com'
          };
          
          console.log(`   Payload: ${JSON.stringify(minimalPayload)}`);
          
          const response = await fetch(`${WHOP_CONFIG.BASE_URL}/checkout/sessions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WHOP_CONFIG.API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(minimalPayload)
          });
          
          console.log(`   Status: ${response.status}`);
          const result = await response.text();
          
          if (response.ok) {
            const jsonResult = JSON.parse(result);
            console.log(`   ✅ Checkout URL: ${jsonResult.checkout_url || 'N/A'}`);
            return true;
          } else {
            console.log(`   Error: ${result}`);
          }
          return false;
        } catch (error) {
          console.log(`   Error: ${error.message}`);
          return false;
        }
      }
    }
  ];

  let passedTests = 0;
  
  for (const diagnostic of diagnosticTests) {
    console.log(`\n${diagnostic.name}`);
    try {
      const result = await diagnostic.test();
      if (result) {
        passedTests++;
        console.log(`   ✅ PASSED`);
      } else {
        console.log(`   ❌ FAILED`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Diagnostic Results: ${passedTests}/${diagnosticTests.length} passed`);
  
  // 提供具体建议
  console.log('\n🔧 Troubleshooting Suggestions:');
  
  if (passedTests === 0) {
    console.log('❌ Complete API failure - possible causes:');
    console.log('   1. API key is invalid or expired');
    console.log('   2. Network connectivity issues');
    console.log('   3. Whop API service is down');
    console.log('\n💡 Recommended actions:');
    console.log('   1. Generate a new API key in Whop Dashboard');
    console.log('   2. Check your internet connection');
    console.log('   3. Verify Whop service status');
  } else if (passedTests < diagnosticTests.length) {
    console.log('⚠️  Partial API access - possible causes:');
    console.log('   1. Some API endpoints require specific permissions');
    console.log('   2. API key has limited scope');
    console.log('   3. Some resources may not exist');
    console.log('\n💡 Recommended actions:');
    console.log('   1. Check API key permissions in Whop Dashboard');
    console.log('   2. Verify resource IDs (company_id, plan_id)');
    console.log('   3. Contact Whop support if owner permissions should work');
  } else {
    console.log('✅ All diagnostics passed! API should be working correctly.');
  }
}

// 运行诊断
comprehensiveDiagnosis().catch(console.error);