import axios from 'axios';

// Get the base URL from environment variables or use default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create an axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000 // Increase timeout for Netlify functions
});

// Add a request interceptor to include the token from localStorage
API.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    
    // For debugging Netlify deployments
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers
      },
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response'
    });
    
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Try the standalone login function first, then fall back to normal API route
  login: async (credentials) => {
    try {
      // Ensure credentials has email and password
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      console.log('Trying standalone login function with:', { 
        email: credentials.email, 
        password: credentials.password ? '***' : 'missing' 
      });
      
      // Use fetch API directly for more control
      const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      
      const data = await response.json();
      
      // Convert to axios-like response for compatibility
      return { 
        data, 
        status: response.status,
        headers: Object.fromEntries([...response.headers.entries()])
      };
    } catch (error) {
      console.log('Standalone login failed, trying regular API route');
      console.error('Standalone login error:', error.message);
      
      // Fallback to regular API
      return await API.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
    }
  },
  logout: () => API.get('/auth/logout'),
  getProfile: () => API.get('/auth/me'),
  register: (userData) => API.post('/auth/register', userData),
};

// Projects API
export const projectsAPI = {
  getAllProjects: (params) => API.get('/projects', { params }),
  getProject: (id) => API.get(`/projects/${id}`),
  createProject: (projectData) => API.post('/projects', projectData),
  updateProject: (id, projectData) => API.put(`/projects/${id}`, projectData),
  deleteProject: (id) => API.delete(`/projects/${id}`),
  addProjectPost: (id, postData) => API.post(`/projects/${id}/posts`, postData),
  updateProjectPost: (projectId, postId, postData) => API.put(`/projects/${projectId}/posts/${postId}`, postData),
  deleteProjectPost: (projectId, postId) => API.delete(`/projects/${projectId}/posts/${postId}`),
};

// Blogs API
export const blogsAPI = {
  getAllBlogs: (params) => API.get('/blogs', { params }),
  getBlog: (id) => API.get(`/blogs/${id}`),
  createBlog: (blogData) => API.post('/blogs', blogData),
  updateBlog: (id, blogData) => API.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => API.delete(`/blogs/${id}`),
};

// Motivations API
export const motivationsAPI = {
  getAllMotivations: (params) => API.get('/motivations', { params }),
  getMotivation: (id) => API.get(`/motivations/${id}`),
  createMotivation: (motivationData) => API.post('/motivations', motivationData),
  updateMotivation: (id, motivationData) => API.put(`/motivations/${id}`, motivationData),
  deleteMotivation: (id) => API.delete(`/motivations/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAllTasks: (params) => API.get('/tasks', { params }),
  getTodaysTasks: () => API.get('/tasks/today'),
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (taskData) => API.post('/tasks', taskData),
  updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  completeTask: (id) => API.patch(`/tasks/${id}/complete`),
};

// Build In Public API
export const buildInPublicAPI = {
  getAllPosts: (params) => API.get('/build-in-public', { params }),
  getPost: (id) => API.get(`/build-in-public/${id}`),
  createPost: (postData) => API.post('/build-in-public', postData),
  updatePost: (id, postData) => API.put(`/build-in-public/${id}`, postData),
  deletePost: (id) => API.delete(`/build-in-public/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default API; 