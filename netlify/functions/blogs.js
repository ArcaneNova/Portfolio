/**
 * Standalone serverless function for handling blogs API
 */
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
  
  console.log('BLOGS FUNCTION: Processing request', event.httpMethod, event.path);
  console.log('Query params:', event.queryStringParameters);
  
  try {
    // GET blogs
    if (event.httpMethod === 'GET' && !event.path.includes('/blogs/')) {
      // Parse query params with defaults
      const queryParams = event.queryStringParameters || {};
      const limit = parseInt(queryParams.limit || '10', 10);
      const page = parseInt(queryParams.page || '1', 10);
      const sort = queryParams.sort || 'createdAt:desc';
      const tag = queryParams.tag;
      
      console.log('Fetching blogs with params:', { limit, page, sort, tag });
      
      // In a real app, you would fetch blogs from a database
      // For now, we'll return mock data
      const mockBlogs = [
        {
          _id: 'b1',
          title: 'Getting Started with Three.js',
          excerpt: 'Learn the basics of 3D graphics in the browser with Three.js',
          content: '# Introduction to Three.js\n\nThree.js is a powerful JavaScript library for creating 3D graphics in the browser. It abstracts away many of the complexities of WebGL, making it easier to create impressive 3D visualizations and experiences.\n\n## Getting Started\n\nFirst, install Three.js via npm:\n\n```bash\nnpm install three\n```\n\nThen, create a basic scene with a rotating cube:\n\n```javascript\nimport * as THREE from \'three\';\n\n// Create scene, camera and renderer\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\n\n// Create a cube\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\n\ncamera.position.z = 5;\n\n// Animation loop\nfunction animate() {\n  requestAnimationFrame(animate);\n  \n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  \n  renderer.render(scene, camera);\n}\n\nanimate();\n```\n\n## Adding Lights\n\nTo see materials properly, you\'ll need lights:\n\n```javascript\nconst ambientLight = new THREE.AmbientLight(0x404040);\nscene.add(ambientLight);\n\nconst directionalLight = new THREE.DirectionalLight(0xffffff, 1);\ndirectionalLight.position.set(1, 1, 1);\nscene.add(directionalLight);\n```\n\n## Next Steps\n\nFrom here, you can explore more complex geometries, materials, textures, animations, and interactions. Three.js has a rich ecosystem with many examples and extensions.',
          coverImage: 'https://images.unsplash.com/photo-1610986603166-f78428812d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8M2QlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['Three.js', 'JavaScript', '3D', 'WebGL'],
          category: 'Programming',
          slug: 'getting-started-with-threejs',
          readTime: 6,
          isPublished: true,
          publishedAt: '2023-06-10T08:00:00.000Z',
          createdAt: '2023-06-10T08:00:00.000Z',
          updatedAt: '2023-06-15T10:30:00.000Z',
          seo: {
            metaTitle: 'Getting Started with Three.js - A Beginner\'s Guide',
            metaDescription: 'Learn how to create impressive 3D graphics in the browser using Three.js, with code examples and step-by-step instructions.',
            keywords: ['Three.js', 'JavaScript', '3D Graphics', 'WebGL', 'Tutorial']
          },
          views: 254,
          likes: 18
        },
        {
          _id: 'b2',
          title: 'Modern React Patterns',
          excerpt: 'Exploring advanced React patterns for scalable applications',
          content: '# Modern React Patterns\n\nAs React applications grow in complexity, it becomes increasingly important to use patterns that promote code reusability, separation of concerns, and maintainability. In this post, we\'ll explore several modern React patterns that can help you build more scalable applications.\n\n## Compound Components\n\nCompound components provide a way to create components that work together to accomplish a common goal. This pattern is especially useful for building complex UI components like tabs, accordions, or dropdown menus.\n\n```jsx\n// Example of compound components pattern\nconst Tabs = ({ children, defaultIndex = 0 }) => {\n  const [activeIndex, setActiveIndex] = useState(defaultIndex);\n  \n  return (\n    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>\n      {children}\n    </TabsContext.Provider>\n  );\n};\n\nconst TabList = ({ children }) => {\n  return <div className="tab-list">{children}</div>;\n};\n\nconst Tab = ({ index, children }) => {\n  const { activeIndex, setActiveIndex } = useContext(TabsContext);\n  \n  return (\n    <button\n      className={`tab ${activeIndex === index ? \'active\' : \'\'}`}\n      onClick={() => setActiveIndex(index)}\n    >\n      {children}\n    </button>\n  );\n};\n\nconst TabPanels = ({ children }) => {\n  const { activeIndex } = useContext(TabsContext);\n  \n  return <div className="tab-panels">{children[activeIndex]}</div>;\n};\n\nconst TabPanel = ({ children }) => {\n  return <div className="tab-panel">{children}</div>;\n};\n\n// Usage\n<Tabs>\n  <TabList>\n    <Tab index={0}>Tab 1</Tab>\n    <Tab index={1}>Tab 2</Tab>\n  </TabList>\n  <TabPanels>\n    <TabPanel>Content for Tab 1</TabPanel>\n    <TabPanel>Content for Tab 2</TabPanel>\n  </TabPanels>\n</Tabs>\n```\n\n## Render Props\n\nThe render props pattern involves passing a function as a prop that returns a React element. This pattern provides a flexible way to share code between components.\n\n```jsx\n// Example of render props pattern\nconst MouseTracker = ({ render }) => {\n  const [position, setPosition] = useState({ x: 0, y: 0 });\n  \n  const handleMouseMove = (e) => {\n    setPosition({ x: e.clientX, y: e.clientY });\n  };\n  \n  return (\n    <div onMouseMove={handleMouseMove} style={{ height: \'100%\' }}>\n      {render(position)}\n    </div>\n  );\n};\n\n// Usage\n<MouseTracker\n  render={({ x, y }) => (\n    <p>The mouse position is ({x}, {y})</p>\n  )}\n/>\n```\n\n## Custom Hooks\n\nCustom hooks allow you to extract component logic into reusable functions. This pattern helps keep components clean and focused on rendering.\n\n```jsx\n// Example of a custom hook\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.error(error);\n      return initialValue;\n    }\n  });\n  \n  const setValue = (value) => {\n    try {\n      const valueToStore =\n        value instanceof Function ? value(storedValue) : value;\n      setStoredValue(valueToStore);\n      window.localStorage.setItem(key, JSON.stringify(valueToStore));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n  \n  return [storedValue, setValue];\n}\n\n// Usage\nfunction App() {\n  const [name, setName] = useLocalStorage(\'name\', \'Bob\');\n  \n  return (\n    <div>\n      <input\n        type="text"\n        value={name}\n        onChange={(e) => setName(e.target.value)}\n      />\n    </div>\n  );\n}\n```\n\n## Context + Reducers\n\nCombining the Context API with reducers provides a powerful state management solution for complex applications, similar to Redux but built into React.\n\n```jsx\n// Example of Context + Reducer pattern\nconst initialState = { count: 0 };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \'increment\':\n      return { count: state.count + 1 };\n    case \'decrement\':\n      return { count: state.count - 1 };\n    default:\n      throw new Error();\n  }\n}\n\nconst CounterContext = createContext();\n\nfunction CounterProvider({ children }) {\n  const [state, dispatch] = useReducer(reducer, initialState);\n  \n  return (\n    <CounterContext.Provider value={{ state, dispatch }}>\n      {children}\n    </CounterContext.Provider>\n  );\n}\n\nfunction useCounter() {\n  const context = useContext(CounterContext);\n  if (!context) {\n    throw new Error(\'useCounter must be used within a CounterProvider\');\n  }\n  return context;\n}\n\n// Usage\nfunction App() {\n  return (\n    <CounterProvider>\n      <Counter />\n    </CounterProvider>\n  );\n}\n\nfunction Counter() {\n  const { state, dispatch } = useCounter();\n  return (\n    <div>\n      Count: {state.count}\n      <button onClick={() => dispatch({ type: \'decrement\' })}>-</button>\n      <button onClick={() => dispatch({ type: \'increment\' })}>+</button>\n    </div>\n  );\n}\n```\n\n## Conclusion\n\nThese patterns represent just a few of the many approaches available for structuring React applications. The best pattern to use depends on your specific requirements and the complexity of your application. As React continues to evolve, new patterns will emerge, but these foundational patterns will likely remain relevant for years to come.',
          coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhY3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
          category: 'Web Development',
          slug: 'modern-react-patterns',
          readTime: 9,
          isPublished: true,
          publishedAt: '2023-05-22T14:20:00.000Z',
          createdAt: '2023-05-22T14:20:00.000Z',
          updatedAt: '2023-05-25T09:15:00.000Z',
          seo: {
            metaTitle: 'Modern React Patterns for Scalable Applications',
            metaDescription: 'Learn advanced React patterns including compound components, render props, custom hooks, and more for building maintainable applications.',
            keywords: ['React', 'JavaScript', 'Design Patterns', 'Web Development', 'Frontend']
          },
          views: 412,
          likes: 47
        },
        {
          _id: 'b3',
          title: 'Building a Portfolio with Next.js',
          excerpt: 'Create a performant developer portfolio using Next.js and TailwindCSS',
          content: '# Building with Next.js\n\nNext.js is a React framework that enables server-side rendering, static site generation, and more. Combined with TailwindCSS, it\'s an excellent choice for building a modern developer portfolio. In this guide, we\'ll walk through creating a portfolio website from scratch.',
          coverImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydGZvbGlvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
          tags: ['Next.js', 'Portfolio', 'TailwindCSS', 'React'],
          category: 'Web Development',
          slug: 'portfolio-with-nextjs',
          readTime: 7,
          isPublished: true,
          publishedAt: '2023-04-15T11:45:00.000Z',
          createdAt: '2023-04-15T11:45:00.000Z',
          updatedAt: '2023-04-18T16:30:00.000Z',
          seo: {
            metaTitle: 'Building a Developer Portfolio with Next.js and TailwindCSS',
            metaDescription: 'Learn how to create a modern, performant developer portfolio website using Next.js and TailwindCSS with step-by-step instructions.',
            keywords: ['Next.js', 'TailwindCSS', 'Portfolio', 'Web Development']
          },
          views: 287,
          likes: 24
        },
        {
          _id: 'b4',
          title: 'CSS Grid Mastery',
          excerpt: 'Advanced techniques for complex layouts with CSS Grid',
          content: '# CSS Grid Mastery\n\nCSS Grid is a powerful layout system that allows for complex two-dimensional layouts. In this comprehensive guide, we\'ll explore advanced techniques for mastering CSS Grid.',
          coverImage: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JpZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['CSS', 'Web Design', 'Layout', 'Frontend'],
          category: 'Design',
          slug: 'css-grid-mastery',
          readTime: 8,
          isPublished: false,
          createdAt: '2023-03-08T13:20:00.000Z',
          updatedAt: '2023-03-10T17:40:00.000Z',
          seo: {
            metaTitle: 'CSS Grid Mastery: Advanced Techniques for Complex Layouts',
            metaDescription: 'Master CSS Grid with advanced techniques for creating complex, responsive layouts. Perfect for web designers and developers.',
            keywords: ['CSS Grid', 'Web Design', 'CSS', 'Layout', 'Frontend']
          },
          views: 0,
          likes: 0
        }
      ];
      
      // Filter by tag if provided
      let filteredBlogs = mockBlogs;
      if (tag) {
        console.log(`Filtering blogs by tag: ${tag}`);
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        console.log(`Found ${filteredBlogs.length} blogs with tag: ${tag}`);
      }
      
      // Only return published blogs by default
      if (!queryParams.includeUnpublished) {
        filteredBlogs = filteredBlogs.filter(blog => blog.isPublished);
      }
      
      // Sort blogs if sort is provided
      if (sort) {
        console.log(`Sorting blogs by: ${sort}`);
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
          } else if (field === 'views') {
            return order === 'desc'
              ? (b.views || 0) - (a.views || 0)
              : (a.views || 0) - (b.views || 0);
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
      
      // Check for valid pagination parameters
      if (page < 1 || limit < 1) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid pagination parameters. Page and limit must be positive integers.'
          })
        };
      }
      
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
    }
    
    // GET single blog
    if (event.httpMethod === 'GET' && event.path.includes('/blogs/')) {
      const blogId = event.path.split('/blogs/')[1];
      
      if (!blogId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog ID is required'
          })
        };
      }
      
      console.log(`Fetching blog with ID: ${blogId}`);
      
      // In a real app, you would fetch the blog from a database
      // For now, we'll return mock data
      const mockBlogs = [
        {
          _id: 'b1',
          title: 'Getting Started with Three.js',
          excerpt: 'Learn the basics of 3D graphics in the browser with Three.js',
          content: '# Introduction to Three.js\n\nThree.js is a powerful JavaScript library...',
          coverImage: 'https://images.unsplash.com/photo-1610986603166-f78428812d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8M2QlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['Three.js', 'JavaScript', '3D', 'WebGL'],
          category: 'Programming',
          slug: 'getting-started-with-threejs',
          readTime: 6,
          isPublished: true,
          publishedAt: '2023-06-10T08:00:00.000Z',
          createdAt: '2023-06-10T08:00:00.000Z',
          updatedAt: '2023-06-15T10:30:00.000Z',
          seo: {
            metaTitle: 'Getting Started with Three.js - A Beginner\'s Guide',
            metaDescription: 'Learn how to create impressive 3D graphics in the browser using Three.js, with code examples and step-by-step instructions.',
            keywords: ['Three.js', 'JavaScript', '3D Graphics', 'WebGL', 'Tutorial']
          },
          views: 254,
          likes: 18
        },
        // ... other blog entries
      ];
      
      const blog = mockBlogs.find(blog => blog._id === blogId);
      
      if (!blog) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog not found'
          })
        };
      }
      
      // Prepare response
      const response = {
        success: true,
        data: blog
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    }
    
    // GET blog by slug
    if (event.httpMethod === 'GET' && event.path.includes('/blogs/slug/')) {
      const slug = event.path.split('/blogs/slug/')[1];
      
      if (!slug) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog slug is required'
          })
        };
      }
      
      console.log(`Fetching blog with slug: ${slug}`);
      
      // In a real app, you would fetch the blog from a database using the slug
      // For now, we'll return mock data
      const mockBlogs = [
        {
          _id: 'b1',
          title: 'Getting Started with Three.js',
          excerpt: 'Learn the basics of 3D graphics in the browser with Three.js',
          content: '# Introduction to Three.js\n\nThree.js is a powerful JavaScript library...',
          coverImage: 'https://images.unsplash.com/photo-1610986603166-f78428812d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8M2QlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['Three.js', 'JavaScript', '3D', 'WebGL'],
          category: 'Programming',
          slug: 'getting-started-with-threejs',
          readTime: 6,
          isPublished: true,
          publishedAt: '2023-06-10T08:00:00.000Z',
          createdAt: '2023-06-10T08:00:00.000Z',
          updatedAt: '2023-06-15T10:30:00.000Z',
          seo: {
            metaTitle: 'Getting Started with Three.js - A Beginner\'s Guide',
            metaDescription: 'Learn how to create impressive 3D graphics in the browser using Three.js, with code examples and step-by-step instructions.',
            keywords: ['Three.js', 'JavaScript', '3D Graphics', 'WebGL', 'Tutorial']
          },
          views: 254,
          likes: 18
        },
        {
          _id: 'b2',
          title: 'Modern React Patterns',
          excerpt: 'Exploring advanced React patterns for scalable applications',
          content: '# Modern React Patterns\n\nAs React applications grow in complexity...',
          coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhY3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
          tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
          category: 'Web Development',
          slug: 'modern-react-patterns',
          readTime: 9,
          isPublished: true,
          publishedAt: '2023-05-22T14:20:00.000Z',
          createdAt: '2023-05-22T14:20:00.000Z',
          updatedAt: '2023-05-25T09:15:00.000Z',
          seo: {
            metaTitle: 'Modern React Patterns for Scalable Applications',
            metaDescription: 'Learn advanced React patterns including compound components, render props, custom hooks, and more for building maintainable applications.',
            keywords: ['React', 'JavaScript', 'Design Patterns', 'Web Development', 'Frontend']
          },
          views: 412,
          likes: 47
        },
        {
          _id: 'b3',
          title: 'Building a Portfolio with Next.js',
          excerpt: 'Create a performant developer portfolio using Next.js and TailwindCSS',
          content: '# Building with Next.js\n\nNext.js is a React framework that enables server-side rendering...',
          coverImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydGZvbGlvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
          tags: ['Next.js', 'Portfolio', 'TailwindCSS', 'React'],
          category: 'Web Development',
          slug: 'portfolio-with-nextjs',
          readTime: 7,
          isPublished: true,
          publishedAt: '2023-04-15T11:45:00.000Z',
          createdAt: '2023-04-15T11:45:00.000Z',
          updatedAt: '2023-04-18T16:30:00.000Z',
          seo: {
            metaTitle: 'Building a Developer Portfolio with Next.js and TailwindCSS',
            metaDescription: 'Learn how to create a modern, performant developer portfolio website using Next.js and TailwindCSS with step-by-step instructions.',
            keywords: ['Next.js', 'TailwindCSS', 'Portfolio', 'Web Development']
          },
          views: 287,
          likes: 24
        }
      ];
      
      const blog = mockBlogs.find(blog => blog.slug === slug);
      
      if (!blog) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog not found'
          })
        };
      }
      
      // Prepare response
      const response = {
        success: true,
        data: blog
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    }
    
    // POST increment blog views
    if (event.httpMethod === 'POST' && event.path.includes('/blogs/') && event.path.endsWith('/views')) {
      const blogId = event.path.split('/blogs/')[1].replace('/views', '');
      
      if (!blogId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog ID is required'
          })
        };
      }
      
      console.log(`Incrementing views for blog with ID: ${blogId}`);
      
      // In a real app, you would update the blog's view count in the database
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Blog views incremented successfully'
        })
      };
    }
    
    // POST toggle blog like
    if (event.httpMethod === 'POST' && event.path.includes('/blogs/') && event.path.endsWith('/like')) {
      const blogId = event.path.split('/blogs/')[1].replace('/like', '');
      
      if (!blogId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog ID is required'
          })
        };
      }
      
      console.log(`Toggling like for blog with ID: ${blogId}`);
      
      // In a real app, you would toggle the like status in the database
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Blog like toggled successfully',
          data: { liked: true, likes: 19 } // Mock response
        })
      };
    }
    
    // GET blog tags
    if (event.httpMethod === 'GET' && event.path.endsWith('/blogs/tags')) {
      console.log('Fetching blog tags');
      
      // In a real app, you would fetch unique tags from all blogs in the database
      // For now, we'll return mock data
      const mockTags = [
        'React',
        'JavaScript',
        'Three.js',
        'Web Development',
        'Frontend',
        '3D',
        'WebGL',
        'Next.js',
        'TailwindCSS',
        'Portfolio',
        'CSS',
        'Web Design',
        'Layout',
        'Programming',
        'Design'
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: mockTags
        })
      };
    }
    
    // Non-GET operations would require authentication in a real app
    // For this example, we'll return a success response for demonstration purposes
    
    // POST (create blog)
    if (event.httpMethod === 'POST') {
      // In a real app, you would validate the request body and save to a database
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Blog created successfully',
          data: { _id: `b${Date.now()}` }
        })
      };
    }
    
    // PUT (update blog)
    if (event.httpMethod === 'PUT' && event.path.includes('/blogs/')) {
      const blogId = event.path.split('/blogs/')[1];
      
      if (!blogId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog ID is required'
          })
        };
      }
      
      // In a real app, you would validate the request body and update the database
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Blog updated successfully'
        })
      };
    }
    
    // DELETE (delete blog)
    if (event.httpMethod === 'DELETE' && event.path.includes('/blogs/')) {
      const blogId = event.path.split('/blogs/')[1];
      
      if (!blogId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Blog ID is required'
          })
        };
      }
      
      // In a real app, you would delete the blog from the database
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Blog deleted successfully'
        })
      };
    }
    
    // If route not matched
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed or route not found'
      })
    };
    
  } catch (error) {
    console.error('Blogs function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error processing blog request',
        error: error.message
      })
    };
  }
}; 