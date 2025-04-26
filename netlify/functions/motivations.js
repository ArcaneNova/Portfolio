/**
 * Standalone serverless function for handling motivations API
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
        message: 'Method not allowed. Use GET to fetch motivations.' 
      })
    };
  }
  
  console.log('MOTIVATIONS FUNCTION: Processing request');
  console.log('Query params:', event.queryStringParameters);
  
  try {
    // Parse query params
    const { limit = 5, page = 1, sort, category } = event.queryStringParameters || {};
    
    // In a real app, you would fetch motivations from a database
    // For now, we'll return mock data
    const mockMotivations = [
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
      },
      {
        _id: 'm5',
        quote: 'The most disastrous thing that you can ever learn is your first programming language.',
        author: 'Alan Kay',
        category: 'programming',
        favorite: false,
        createdAt: '2023-05-10T16:30:00.000Z'
      },
      {
        _id: 'm6',
        quote: 'Good design is obvious. Great design is transparent.',
        author: 'Joe Sparano',
        category: 'design',
        favorite: true,
        createdAt: '2023-05-05T10:15:00.000Z'
      },
      {
        _id: 'm7',
        quote: 'The function of good software is to make the complex appear to be simple.',
        author: 'Grady Booch',
        category: 'programming',
        favorite: true,
        createdAt: '2023-04-30T13:45:00.000Z'
      },
      {
        _id: 'm8',
        quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill',
        category: 'inspiration',
        favorite: false,
        createdAt: '2023-04-25T08:20:00.000Z'
      }
    ];
    
    // Filter by category if provided
    let filteredMotivations = mockMotivations;
    if (category) {
      filteredMotivations = filteredMotivations.filter(motivation => 
        motivation.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort motivations if sort is provided
    if (sort) {
      const [field, order] = sort.split(':');
      filteredMotivations.sort((a, b) => {
        if (field === 'createdAt') {
          return order === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (field === 'author') {
          return order === 'desc'
            ? b.author.localeCompare(a.author)
            : a.author.localeCompare(b.author);
        }
        // Default to createdAt sorting
        return order === 'desc' 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else {
      // Default sort by createdAt desc
      filteredMotivations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Paginate results
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedMotivations = filteredMotivations.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      success: true,
      count: filteredMotivations.length,
      data: paginatedMotivations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredMotivations.length / limitNum)
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Motivations function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving motivations',
        error: error.message
      })
    };
  }
}; 