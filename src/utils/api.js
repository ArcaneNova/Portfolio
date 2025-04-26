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
  getProfile: async () => {
    try {
      console.log('Trying dedicated me function');
      const response = await fetch('/.netlify/functions/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Me function failed, trying regular API route');
      console.error('Me function error:', error.message);
      return await API.get('/auth/me');
    }
  },
  register: (userData) => API.post('/auth/register', userData),
};

// Projects API
export const projectsAPI = {
  getAllProjects: async (params) => {
    // Use the dedicated projects function implementation
    return await ProjectAPI.getProjects(params);
  },
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
  getAllBlogs: async (params) => {
    // Use the BlogAPI implementation which will try to use mock data if backend is unavailable
    return await BlogAPI.getBlogs(params);
  },
  getBlog: (id) => API.get(`/blogs/${id}`),
  createBlog: (blogData) => API.post('/blogs', blogData),
  updateBlog: (id, blogData) => API.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => API.delete(`/blogs/${id}`),
};

// Motivations API
export const motivationsAPI = {
  getAllMotivations: async (params) => {
    return await MotivationAPI.getMotivations(params);
  },
  getMotivation: (id) => API.get(`/motivations/${id}`),
  createMotivation: (motivationData) => API.post('/motivations', motivationData),
  updateMotivation: (id, motivationData) => API.put(`/motivations/${id}`, motivationData),
  deleteMotivation: (id) => API.delete(`/motivations/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAllTasks: async (params) => {
    return await TaskAPI.getTasks(params);
  },
  getTodaysTasks: async () => {
    return await TaskAPI.getTodaysTasks();
  },
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (taskData) => API.post('/tasks', taskData),
  updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  completeTask: (id) => API.patch(`/tasks/${id}/complete`),
};

// Build In Public API
export const buildInPublicAPI = {
  getAllPosts: async (params) => {
    return await BuildInPublicAPI.getPosts(params);
  },
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

export const ProjectAPI = {
  getProjects: async (params = {}) => {
    try {
      console.log('Trying dedicated projects function');
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.sort) queryParams.append('sort', params.sort);
      
      // Handle tag parameter - the Netlify function expects 'tag' not 'tags'
      if (params.tag) {
        queryParams.append('tag', params.tag);
      } else if (params.tags) {
        // For backward compatibility - use the first tag
        if (Array.isArray(params.tags) && params.tags.length > 0) {
          queryParams.append('tag', params.tags[0]);
        } else if (typeof params.tags === 'string') {
          queryParams.append('tag', params.tags);
        }
      }
      
      const url = `/.netlify/functions/projects?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching projects: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Projects function failed, trying regular API route');
      console.error('Projects function error:', error.message);
      return await API.get('/projects', { params });
    }
  },
};

export const BlogAPI = {
  getBlogs: async (params = {}) => {
    try {
      console.log('Trying dedicated blogs function');
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.sort) queryParams.append('sort', params.sort);
      
      // Handle tag parameter
      if (params.tag) {
        queryParams.append('tag', params.tag);
      } else if (params.tags) {
        // For backward compatibility - use the first tag
        if (Array.isArray(params.tags) && params.tags.length > 0) {
          queryParams.append('tag', params.tags[0]);
        } else if (typeof params.tags === 'string') {
          queryParams.append('tag', params.tags);
        }
      }
      
      const url = `/.netlify/functions/blogs?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching blogs: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Blogs function failed, trying regular API route');
      console.error('Blogs function error:', error.message);
      
      try {
        return await API.get('/blogs', { params });
      } catch (apiError) {
        console.error('Blog API error:', apiError.message);
        
        // Return mock data for fallback
        console.log('Returning mock blog data as fallback');
        
        // Simulate API response format
        return { 
          data: {
            success: true,
            count: 4,
            data: [
              {
                _id: 'b1',
                title: 'Getting Started with Three.js',
                summary: 'Learn the basics of 3D graphics in the browser with Three.js',
                content: '# Introduction to Three.js\n\nThree.js is a powerful JavaScript library...',
                image: 'https://images.unsplash.com/photo-1610986603166-f78428812d8e',
                tags: ['Three.js', 'JavaScript', '3D'],
                slug: 'getting-started-with-threejs',
                published: true,
                createdAt: '2023-06-10T08:00:00.000Z',
                updatedAt: '2023-06-15T10:30:00.000Z'
              },
              {
                _id: 'b2',
                title: 'Modern React Patterns',
                summary: 'Exploring advanced React patterns for scalable applications',
                content: '# Modern React Patterns\n\nIn this post, we\'ll explore...',
                image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
                tags: ['React', 'JavaScript', 'Web Development'],
                slug: 'modern-react-patterns',
                published: true,
                createdAt: '2023-05-22T14:20:00.000Z',
                updatedAt: '2023-05-25T09:15:00.000Z'
              },
              {
                _id: 'b3',
                title: 'Building a Portfolio with Next.js',
                summary: 'Create a performant developer portfolio using Next.js and TailwindCSS',
                content: '# Building with Next.js\n\nNext.js is a React framework...',
                image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
                tags: ['Next.js', 'Portfolio', 'TailwindCSS'],
                slug: 'portfolio-with-nextjs',
                published: true,
                createdAt: '2023-04-15T11:45:00.000Z',
                updatedAt: '2023-04-18T16:30:00.000Z'
              },
              {
                _id: 'b4',
                title: 'CSS Grid Mastery',
                summary: 'Advanced techniques for complex layouts with CSS Grid',
                content: '# CSS Grid Mastery\n\nIn this comprehensive guide...',
                image: 'https://images.unsplash.com/photo-1544986581-efac024faf62',
                tags: ['CSS', 'Web Design', 'Layout'],
                slug: 'css-grid-mastery',
                published: false,
                createdAt: '2023-03-08T13:20:00.000Z',
                updatedAt: '2023-03-10T17:40:00.000Z'
              }
            ],
            pagination: {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 10,
              totalPages: 1
            }
          },
          status: 200
        };
      }
    }
  }
};

export const TaskAPI = {
  getTasks: async (params = {}) => {
    try {
      console.log('Trying dedicated tasks function');
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
      
      const url = `/.netlify/functions/tasks?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Tasks function failed, trying regular API route');
      console.error('Tasks function error:', error.message);
      
      try {
        return await API.get('/tasks', { params });
      } catch (apiError) {
        console.error('Tasks API error:', apiError.message);
        
        // Return mock data for fallback
        return { 
          data: {
            success: true,
            count: 6,
            data: [
              {
                _id: 't1',
                title: 'Update portfolio with latest projects',
                description: 'Add the React Native app and e-commerce platform to portfolio',
                priority: 'high',
                completed: false,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                createdAt: '2023-05-15T09:30:00.000Z'
              },
              {
                _id: 't2',
                title: 'Write blog post about Three.js',
                description: 'Cover basics and advanced examples with code samples',
                priority: 'medium',
                completed: false,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                createdAt: '2023-05-14T14:45:00.000Z'
              },
              {
                _id: 't3',
                title: 'Optimize website performance',
                description: 'Reduce bundle size and improve load times',
                priority: 'high',
                completed: false,
                dueDate: new Date(Date.now() + 172800000).toISOString(),
                createdAt: '2023-05-13T11:20:00.000Z'
              }
            ],
            pagination: {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 10,
              totalPages: 1
            }
          },
          status: 200
        };
      }
    }
  },
  
  getTodaysTasks: async () => {
    try {
      console.log('Trying dedicated tasks/today function');
      const url = `/.netlify/functions/tasks/today`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching today's tasks: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Tasks/today function failed, trying regular API route');
      console.error('Tasks/today function error:', error.message);
      
      try {
        return await API.get('/tasks/today');
      } catch (apiError) {
        console.error('Tasks API error:', apiError.message);
        
        // Return mock data for fallback
        return { 
          data: {
            success: true,
            count: 2,
            data: [
              {
                _id: 't1',
                title: 'Update portfolio with latest projects',
                description: 'Add the React Native app and e-commerce platform to portfolio',
                priority: 'high',
                completed: false,
                dueDate: new Date().toISOString(),
                createdAt: '2023-05-15T09:30:00.000Z'
              },
              {
                _id: 't2',
                title: 'Write blog post about Three.js',
                description: 'Cover basics and advanced examples with code samples',
                priority: 'medium',
                completed: false,
                dueDate: new Date().toISOString(),
                createdAt: '2023-05-14T14:45:00.000Z'
              }
            ],
            pagination: {
              page: 1,
              limit: 10,
              totalPages: 1
            }
          },
          status: 200
        };
      }
    }
  }
};

export const MotivationAPI = {
  getMotivations: async (params = {}) => {
    try {
      console.log('Trying dedicated motivations function');
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `/.netlify/functions/motivations?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching motivations: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Motivations function failed, trying regular API route');
      console.error('Motivations function error:', error.message);
      
      try {
        return await API.get('/motivations', { params });
      } catch (apiError) {
        console.error('Motivations API error:', apiError.message);
        
        // Return mock data for fallback
        return { 
          data: {
            success: true,
            count: 4,
            data: [
              {
                _id: 'm1',
                quote: 'The best way to predict the future is to invent it.',
                author: 'Alan Kay',
                category: 'inspiration',
                favorite: true,
                createdAt: '2023-06-01T08:30:00.000Z'
              },
              {
                _id: 'm2',
                quote: 'The only way to do great work is to love what you do.',
                author: 'Steve Jobs',
                category: 'work',
                favorite: true,
                createdAt: '2023-05-25T14:20:00.000Z'
              },
              {
                _id: 'm3',
                quote: 'Simplicity is the ultimate sophistication.',
                author: 'Leonardo da Vinci',
                category: 'design',
                favorite: false,
                createdAt: '2023-05-20T11:45:00.000Z'
              },
              {
                _id: 'm4',
                quote: 'Programming isn\'t about what you know; it\'s about what you can figure out.',
                author: 'Chris Pine',
                category: 'programming',
                favorite: true,
                createdAt: '2023-05-15T09:10:00.000Z'
              }
            ],
            pagination: {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 10,
              totalPages: 1
            }
          },
          status: 200
        };
      }
    }
  }
};

export const BuildInPublicAPI = {
  getPosts: async (params = {}) => {
    try {
      console.log('Trying dedicated build-in-public function');
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `/.netlify/functions/build-in-public?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching build-in-public posts: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log('Build-in-public function failed, trying regular API route');
      console.error('Build-in-public function error:', error.message);
      
      try {
        return await API.get('/build-in-public', { params });
      } catch (apiError) {
        console.error('Build-in-public API error:', apiError.message);
        
        // Return mock data for fallback
        return { 
          data: {
            success: true,
            count: 4,
            data: [
              {
                _id: 'bp1',
                title: 'Started working on 3D portfolio',
                content: 'Today I started working on my new portfolio project which will include 3D elements with Three.js...',
                category: 'development',
                image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b',
                createdAt: '2023-06-01T10:15:00.000Z'
              },
              {
                _id: 'bp2',
                title: 'Challenges with Three.js implementation',
                content: 'Ran into some issues with camera controls and lighting in Three.js. Here\'s how I solved them...',
                category: 'challenges',
                image: 'https://images.unsplash.com/photo-1519242220831-09410926fbae',
                createdAt: '2023-05-28T15:30:00.000Z'
              },
              {
                _id: 'bp3',
                title: 'Portfolio redesign progress',
                content: 'Making good progress on the portfolio redesign. The 3D models are now rendering correctly...',
                category: 'development',
                image: 'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b',
                createdAt: '2023-05-25T09:45:00.000Z'
              },
              {
                _id: 'bp4',
                title: 'Added project filtering by technology',
                content: 'Implemented a new feature that allows visitors to filter projects by technology stack...',
                category: 'feature',
                image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
                createdAt: '2023-05-20T14:20:00.000Z'
              }
            ],
            pagination: {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 10,
              totalPages: 1
            }
          },
          status: 200
        };
      }
    }
  }
};

export default API; 