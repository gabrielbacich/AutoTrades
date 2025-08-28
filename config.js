require('dotenv').config();

function validateEnvVars() {
    const requiredVars = [
        'ACCOUNT1_USERNAME', 'ACCOUNT1_PASSWORD', 'ACCOUNT1_SHARED_SECRET', 
        'ACCOUNT1_IDENTITY_SECRET', 'ACCOUNT1_TRADELINK',
        'ACCOUNT2_USERNAME', 'ACCOUNT2_PASSWORD', 'ACCOUNT2_SHARED_SECRET', 
        'ACCOUNT2_IDENTITY_SECRET', 'ACCOUNT2_TRADELINK',
        'GAME_CODE'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ ERROR: Missing environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.error('\n💡 SOLUTION:');
        console.error('1. Copy "env.example" to ".env"');
        console.error('2. Fill all variables in the .env file');
        console.error('3. Save the file and try again\n');
        process.exit(1);
    }
}

validateEnvVars();

module.exports = {
    account1: {
        shared_secret: process.env.ACCOUNT1_SHARED_SECRET,
        identity_secret: process.env.ACCOUNT1_IDENTITY_SECRET,
        username: process.env.ACCOUNT1_USERNAME,
        password: process.env.ACCOUNT1_PASSWORD,
        tradelink: process.env.ACCOUNT1_TRADELINK
    },
    account2: {
        shared_secret: process.env.ACCOUNT2_SHARED_SECRET,
        identity_secret: process.env.ACCOUNT2_IDENTITY_SECRET,
        username: process.env.ACCOUNT2_USERNAME,
        password: process.env.ACCOUNT2_PASSWORD,
        tradelink: process.env.ACCOUNT2_TRADELINK
    },
    gameCode: parseInt(process.env.GAME_CODE) || 440,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 5,
    operationTimeout: parseInt(process.env.OPERATION_TIMEOUT) || 30000,
    port: parseInt(process.env.PORT) || 8080
};
