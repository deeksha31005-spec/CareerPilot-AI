import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * JWT Authentication Middleware
 * Protects private routes by verifying bearer token in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify JWT token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careerpilot_secret_key_jwt_2026');

      // Attach user profile to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no access token provided' });
  }
};
