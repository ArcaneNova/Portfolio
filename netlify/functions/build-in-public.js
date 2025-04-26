/**
 * Standalone serverless function for handling build-in-public API
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
        message: 'Method not allowed. Use GET to fetch build-in-public posts.' 
      })
    };
  }
  
  console.log('BUILD-IN-PUBLIC FUNCTION: Processing request');
  console.log('Query params:', event.queryStringParameters);
  
  try {
    // Parse query params
    const { limit = 5, page = 1, sort, category } = event.queryStringParameters || {};
    
    // In a real app, you would fetch posts from a database
    // For now, we'll return mock data
    const mockPosts = [
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
      },
      {
        _id: 'bp5',
        title: 'Performance optimization for mobile',
        content: 'Spent today optimizing the 3D scenes for mobile devices. Had to significantly reduce polygon count...',
        category: 'optimization',
        image: 'https://images.unsplash.com/photo-1526570207772-784d36084510',
        createdAt: '2023-05-15T11:10:00.000Z'
      },
      {
        _id: 'bp6',
        title: 'Deploying to Netlify',
        content: 'Successfully deployed the project to Netlify. Setup continuous deployment with GitHub...',
        category: 'deployment',
        image: 'https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8',
        createdAt: '2023-05-10T16:40:00.000Z'
      },
      {
        _id: 'bp7',
        title: 'Accessibility improvements',
        content: 'Working on making the portfolio more accessible. Added keyboard navigation and screen reader support...',
        category: 'accessibility',
        image: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce',
        createdAt: '2023-05-05T13:25:00.000Z'
      }
    ];
    
    // Filter by category if provided
    let filteredPosts = mockPosts;
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort posts if sort is provided
    if (sort) {
      const [field, order] = sort.split(':');
      filteredPosts.sort((a, b) => {
        if (field === 'createdAt') {
          return order === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (field === 'title') {
          return order === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
        // Default to createdAt sorting
        return order === 'desc' 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else {
      // Default sort by createdAt desc
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Paginate results
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      success: true,
      count: filteredPosts.length,
      data: paginatedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredPosts.length / limitNum)
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Build-in-public function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving build-in-public posts',
        error: error.message
      })
    };
  }
}; 