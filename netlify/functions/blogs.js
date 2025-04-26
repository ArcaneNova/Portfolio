/**
 * Standalone serverless function for handling blogs API
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
        message: 'Method not allowed. Use GET to fetch blogs.' 
      })
    };
  }
  
  console.log('BLOGS FUNCTION: Processing request');
  console.log('Query params:', event.queryStringParameters);
  
  try {
    // Parse query params
    const { limit = 5, page = 1, sort, tag } = event.queryStringParameters || {};
    
    // In a real app, you would fetch blogs from a database
    // For now, we'll return mock data
    const mockBlogs = [
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
      },
      {
        _id: 'b5',
        title: 'JavaScript Performance Optimization',
        summary: 'Tips and techniques to make your JavaScript applications faster',
        content: '# JavaScript Performance\n\nOptimizing JavaScript performance is crucial...',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        tags: ['JavaScript', 'Performance', 'Web Development'],
        slug: 'javascript-performance-optimization',
        published: true,
        createdAt: '2023-02-20T09:30:00.000Z',
        updatedAt: '2023-02-25T11:20:00.000Z'
      },
      {
        _id: 'b6',
        title: 'Responsive Design Best Practices',
        summary: 'Creating websites that work seamlessly across all devices',
        content: '# Responsive Design\n\nIn today\'s multi-device world...',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
        tags: ['CSS', 'Responsive Design', 'Web Design'],
        slug: 'responsive-design-best-practices',
        published: true,
        createdAt: '2023-01-15T14:45:00.000Z',
        updatedAt: '2023-01-18T16:30:00.000Z'
      }
    ];
    
    // Filter by tag if provided
    let filteredBlogs = mockBlogs;
    if (tag) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Sort blogs if sort is provided
    if (sort) {
      const [field, order] = sort.split(':');
      filteredBlogs.sort((a, b) => {
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
      filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Paginate results
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      success: true,
      count: filteredBlogs.length,
      data: paginatedBlogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredBlogs.length / limitNum)
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Blogs function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error retrieving blogs',
        error: error.message
      })
    };
  }
}; 