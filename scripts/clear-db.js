/**
 * Script to clear all MongoDB data
 * Run with: node scripts/clear-db.js
 * Or: npm run clear-db
 */

// Try loading .env.local first, then .env
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // .env.local might not exist
}
try {
  require('dotenv').config({ path: '.env' });
} catch (e) {
  // .env might not exist
}
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function clearDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'codeverse' });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n🗑️  Found ${collections.length} collections to clear...`);
    
    for (const collection of collections) {
      const result = await db.collection(collection.name).deleteMany({});
      console.log(`   ✓ Cleared ${collection.name}: ${result.deletedCount} documents`);
    }

    console.log('\n✅ Database cleared successfully!');
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

clearDatabase();

