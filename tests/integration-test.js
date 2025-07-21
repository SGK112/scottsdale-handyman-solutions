#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('🧪 Running integration tests...\n');

// Test configuration
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3000';
const API_BASE = `${BACKEND_URL}/api`;

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Integration-Test'
      }
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test function
async function runTest(name, testFn) {
  try {
    await testFn();
    console.log(`✅ ${name}`);
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASS' });
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAIL', error: error.message });
  }
}

// Test suite
async function runTests() {
  console.log('Testing backend API endpoints...\n');

  // Test backend health
  await runTest('Backend server is running', async () => {
    const response = await makeRequest(`${BACKEND_URL}/`);
    if (response.statusCode !== 200 && response.statusCode !== 404) {
      throw new Error(`Expected 200 or 404, got ${response.statusCode}`);
    }
  });

  // Test API proxy (if frontend is running)
  await runTest('API proxy configuration', async () => {
    try {
      const response = await makeRequest(`${FRONTEND_URL}/api/`);
      // Should get response from backend through proxy
      if (response.statusCode >= 500) {
        throw new Error(`Proxy error: ${response.statusCode}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' && error.port === 5173) {
        console.log('   ℹ️  Frontend not running, skipping proxy test');
        return;
      }
      throw error;
    }
  });

  // Test chatbot logging endpoint
  await runTest('Chatbot logging endpoint', async () => {
    const testData = {
      conversation: [
        { role: 'user', content: 'Test message' },
        { role: 'assistant', content: 'Test response' }
      ],
      userEmail: 'test@example.com',
      timestamp: new Date().toISOString()
    };

    const response = await makeRequest(`${API_BASE}/chatbot-log`, 'POST', testData);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
  });

  // Test gallery images endpoint
  await runTest('Gallery images endpoint', async () => {
    const response = await makeRequest(`${API_BASE}/gallery-images`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }

    // Should return JSON array
    try {
      const data = JSON.parse(response.body);
      if (!Array.isArray(data)) {
        throw new Error('Response should be an array');
      }
    } catch (e) {
      throw new Error('Response should be valid JSON');
    }
  });

  // Test Stripe configuration endpoint
  await runTest('Stripe configuration endpoint', async () => {
    const response = await makeRequest(`${API_BASE}/stripe-config`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }

    try {
      const data = JSON.parse(response.body);
      if (!data.publishableKey) {
        throw new Error('Should return publishable key');
      }
    } catch (e) {
      throw new Error('Response should contain Stripe config');
    }
  });

  // Test CORS headers
  await runTest('CORS headers present', async () => {
    const response = await makeRequest(`${API_BASE}/gallery-images`);
    if (!response.headers['access-control-allow-origin']) {
      throw new Error('Missing CORS headers');
    }
  });

  // Test admin endpoint (should require auth)
  await runTest('Admin endpoint security', async () => {
    const response = await makeRequest(`${API_BASE}/submissions`);
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Admin endpoint should require authentication');
    }
  });

  // Test static file serving (production)
  await runTest('Static file serving configuration', async () => {
    const response = await makeRequest(`${BACKEND_URL}/favicon.ico`);
    // Should either serve file or return 404, not 500
    if (response.statusCode >= 500) {
      throw new Error('Static file serving error');
    }
  });

  // Test environment validation
  await runTest('Environment configuration', async () => {
    // Check if critical files exist
    const fs = require('fs');
    if (!fs.existsSync('main.py')) {
      throw new Error('main.py not found');
    }
    if (!fs.existsSync('App.jsx')) {
      throw new Error('App.jsx not found');
    }
    if (!fs.existsSync('vite.config.js')) {
      throw new Error('vite.config.js not found');
    }
  });

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log('\n🔍 Failed Tests:');
    testResults.tests.filter(t => t.status === 'FAIL').forEach(test => {
      console.log(`   • ${test.name}: ${test.error}`);
    });
  }

  console.log('\n💡 Next Steps:');
  if (testResults.failed === 0) {
    console.log('🎉 All tests passed! Your integration is working correctly.');
  } else {
    console.log('🔧 Fix the failing tests above and run again.');
  }

  console.log('\nTesting checklist:');
  console.log('□ Frontend accessible at http://localhost:5173');
  console.log('□ Backend API accessible at http://localhost:3000/api/');
  console.log('□ Admin panel loads with ?admin=true parameter');
  console.log('□ Chat widget appears and functions');
  console.log('□ Contact forms submit successfully');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
