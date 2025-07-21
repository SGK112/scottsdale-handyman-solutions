#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating development environment...\n');

// Check Node.js version
const nodeVersion = process.version;
const requiredNodeVersion = '18.0.0';
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check for Python
try {
  const { execSync } = require('child_process');
  const pythonVersion = execSync('python --version 2>&1', { encoding: 'utf-8' });
  console.log(`✅ Python version: ${pythonVersion.trim()}`);
} catch (error) {
  console.log('❌ Python not found. Please install Python 3.11+');
}

// Check required files
const requiredFiles = [
  'App.jsx',
  'ChatbotWidget.jsx',
  'main.py',
  'requirements.txt',
  'vite.config.js',
  'render.yaml'
];

console.log('\n📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

// Check package.json dependencies
console.log('\n📦 Checking key dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const keyDeps = ['react', 'vite', '@vitejs/plugin-react', 'tailwindcss', 'lucide-react'];

keyDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - Missing!`);
  }
});

// Check for environment files
console.log('\n🔧 Environment configuration...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file found');
} else {
  console.log('ℹ️  .env file not found (optional for development)');
}

if (fs.existsSync('.env.example')) {
  console.log('✅ .env.example file found');
} else {
  console.log('⚠️  .env.example file not found');
}

// Validate proxy configuration
console.log('\n🔌 Checking proxy configuration...');
try {
  const viteConfig = fs.readFileSync('vite.config.js', 'utf-8');
  if (viteConfig.includes('target: \'http://localhost:3000\'')) {
    console.log('✅ Vite proxy configured for port 3000');
  } else {
    console.log('⚠️  Vite proxy configuration may be incorrect');
  }
} catch (error) {
  console.log('❌ Could not read vite.config.js');
}

// Check Flask port configuration
console.log('\n🐍 Checking Flask configuration...');
try {
  const mainPy = fs.readFileSync('main.py', 'utf-8');
  if (mainPy.includes('port=3000')) {
    console.log('✅ Flask configured to run on port 3000');
  } else {
    console.log('⚠️  Flask port configuration may be incorrect');
  }
} catch (error) {
  console.log('❌ Could not read main.py');
}

console.log('\n🚀 Environment validation complete!');
console.log('\nNext steps:');
console.log('1. Run "npm install" to install frontend dependencies');
console.log('2. Run "pip install -r requirements.txt" to install backend dependencies');
console.log('3. Run "npm run dev:full" to start both frontend and backend');
console.log('4. Visit http://localhost:5173 to see the application');
console.log('5. Test admin access with http://localhost:5173?admin=true');
