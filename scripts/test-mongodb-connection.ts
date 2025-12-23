#!/usr/bin/env tsx
/**
 * Test MongoDB connection before running Prisma commands
 */

import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env file!')
    console.log('\n📝 Please create a .env file with:')
    console.log('   DATABASE_URL="mongodb://localhost:27017/kenmark-bot"')
    console.log('   Or for MongoDB Atlas:')
    console.log('   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/kenmark-bot"')
    process.exit(1)
  }

  console.log('🔍 Testing MongoDB connection...')
  console.log(`📍 Connection string: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`) // Hide credentials

  try {
    const client = new MongoClient(databaseUrl)
    
    await client.connect()
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test database access
    const db = client.db()
    const collections = await db.listCollections().toArray()
    console.log(`📊 Database: ${db.databaseName}`)
    console.log(`📁 Collections: ${collections.length}`)
    
    await client.close()
    console.log('\n✅ Connection test passed! You can now run:')
    console.log('   npm run prisma:generate')
    console.log('   npm run prisma:push')
  } catch (error: any) {
    console.error('\n❌ Connection failed!')
    console.error(`Error: ${error.message}`)
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('refused')) {
      console.log('\n💡 MongoDB is not running or not accessible.')
      console.log('\n📖 Solutions:')
      console.log('   1. For Local MongoDB:')
      console.log('      - Install MongoDB Community Server')
      console.log('      - Start MongoDB service')
      console.log('      - See MONGODB_SETUP.md for details')
      console.log('\n   2. For MongoDB Atlas (Recommended):')
      console.log('      - Sign up at https://mongodb.com/cloud/atlas')
      console.log('      - Create free cluster')
      console.log('      - Get connection string')
      console.log('      - Update DATABASE_URL in .env')
      console.log('      - See MONGODB_SETUP.md for detailed steps')
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed.')
      console.log('   - Check username and password in DATABASE_URL')
      console.log('   - Ensure database user has proper permissions')
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Connection timeout.')
      console.log('   - Check internet connection (for Atlas)')
      console.log('   - Verify IP whitelist in MongoDB Atlas')
      console.log('   - Check firewall settings')
    }
    
    console.log('\n📚 For detailed setup instructions, see: MONGODB_SETUP.md')
    process.exit(1)
  }
}

testConnection()

