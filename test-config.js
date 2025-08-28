#!/usr/bin/env node

console.log('🔍 Testing Steam Trade Farm configuration...\n');

try {
    const config = require('./config.js');
    
    console.log('✅ Configuration file loaded successfully!');
    console.log('\n📋 Detected settings:');
    console.log(`   🎮 Game: ${config.gameCode}`);
    console.log(`   👤 Account 1: ${config.account1.username}`);
    console.log(`   👤 Account 2: ${config.account2.username}`);
    console.log(`   🔄 Max Retries: ${config.maxRetries}`);
    console.log(`   🌐 Port: ${config.port}`);
    
    const exampleValues = [
        'your_username_1',
        'your_username_2', 
        'your_shared_secret_1_here=',
        'your_shared_secret_2_here='
    ];
    
    const hasExampleValues = 
        exampleValues.includes(config.account1.username) ||
        exampleValues.includes(config.account2.username) ||
        exampleValues.includes(config.account1.shared_secret) ||
        exampleValues.includes(config.account2.shared_secret);
    
    if (hasExampleValues) {
        console.log('\n⚠️  WARNING: There are still example values in the .env file');
        console.log('   Please replace all example values with your real credentials');
    } else {
        console.log('\n✅ All settings appear to be filled!');
    }
    
    if (config.account1.shared_secret && config.account1.shared_secret.endsWith('=')) {
        console.log('✅ Account 1 shared secret has valid format');
    } else {
        console.log('⚠️  Account 1 shared secret may be in incorrect format');
    }
    
    if (config.account2.shared_secret && config.account2.shared_secret.endsWith('=')) {
        console.log('✅ Account 2 shared secret has valid format');
    } else {
        console.log('⚠️  Account 2 shared secret may be in incorrect format');
    }
    
    console.log('\n🚀 Valid configuration! You can run the bot with: npm start');
    
} catch (error) {
    console.error('❌ ERROR in configuration:');
    console.error(error.message);
    console.log('\n💡 SOLUTIONS:');
    console.log('1. Check if the .env file exists');
    console.log('2. Make sure all variables are filled');
    console.log('3. Run: cp env.example .env (if you don\'t have the .env file)');
    process.exit(1);
}
