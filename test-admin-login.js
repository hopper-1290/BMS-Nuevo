#!/usr/bin/env node

/**
 * Test Admin Login - Direct Database Check
 * This script verifies admin credentials and the login flow
 */

import { query } from './config/database.js';
import { comparePassword, hashPassword } from './config/auth.js';

async function testAdminLogin() {
    try {
        console.log('\n🔍 Checking admin user in database...\n');

        // Check if admin exists
        const result = await query(
            `SELECT id, username, email, password_hash, role, status, first_name, last_name 
             FROM users 
             WHERE LOWER(username) = 'admin' OR LOWER(email) = 'eugenemaddela9@gmail.com'`
        );

        if (result.rows.length === 0) {
            console.log('❌ Admin user NOT found in database');
            console.log('📋 Need to seed the database first');
            return false;
        }

        const adminUser = result.rows[0];
        console.log('✅ Admin user found:');
        console.log(`   ID: ${adminUser.id}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Role: ${adminUser.role}`);
        console.log(`   Status: ${adminUser.status}`);
        console.log(`   Name: ${adminUser.first_name} ${adminUser.last_name}`);
        console.log(`   Password Hash: ${adminUser.password_hash.substring(0, 20)}...`);

        // Test password comparison
        console.log('\n🔐 Testing password verification...');
        const passwordMatches = await comparePassword('admin123', adminUser.password_hash);

        if (passwordMatches) {
            console.log('✅ Password verification PASSED');
            console.log('   Password "admin123" matches stored hash');
        } else {
            console.log('❌ Password verification FAILED');
            console.log('   Password "admin123" does NOT match stored hash');
        }

        // Check account status
        console.log('\n📊 Account Status Check:');
        if (adminUser.status === 'active') {
            console.log('✅ Account is ACTIVE');
        } else {
            console.log(`❌ Account status is: ${adminUser.status}`);
            console.log('   Account must be "active" to login');
        }

        console.log('\n' + '='.repeat(60));
        if (passwordMatches && adminUser.status === 'active') {
            console.log('🎉 LOGIN TEST: ALL CHECKS PASSED');
            console.log('   Admin can successfully login with admin123');
        } else {
            console.log('⚠️  LOGIN TEST: FAILED - Issues found above');
        }
        console.log('='.repeat(60) + '\n');

        return passwordMatches && adminUser.status === 'active';

    } catch (error) {
        console.error('\n❌ Database Error:', error.message);
        return false;
    } finally {
        process.exit(0);
    }
}

console.log('🚀 BMS Admin Login Verification');
testAdminLogin();
