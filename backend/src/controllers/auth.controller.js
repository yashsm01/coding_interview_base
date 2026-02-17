/**
 * Auth Controller
 * 
 * INTERVIEW POINT: Controller handles ONLY HTTP request/response.
 * Business logic is in AuthService (SRP principle).
 */
const authService = require('../services/auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await authService.login(req.body);
            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ success: false, error: 'Refresh token required' });
            }
            const tokens = await authService.refreshToken(refreshToken);
            res.json({ success: true, data: tokens });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res) {
        // req.user is set by auth middleware
        res.json({ success: true, data: req.user });
    }
}

module.exports = new AuthController();
