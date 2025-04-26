import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaLock, FaBug, FaServer, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import api from '../../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    apiConnected: null,
    responseTime: null,
    serverInfo: null
  });
  const [showDebug, setShowDebug] = useState(false);

  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      const startTime = Date.now();
      try {
        const response = await axios.get('/api/health', { timeout: 5000 });
        const endTime = Date.now();
        setDebugInfo({
          apiConnected: true,
          responseTime: `${endTime - startTime}ms`,
          serverInfo: response.data
        });
      } catch (error) {
        setDebugInfo({
          apiConnected: false,
          responseTime: null,
          serverInfo: null
        });
      }
    };
    
    checkApiConnection();
  }, []);

  const testDirectApiCall = async () => {
    setDebugInfo(prev => ({
      ...prev,
      testing: true,
      directApiResult: 'Testing...'
    }));
    
    try {
      // Test direct call to Netlify function
      const response = await axios.post('/.netlify/functions/auth/login', { 
        email, 
        password 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setDebugInfo(prev => ({
        ...prev,
        testing: false,
        directApiResult: `Success: ${JSON.stringify(response.data).slice(0, 100)}...`,
        directApiStatus: response.status
      }));
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        testing: false,
        directApiResult: `Error: ${error.message}`,
        directApiStatus: error.response?.status || 'No response',
        directApiError: error.response?.data || error.message
      }));
    }
  };

  const testIndexFunctionLogin = async () => {
    setDebugInfo(prev => ({
      ...prev,
      indexTesting: true,
      indexResult: 'Testing index function...'
    }));
    
    const credentials = {
      email: email,
      password: password
    };
    
    console.log('Sending credentials to index function:', credentials);
    
    try {
      // Test direct call to index function
      const response = await axios.post('/.netlify/functions/index/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Index function response:', response.data);
      
      setDebugInfo(prev => ({
        ...prev,
        indexTesting: false,
        indexResult: `Success: ${JSON.stringify(response.data).slice(0, 100)}...`,
        indexStatus: response.status,
        lastSuccessfulMethod: 'index function'
      }));
      
      // If successful, store the token and redirect
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Navigate to the admin panel
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Index function error:', error);
      
      setDebugInfo(prev => ({
        ...prev,
        indexTesting: false,
        indexResult: `Error: ${error.message}`,
        indexStatus: error.response?.status || 'No response',
        indexError: error.response?.data || error.message
      }));
    }
  };

  // Let's also add a completely different approach with fetch
  const testWithFetch = async () => {
    setDebugInfo(prev => ({
      ...prev,
      fetchTesting: true,
      fetchResult: 'Testing with fetch API...'
    }));
    
    const credentials = {
      email: email,
      password: password
    };
    
    try {
      // Use fetch API instead of axios as an alternative approach
      const response = await fetch('/.netlify/functions/index/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('Fetch API response:', data);
      
      setDebugInfo(prev => ({
        ...prev,
        fetchTesting: false,
        fetchResult: `Success: ${JSON.stringify(data).slice(0, 100)}...`,
        fetchStatus: response.status,
        lastSuccessfulMethod: 'fetch API'
      }));
      
      // If successful, store the token and redirect
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to the admin panel
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Fetch API error:', error);
      
      setDebugInfo(prev => ({
        ...prev,
        fetchTesting: false,
        fetchResult: `Error: ${error.message}`,
        fetchStatus: 'Error',
        fetchError: error.message
      }));
    }
  };

  // Add this new function to test direct call to the standalone login function
  const testStandaloneFunction = async () => {
    setDebugInfo(prev => ({
      ...prev,
      standaloneTesting: true,
      standaloneResult: 'Testing standalone function...'
    }));
    
    const credentials = {
      email: email,
      password: password
    };
    
    console.log('Sending credentials to standalone function:', credentials);
    
    try {
      // Call the standalone login function directly
      const response = await axios.post('/.netlify/functions/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Standalone function response:', response.data);
      
      setDebugInfo(prev => ({
        ...prev,
        standaloneTesting: false,
        standaloneResult: `Success: ${JSON.stringify(response.data).slice(0, 100)}...`,
        standaloneStatus: response.status,
        lastSuccessfulMethod: 'standalone function'
      }));
      
      // If successful, store the token and redirect
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Navigate to the admin panel
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Standalone function error:', error);
      
      setDebugInfo(prev => ({
        ...prev,
        standaloneTesting: false,
        standaloneResult: `Error: ${error.message}`,
        standaloneStatus: error.response?.status || 'No response',
        standaloneError: error.response?.data || error.message
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For development - log the login attempt
      console.log(`Attempting login with email: ${email}`);
      
      await login(email, password);
      
      // Navigate to the intended route or dashboard
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      setIsLoading(false);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with an error status
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
        console.error('Login Error Response:', error.response.status, error.response.data);
        
        setDebugInfo(prev => ({
          ...prev,
          lastError: `${error.response.status}: ${error.response.data.message || 'Unknown error'}`,
          errorType: 'Response Error',
          timestamp: new Date().toISOString()
        }));
      } else if (error.request) {
        // Request was made but no response received
        setError('Cannot connect to the server. Please try again later.');
        console.error('Login Request Error:', error.request);
        
        setDebugInfo(prev => ({
          ...prev,
          lastError: 'Network error - no response from server',
          errorType: 'Request Error',
          timestamp: new Date().toISOString()
        }));
      } else {
        // Something else caused an error
        setError(error.message || 'An unexpected error occurred');
        console.error('Login Error:', error.message);
        
        setDebugInfo(prev => ({
          ...prev,
          lastError: error.message,
          errorType: 'Unknown Error',
          timestamp: new Date().toISOString()
        }));
      }
    }
  };

  // Auto-fill development credentials for ease of testing
  const fillDevCredentials = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-950 to-indigo-900 p-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>
      
      <div className="z-10 w-full max-w-md">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-30 border border-red-500 rounded-lg text-white">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Logging in...
                  </>
                ) : "Login"}
              </button>

              {/* Dev shortcut */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={fillDevCredentials}
                  className="w-full flex justify-center items-center py-1 px-2 text-xs text-blue-300 hover:text-blue-200"
                >
                  Use dev credentials
                </button>
              )}
            </form>
          </div>
          
          <div className="px-8 py-4 bg-black bg-opacity-30 text-center">
            <Link to="/" className="text-sm text-blue-300 hover:text-blue-200">
              ← Return to portfolio
            </Link>
            <span className="mx-2 text-gray-500">|</span>
            <button 
              onClick={() => setShowDebug(!showDebug)} 
              className="text-sm text-blue-300 hover:text-blue-200 inline-flex items-center"
            >
              <FaBug className="mr-1" /> {showDebug ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>
          
          {/* Debug Information Panel */}
          {showDebug && (
            <div className="px-8 py-4 bg-gray-900 text-gray-300 text-sm">
              <h3 className="font-semibold flex items-center mb-2">
                <FaServer className="mr-2" /> API Connection Status
              </h3>
              <div className="space-y-1 mb-4">
                <div className="flex">
                  <span className="w-32 font-medium">Status:</span>
                  <span 
                    className={`${debugInfo.apiConnected === true ? 'text-green-400' : debugInfo.apiConnected === false ? 'text-red-400' : 'text-yellow-400'}`}
                  >
                    {debugInfo.apiConnected === true ? '✅ Connected' : debugInfo.apiConnected === false ? '❌ Disconnected' : 'Checking...'}
                  </span>
                </div>
                {debugInfo.responseTime && (
                  <div className="flex">
                    <span className="w-32 font-medium">Response time:</span>
                    <span>{debugInfo.responseTime}</span>
                  </div>
                )}
                {debugInfo.serverInfo && (
                  <div className="flex">
                    <span className="w-32 font-medium">Server info:</span>
                    <span>{JSON.stringify(debugInfo.serverInfo)}</span>
                  </div>
                )}
                {debugInfo.lastError && (
                  <div>
                    <div className="flex">
                      <span className="w-32 font-medium">Last error:</span>
                      <span className="text-red-400">{debugInfo.lastError}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Error type:</span>
                      <span>{debugInfo.errorType}</span>
                    </div>
                  </div>
                )}
                <div className="flex">
                  <span className="w-32 font-medium">Timestamp:</span>
                  <span>{debugInfo.timestamp}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>If you're having trouble connecting, check that:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>The API server is running</li>
                  <li>The API is correctly deployed on Netlify</li>
                  <li>Your network connection is stable</li>
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="font-semibold mb-2">Debug Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={testDirectApiCall}
                    disabled={debugInfo.testing}
                    className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded-md text-xs disabled:opacity-50"
                  >
                    {debugInfo.testing ? 'Testing...' : 'Test Direct API Call'}
                  </button>
                  
                  {debugInfo.directApiResult && (
                    <div className="mt-2 text-xs">
                      <div><strong>Status:</strong> {debugInfo.directApiStatus}</div>
                      <div><strong>Result:</strong> {debugInfo.directApiResult}</div>
                      {debugInfo.directApiError && (
                        <pre className="mt-1 p-2 bg-gray-800 rounded max-h-40 overflow-auto">
                          {JSON.stringify(debugInfo.directApiError, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="font-semibold mb-2">Debug Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={testIndexFunctionLogin}
                    disabled={debugInfo.indexTesting}
                    className="ml-2 px-3 py-1 bg-green-800 hover:bg-green-700 text-white rounded-md text-xs disabled:opacity-50"
                  >
                    {debugInfo.indexTesting ? 'Testing...' : 'Test Index Function Login'}
                  </button>
                  
                  {debugInfo.indexResult && (
                    <div className="mt-2 text-xs border-t border-gray-700 pt-2">
                      <div><strong>Index Function Status:</strong> {debugInfo.indexStatus}</div>
                      <div><strong>Result:</strong> {debugInfo.indexResult}</div>
                      {debugInfo.indexError && (
                        <pre className="mt-1 p-2 bg-gray-800 rounded max-h-40 overflow-auto">
                          {JSON.stringify(debugInfo.indexError, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="font-semibold mb-2">Debug Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={testWithFetch}
                    disabled={debugInfo.fetchTesting}
                    className="ml-2 px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-md text-xs disabled:opacity-50"
                  >
                    {debugInfo.fetchTesting ? 'Testing...' : 'Test With Fetch API'}
                  </button>
                  
                  {debugInfo.fetchResult && (
                    <div className="mt-2 text-xs border-t border-gray-700 pt-2">
                      <div><strong>Fetch API Status:</strong> {debugInfo.fetchStatus}</div>
                      <div><strong>Result:</strong> {debugInfo.fetchResult}</div>
                      {debugInfo.fetchError && (
                        <pre className="mt-1 p-2 bg-gray-800 rounded max-h-40 overflow-auto">
                          {JSON.stringify(debugInfo.fetchError, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="font-semibold mb-2">Debug Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={testStandaloneFunction}
                    disabled={debugInfo.standaloneTesting}
                    className="ml-2 px-3 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded-md text-xs disabled:opacity-50"
                  >
                    {debugInfo.standaloneTesting ? 'Testing...' : 'Test Standalone Function'}
                  </button>
                  
                  {debugInfo.standaloneResult && (
                    <div className="mt-2 text-xs border-t border-gray-700 pt-2">
                      <div><strong>Standalone Function Status:</strong> {debugInfo.standaloneStatus}</div>
                      <div><strong>Result:</strong> {debugInfo.standaloneResult}</div>
                      {debugInfo.standaloneError && (
                        <pre className="mt-1 p-2 bg-gray-800 rounded max-h-40 overflow-auto">
                          {JSON.stringify(debugInfo.standaloneError, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 