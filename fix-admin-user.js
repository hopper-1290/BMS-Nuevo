#!/usr/bin/env node

/**
 * Fix Admin User Password
 * Updates the admin user with correct credentials and data
 */

import { query, transaction } from './config/database.js';
import { hashPassword } from './config/auth.js';

async function fixAdminUser() {
    try {
        console.log('\n🔧 Fixing Admin User Credentials...\n');

        // Delete existing admin and related records
        console.log('🗑️  Removing old admin user...');
        
        await transaction(async (client) => {
            // Get admin user ID first
            const adminResult = await client.query(
                `SELECT id FROM users WHERE LOWER(username) = 'admin'`
            );

            if (adminResult.rows.length > 0) {
                const adminId = adminResult.rows[0].id;

                // Delete from related tables first (foreign key constraints)
                await client.query('DELETE FROM sessions WHERE user_id = $1', [adminId]);
                await client.query('DELETE FROM login_attempts WHERE identifier = $1', ['admin']);
                await client.query('DELETE FROM audit_logs WHERE resource_id = $1', [adminId]);
                
                // Delete the user
                await client.query('DELETE FROM users WHERE id = $1', [adminId]);
                console.log('   ✅ Old admin user removed');
            }
        });

        // Create new admin user with correct data
        console.log('\n📝 Creating new admin user with correct credentials...');

        const newAdminData = {
            username: 'admin',
            email: 'eugenemaddela9@gmail.com',
            password: 'admin123',
            firstName: 'Eugene',
            lastName: 'Maddela',
            dateOfBirth: '2005-09-30',
            phoneNumber: '09987654321',
            purok: 'Zone 4',
            role: 'admin',
            status: 'active'
        };

        const hashedPassword = await hashPassword(newAdminData.password);

        const result = await transaction(async (client) => {
            // Insert new admin user
            const userResult = await client.query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, phone_number, purok, role, status, verified_at, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
                 RETURNING id, username, email, role, status, first_name, last_name`,
                [
                    newAdminData.username.toLowerCase(),
                    newAdminData.email.toLowerCase(),
                    hashedPassword,
                    newAdminData.firstName,
                    newAdminData.lastName,
                    newAdminData.dateOfBirth,
                    newAdminData.phoneNumber,
                    newAdminData.purok,
                    newAdminData.role,
                    newAdminData.status
                ]
            );

            const newUser = userResult.rows[0];
            console.log('   ✅ New admin user created');

            // Log the action
            await client.query(
                `INSERT INTO audit_logs (action_type, resource_type, resource_id, details, ip_address, user_agent, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [
                    'ADMIN_USER_RESET',
                    'users',
                    newUser.id,
                    JSON.stringify({
                        username: newAdminData.username,
                        email: newAdminData.email,
                        name: `${newAdminData.firstName} ${newAdminData.lastName}`
                    }),
                    'SYSTEM',
                    'fix-admin-user.js'
                ]
            );

            return newUser;
        });

        console.log('\n✅ Admin User Updated Successfully!\n');
        console.log('📋 Admin Account Details:');
        console.log(`   Username: ${result.username}`);
        console.log(`   Email: ${result.email}`);
        console.log(`   Name: ${result.first_name} ${result.last_name}`);
        console.log(`   Role: ${result.role}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   ID: ${result.id}\n`);
        console.log('🔑 Login Credentials:');
        console.log(`   Username: admin`);
        console.log(`   Password: admin123\n`);

        return true;

    } catch (error) {
        console.error('\n❌ Error fixing admin user:', error.message);
        console.error(error);
        return false;
    } finally {
        process.exit(0);
    }
}

console.log('🚀 BMS Admin User Fix');
fixAdminUser();
