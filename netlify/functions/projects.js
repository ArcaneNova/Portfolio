/**
 * Standalone serverless function for handling projects API
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
        message: 'Method not allowed. Use GET to fetch projects.' 
      })
    };
  }
  
  console.log('PROJECTS FUNCTION: Processing request');
  console.log('Query params:', event.queryStringParameters);
  
  try {
    // Parse query params
    const { limit = 5, page = 1, sort, tag } = event.queryStringParameters || {};
    
    // In a real app, you would fetch projects from a database
    // For now, we'll return mock data
    const mockProjects = [
      {
        _id: 'p1',
        title: '3D Portfolio Website',
        description: 'A modern portfolio website with 3D elements using Three.js and React.',
        image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tags: ['React', 'Three.js', 'TailwindCSS'],
        sourceLink: 'https://github.com/username/3d-portfolio',
        demoLink: 'https://portfolio.example.com',
        createdAt: '2023-06-15T10:00:00.000Z'
      },
      {
        _id: 'p2',
        title: 'AI-Powered Task Manager',
        description: 'A task management application with AI suggestions for better productivity.',
        image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGFzayUyMG1hbmFnZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tags: ['React', 'Node.js', 'AI', 'Express'],
        sourceLink: 'https://github.com/username/ai-task-manager',
        demoLink: 'https://tasks.example.com',
        createdAt: '2023-05-20T14:30:00.000Z'
      },
      {
        _id: 'p3',
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform with payment integration and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        sourceLink: 'https://github.com/username/ecommerce',
        demoLink: 'https://shop.example.com',
        createdAt: '2023-04-10T09:15:00.000Z'
      },
      {
        _id: 'p4',
        title: 'Weather Dashboard',
        description: 'Real-time weather dashboard with forecast data and interactive maps.',
        image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
        tags: ['JavaScript', 'APIs', 'CSS'],
        sourceLink: 'https://github.com/username/weather-app',
        demoLink: 'https://weather.example.com',
        createdAt: '2023-03-05T11:20:00.000Z'
      },
      {
        _id: 'p5',
        title: 'Social Media App',
        description: 'A social media platform with real-time messaging and post sharing.',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        tags: ['React', 'Firebase', 'Socket.io'],
        sourceLink: 'https://github.com/username/social-app',
        demoLink: 'https://social.example.com',
        createdAt: '2023-02-15T08:45:00.000Z'
      },
      {
        _id: 'p6',
        title: 'Fitness Tracker',
        description: 'Track workouts, nutrition, and progress with this comprehensive fitness app.',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
        tags: ['React Native', 'Node.js', 'MongoDB'],
        sourceLink: 'https://github.com/username/fitness-tracker',
        demoLink: 'https://fitness.example.com',
        createdAt: '2023-01-10T16:30:00.000Z'
      }
    ];
    
    // Filter by tag if provided
    let filteredProjects = mockProjects;
    if (tag) {
      filteredProjects = filteredProjects.filter(project => 
        project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Sort projects if sort is provided
    if (sort) {
      const [field, order] = sort.split(':');
      filteredProjects.sort((a, b) => {
        if (field === 'createdAt') {
          return order === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        }
        // Add more sort fields as needed
        return 0;
      });
    } else {
      // Default sort by createdAt desc
      filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Paginate results
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      success: true,
      count: filteredProjects.length,
      data: paginatedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredProjects.length / limitNum)
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Projects function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving projects',
        error: error.message
      })
    };
  }
}; 