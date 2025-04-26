import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verify user is authenticated
export const protect = async (req, res, next) => {
  let token;
  
  // Log all headers for debugging
  console.log('All headers:', JSON.stringify(req.headers));
  
  // Check if token exists in Authorization header or cookies
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header');
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
    console.log('Token from cookies');
  } else if (req.headers['x-auth-token']) {
    // Alternative location for token
    token = req.headers['x-auth-token'];
    console.log('Token from x-auth-token header');
  }
  
  // Log the auth attempt for debugging
  console.log('Auth middleware - token present:', !!token);
  
  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production'
    );
    
    // Log decoded token info (without sensitive data)
    console.log('Decoded token ID:', decoded.id);
    console.log('Decoded token role:', decoded.role);
    
    // Find user by id in token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Log successful authentication
    console.log('User authenticated:', user.username);
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    
    next();
  };
}; 