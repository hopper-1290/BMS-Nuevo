// ============================================================================
// Authentication Utilities
// ============================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'bms_secret_key_2025';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// ============================================================================
// Password Hashing
// ============================================================================

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// ============================================================================
// JWT Tokens
// ============================================================================

export const generateAccessToken = (userId, userRole = 'resident') => {
    return jwt.sign(
        {
            userId,
            role: userRole,
            type: 'access'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId,
            type: 'refresh'
        },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

export const verifyToken = (token, type = 'access') => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== type) {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

// ============================================================================
// Token Hashing (for database storage)
// ============================================================================

export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const compareTokens = (token, hash) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return tokenHash === hash;
};

// ============================================================================
// Random Token Generation
// ============================================================================

export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// ============================================================================
// Session Cookie Options
// ============================================================================

export const getCookieOptions = (rememberMe = false) => {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 24 hours
    
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge
    };
};

// ============================================================================
// Email Validation
// ============================================================================

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ============================================================================
// Password Validation
// ============================================================================

export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// ============================================================================
// Username Validation
// ============================================================================

export const validateUsername = (username) => {
    const errors = [];
    
    if (username.length < 3 || username.length > 20) {
        errors.push('Username must be between 3 and 20 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// ============================================================================
// Phone Validation
// ============================================================================

export const validatePhoneNumber = (phone) => {
    // Philippine formats: 09XXXXXXXXX or +639XXXXXXXXX
    const phoneRegex = /^(\+?63|09)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};

// ============================================================================
// Age Validation (DOB)
// ============================================================================

export const validateAge = (dateOfBirth, minAge = 16, maxAge = 90) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (isNaN(birthDate.getTime())) {
        return { isValid: false, error: 'Invalid date format' };
    }
    
    if (birthDate > today) {
        return { isValid: false, error: 'Date of birth cannot be in the future' };
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < minAge) {
        return { isValid: false, error: `Must be at least ${minAge} years old` };
    }
    
    if (age > maxAge) {
        return { isValid: false, error: `Age cannot exceed ${maxAge} years` };
    }
    
    return { isValid: true, age };
};

export const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};
