/* 
 * Imperial Watches - Setup Script
 * College project by Maulik Joshi and team
 * This script helps set up the database and install dependencies
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🏗️  Imperial Watches - Setup Script');
console.log('=====================================\n');

// Check if Node.js is installed
console.log('📋 Checking system requirements...');

const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

if (parseInt(nodeVersion.split('.')[0].substring(1)) < 14) {
    console.error('❌ Node.js version 14 or higher is required');
    process.exit(1);
}

// Create necessary directories
console.log('\n📁 Creating directories...');

const directories = ['database', 'logs', 'uploads'];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    } else {
        console.log(`📁 Directory already exists: ${dir}`);
    }
});

// Check if package.json exists
console.log('\n📦 Checking dependencies...');

if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

// Install npm dependencies
console.log('\n⬇️  Installing npm dependencies...');

exec('npm install', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error installing dependencies: ${error}`);
        return;
    }
    
    if (stderr) {
        console.log(`⚠️  Warnings: ${stderr}`);
    }
    
    console.log('✅ Dependencies installed successfully');
    
    // Test database connection
    console.log('\n🗄️  Testing database setup...');
    
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = './database/watches.db';
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(`❌ Database connection failed: ${err.message}`);
            return;
        }
        
        console.log('✅ Database connection successful');
        
        // Check if tables exist
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
            if (err) {
                console.error(`❌ Error checking tables: ${err.message}`);
                return;
            }
            
            console.log(`📊 Found ${tables.length} tables in database`);
            tables.forEach(table => {
                console.log(`   - ${table.name}`);
            });
            
            db.close((err) => {
                if (err) {
                    console.error(`❌ Error closing database: ${err.message}`);
                    return;
                }
                
                console.log('\n🎉 Setup completed successfully!');
                console.log('\n📝 Next steps:');
                console.log('   1. Run: npm start');
                console.log('   2. Open: http://localhost:3000');
                console.log('   3. Enjoy your luxury watch e-commerce site!');
                console.log('\n💡 For development, use: npm run dev');
                console.log('\n🔗 API Endpoints:');
                console.log('   - GET /api/products - List all watches');
                console.log('   - GET /api/products/:id - Get specific watch');
                console.log('   - GET /api/search?q=query - Search watches');
                console.log('   - POST /api/orders - Create new order');
                console.log('   - GET /api/stats - Get statistics');
            });
        });
    });
});
