import jwt from 'jsonwebtoken';

/**
 * Standalone serverless function for handling /me endpoint
 */
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Options request handled successfully' })
    };
  }
  
  // Verify this is a GET request
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed. Use GET to fetch profile.' 
      })
    };
  }
  
  console.log('ME FUNCTION: Processing profile request');
  console.log('Headers:', JSON.stringify(event.headers));
  
  try {
    // Extract token from cookies or authorization header
    let token = null;
    
    // Check for token in cookies
    if (event.headers.cookie) {
      const cookies = event.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      token = cookies.token;
    }
    
    // Check for token in Authorization header
    if (!token && event.headers.authorization) {
      const authHeader = event.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Check if we have a token
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Not authenticated - no token provided'
        })
      };
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production'
      );
      
      // In a real application, you would fetch the user from the database
      // Here we'll simulate it since we're using the test admin account
      let user = null;
      
      if (decoded.id === 'admin123' || decoded.role === 'admin') {
        user = {
          _id: 'admin123',
          username: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          profileImage: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
        };
      }
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'User not found'
          })
        };
      }
      
      // Return user data
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: user
        })
      };
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid or expired token'
        })
      };
    }
  } catch (error) {
    console.error('Profile function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving profile',
        error: error.message
      })
    };
  }
}; 