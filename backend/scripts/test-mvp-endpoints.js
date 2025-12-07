// Test script for MVP endpoints
// Run with: node scripts/test-mvp-endpoints.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';
const TEST_EMAIL = 'test@dharmaenruta.com';

async function testEndpoints() {
    console.log('🧪 Testing MVP Endpoints\n');

    try {
        // Test 1: Health check
        console.log('1️⃣ Testing health endpoint...');
        const health = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ Health check:', health.data);

        // Test 2: Create MVP checkout
        console.log('\n2️⃣ Testing MVP checkout creation...');
        const checkout = await axios.post(`${BASE_URL}/api/mvp/checkout`, {
            email: TEST_EMAIL
        });
        console.log('✅ Checkout session created');
        console.log('   Session ID:', checkout.data.sessionId);
        console.log('   Checkout URL:', checkout.data.url);

        console.log('\n✅ All tests passed!');
        console.log('\n📝 Next steps:');
        console.log('   1. Visit the checkout URL in a browser');
        console.log('   2. Use Stripe test card: 4242 4242 4242 4242');
        console.log('   3. Any future date and CVC');
        console.log('   4. Complete the purchase');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Check if server is running
axios.get(`${BASE_URL}/api/health`)
    .then(() => {
        console.log('✅ Backend server is running\n');
        testEndpoints();
    })
    .catch(() => {
        console.error('❌ Backend server is not running!');
        console.error('   Please start it with: npm run dev');
        process.exit(1);
    });
