/**
 * Standalone serverless function for handling tasks API
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
        message: 'Method not allowed. Use GET to fetch tasks.' 
      })
    };
  }
  
  console.log('TASKS FUNCTION: Processing request');
  console.log('Query params:', event.queryStringParameters);
  console.log('Path:', event.path);
  
  try {
    // Check if this is a today's tasks request
    const isToday = event.path.endsWith('/today');
    
    // Parse query params
    const { limit = 5, page = 1, sort, priority, completed } = event.queryStringParameters || {};
    
    // In a real app, you would fetch tasks from a database
    // For now, we'll return mock data
    const mockTasks = [
      {
        _id: 't1',
        title: 'Update portfolio with latest projects',
        description: 'Add the React Native app and e-commerce platform to portfolio',
        priority: 'high',
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        createdAt: '2023-05-15T09:30:00.000Z'
      },
      {
        _id: 't2',
        title: 'Write blog post about Three.js',
        description: 'Cover basics and advanced examples with code samples',
        priority: 'medium',
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        createdAt: '2023-05-14T14:45:00.000Z'
      },
      {
        _id: 't3',
        title: 'Optimize website performance',
        description: 'Reduce bundle size and improve load times',
        priority: 'high',
        completed: false,
        dueDate: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
        createdAt: '2023-05-13T11:20:00.000Z'
      },
      {
        _id: 't4',
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        priority: 'medium',
        completed: true,
        dueDate: '2023-05-12T00:00:00.000Z',
        createdAt: '2023-05-10T08:15:00.000Z'
      },
      {
        _id: 't5',
        title: 'Research new tech stack',
        description: 'Look into Next.js 13 and server components',
        priority: 'low',
        completed: false,
        dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        createdAt: '2023-05-09T15:30:00.000Z'
      },
      {
        _id: 't6',
        title: 'Update dependencies',
        description: 'Update all npm packages to latest versions',
        priority: 'low',
        completed: true,
        dueDate: '2023-05-08T00:00:00.000Z',
        createdAt: '2023-05-05T10:45:00.000Z'
      }
    ];
    
    // Filter tasks based on query params
    let filteredTasks = [...mockTasks];
    
    // If this is a "today's tasks" request, filter by due date being today
    if (isToday) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filteredTasks = filteredTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate < tomorrow;
      });
    }
    
    // Filter by priority if provided
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    // Filter by completion status if provided
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }
    
    // Sort tasks if sort is provided
    if (sort) {
      const [field, order] = sort.split(':');
      filteredTasks.sort((a, b) => {
        if (field === 'dueDate') {
          return order === 'desc' 
            ? new Date(b.dueDate) - new Date(a.dueDate)
            : new Date(a.dueDate) - new Date(b.dueDate);
        } else if (field === 'createdAt') {
          return order === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (field === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return order === 'desc'
            ? priorityOrder[b.priority] - priorityOrder[a.priority]
            : priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Default to dueDate sorting
        return order === 'desc' 
          ? new Date(b.dueDate) - new Date(a.dueDate)
          : new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else {
      // Default sort by dueDate asc (closest due date first)
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    
    // Paginate results
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      success: true,
      count: filteredTasks.length,
      data: paginatedTasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredTasks.length / limitNum)
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Tasks function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving tasks',
        error: error.message
      })
    };
  }
}; 