const { Client } = require('pg');

const testConnection = async () => {
  console.log('🔍 Testing database connection...');
  
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_G8kmFTg7uExo@ep-cold-sound-a1vsqhpk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  });

  try {
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version);
    
    await client.end();
    console.log('👋 Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      severity: error.severity,
      detail: error.detail
    });
  }
};

testConnection();