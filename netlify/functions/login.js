import jwt from 'jsonwebtoken';

/**
 * Standalone serverless function for handling login requests
 */
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
  
  // Verify this is a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed. Use POST to login.' 
      })
    };
  }
  
  console.log('LOGIN FUNCTION: Processing login request');
  console.log('Event path:', event.path);
  console.log('HTTP method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers));
  
  try {
    // Parse request body
    let requestBody;
    
    try {
      // First try to parse as JSON
      requestBody = JSON.parse(event.body);
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      
      // If parsing fails, try to handle form data
      if (event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(event.body);
        requestBody = {
          email: params.get('email'),
          password: params.get('password')
        };
        console.log('Parsed form data:', requestBody);
      } else {
        console.error('Could not parse request body as JSON or form data');
      }
    }
    
    // Check if body is still undefined
    if (!requestBody) {
      // Try to use query parameters as a last resort
      requestBody = event.queryStringParameters || {};
      console.log('Using query parameters:', requestBody);
    }
    
    const { email, password } = requestBody || {};
    
    // Check credentials
    if (!email || !password) {
      console.log('Missing email or password');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Please provide email and password',
          debug: {
            bodyType: typeof event.body,
            eventBodyLength: event.body?.length,
            contentType: event.headers['content-type'],
            isBase64Encoded: event.isBase64Encoded
          }
        })
      };
    }
    
    console.log(`Login attempt with email: ${email}`);
    
    // Always accept test credentials
    if (email === 'admin@example.com' && password === 'password123') {
      console.log('Test admin credentials verified - login successful');
      
      // Generate JWT token
      const token = jwt.sign(
        { id: 'admin123', role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      
      // Create response with cookie
      const cookieValue = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : ''}`;
      
      // Return success response
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': cookieValue
        },
        body: JSON.stringify({
          success: true,
          message: 'Login successful via standalone function',
          token,
          user: {
            _id: 'admin123',
            username: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          }
        })
      };
    }
    
    // Invalid credentials response
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Invalid credentials. Try admin@example.com/password123 for testing.'
      })
    };
  } catch (error) {
    console.error('Login function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error during login',
        error: error.message,
        stack: error.stack
      })
    };
  }
}; 