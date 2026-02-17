/**
 * Auth Service - Business Logic for Authentication
 * 
 * INTERVIEW POINT (SOLID - SRP):
 * - Service handles ONLY auth business logic
 * - Does NOT handle HTTP request/response (that's controller's job)
 * - Does NOT access DB directly (that's repository's job)
 */
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const logger = require('../config/logger');

class AuthService {
    generateTokens(user) {
        const payload = { id: user.id, email: user.email, role: user.role };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        });

        return { accessToken, refreshToken };
    }

    async register({ username, email, password, role }) {
        // Check if user exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw { status: 409, message: 'Email already registered' };
        }

        const existingUsername = await userRepository.findByUsername(username);
        if (existingUsername) {
            throw { status: 409, message: 'Username already taken' };
        }

        // Create user (password hashed via model hook)
        const user = await userRepository.create({ username, email, password, role });
        const tokens = this.generateTokens(user);

        logger.info(`New user registered: ${email}`);
        return { user: user.toJSON(), ...tokens };
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user || !user.isActive) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const tokens = this.generateTokens(user);
        logger.info(`User logged in: ${email}`);

        return { user: user.toJSON(), ...tokens };
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userRepository.findById(decoded.id);
            if (!user || !user.isActive) {
                throw { status: 401, message: 'Invalid refresh token' };
            }
            return this.generateTokens(user);
        } catch (error) {
            throw { status: 401, message: 'Invalid or expired refresh token' };
        }
    }
}

module.exports = new AuthService();
