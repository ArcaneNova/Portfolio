import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { blogsAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  
  const fetchBlogs = async (page = 1, tag = '') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort: 'createdAt:desc'
      };
      
      if (tag) {
        params.tag = tag;
      }
      
      const response = await blogsAPI.getAllBlogs(params);
      console.log('Blogs response:', response);
      
      const data = response.data || {};
      setBlogs(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      
      // Extract unique tags
      const allTags = data.data.reduce((acc, blog) => {
        if (blog.tags && Array.isArray(blog.tags)) {
          return [...acc, ...blog.tags];
        }
        return acc;
      }, []);
      
      // Get unique tags
      setTags([...new Set(allTags)]);
      
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs(currentPage, selectedTag);
  }, [currentPage, selectedTag]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    
    try {
      await blogsAPI.deleteBlog(id);
      // Refresh the list
      fetchBlogs(currentPage, selectedTag);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog. Please try again.');
    }
  };
  
  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const renderBlogsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
          <p>{error}</p>
        </div>
      );
    }
    
    if (filteredBlogs.length === 0) {
      return (
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-500">No blog posts found</h3>
          <p className="mt-1 text-gray-400">Create your first blog post to get started</p>
          <Link 
            to="/admin/blogs/new" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <FaPlus className="mr-2" /> Create Blog
          </Link>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Views
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredBlogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {blog.coverImage && (
                      <div className="flex-shrink-0 h-10 w-10 mr-3">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={blog.coverImage} 
                          alt={blog.title} 
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-white">{blog.title}</div>
                      <div className="flex items-center mt-1 space-x-2">
                        {blog.tags && blog.tags.slice(0, 2).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300"
                          >
                            <FaTag className="mr-1 text-xs" /> {tag}
                          </span>
                        ))}
                        {blog.tags && blog.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{blog.tags.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    blog.isPublished ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-400">
                    <FaRegCalendarAlt className="mr-1" />
                    {formatDate(blog.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-400">
                    <FaEye className="mr-1" />
                    {blog.views || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link 
                      to={`/blog/${blog.slug}`} 
                      target="_blank"
                      className="text-gray-400 hover:text-white transition p-1"
                      title="View"
                    >
                      <FaEye />
                    </Link>
                    <Link 
                      to={`/admin/blogs/edit/${blog._id}`} 
                      className="text-indigo-400 hover:text-indigo-300 transition p-1"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-red-400 hover:text-red-300 transition p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <FaPlus className="mr-2" /> New Blog
            </Link>
          </div>
        </div>
        
        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-4">
            {tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagFilter(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } transition-colors`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="text-sm text-gray-400 hover:text-white ml-2"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
        
        {/* Blog List */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
          {renderBlogsList()}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogsPage; 