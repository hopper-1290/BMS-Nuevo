// ============================================================================
// Database Initialization Script
// Setup CockroachDB schema and seed initial data
// ============================================================================

import dotenv from 'dotenv';
import { query, transaction } from '../config/database.js';
import { hashPassword } from '../config/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function initializeDatabase() {
    try {
        console.log('🔄 Starting database initialization...\n');
        
        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by statements and execute
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const stmt of statements) {
            if (stmt.trim()) {
                try {
                    console.log(`📝 Executing: ${stmt.substring(0, 60)}...`);
                    await query(stmt.trim());
                    await delay(100); // Small delay between statements
                } catch (error) {
                    if (error.message.includes('already exists')) {
                        console.log('   ℹ️  Table already exists (skipping)');
                    } else {
                        console.error('   ❌ Error:', error.message);
                    }
                }
            }
        }
        
        console.log('\n✅ Database schema initialized successfully!\n');
        
        // Seed initial data
        await seedInitialData();
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

async function seedInitialData() {
    try {
        console.log('🌱 Seeding initial data...\n');
        
        const adminPassword = await hashPassword('Admin@123456');
        const residentPassword = await hashPassword('Resident@12345');
        
        // Check if admin already exists
        const adminCheck = await query(
            'SELECT id FROM users WHERE username = $1',
            ['admin']
        );
        
        if (adminCheck.rows.length === 0) {
            // Insert admin user
            const adminResult = await query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, phone_number, purok, role, status, verified_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                 RETURNING id`,
                ['admin', 'admin@bms.local', adminPassword, 'Admin', 'User', '1990-01-01', '09171234567', 'Main', 'admin', 'active']
            );
            console.log('✓ Admin user created (admin / Admin@123456)');
            
            // Insert clerk user
            const clerkResult = await query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, phone_number, purok, role, status, verified_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                 RETURNING id`,
                ['clerk', 'clerk@bms.local', residentPassword, 'Clerk', 'Maria', '1995-05-15', '09181234567', 'Main', 'clerk', 'active']
            );
            console.log('✓ Clerk user created (clerk / Resident@12345)');
            
            // Insert demo resident
            const residentResult = await query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, phone_number, purok, role, status, verified_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                 RETURNING id`,
                ['resident1', 'resident@bms.local', residentPassword, 'Juan', 'Dela Cruz', '1985-03-20', '09191234567', 'Zone A', 'resident', 'active']
            );
            console.log('✓ Demo resident created (resident1 / Resident@12345)');
            
            // Create residents profile for demo resident
            await query(
                `INSERT INTO residents (user_id, first_name, last_name, date_of_birth, sex, civil_status, purok, contact_number)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [residentResult.rows[0].id, 'Juan', 'Dela Cruz', '1985-03-20', 'M', 'Married', 'Zone A', '09191234567']
            );
            console.log('✓ Resident profile created');
            
        } else {
            console.log('ℹ️  Users already exist (skipping seed)');
        }
        
        console.log('\n✅ Database seeded successfully!\n');
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

// Run initialization
initializeDatabase().then(() => {
    console.log('✨ Database setup complete!');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
