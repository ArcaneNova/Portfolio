import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { projectsAPI } from '../../../utils/api';
import DashboardLayout from '../../../components/admin/DashboardLayout';

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  
  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'abandoned', label: 'Abandoned' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: '-title', label: 'Title Z-A' }
  ];

  // Fetch projects with filtering, searching, and pagination
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = {
          page: currentPage,
          limit: 10,
          sort: sortBy
        };
        
        // Add status filter if not 'all'
        if (filter !== 'all') {
          params.status = filter;
        }
        
        // Add search term if present
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        const response = await projectsAPI.getAllProjects(params);
        
        setProjects(response.data.data);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [currentPage, filter, sortBy, searchTerm]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page on new sort
  };
  
  // Handle project deletion
  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectsAPI.deleteProject(id);
        // Remove the deleted project from the state
        setProjects(projects.filter(project => project._id !== id));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          
          <Link 
            to="/admin/projects/new"
            className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-600 hover:to-blue-700 transition-colors"
          >
            <FaPlus size={14} />
            <span>Add Project</span>
          </Link>
        </div>
        
        {/* Filters and search bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-black-100/40 rounded-xl p-4 border border-blue-100/10">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-100/70">
                <FaSearch size={14} />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-black-100/60 border border-blue-100/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
          
          {/* Status filter */}
          <div className="w-full md:w-48">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 bg-black-100/60 border border-blue-100/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Sort by */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 bg-black-100/60 border border-blue-100/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-md">
            {error}
          </div>
        )}
        
        {/* Projects table */}
        <div className="bg-black-100/40 border border-blue-100/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-cyan-500 font-mono">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-blue-100/70">
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-blue-100/10">
                <thead className="bg-black-100/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100/10">
                  {projects.map(project => (
                    <tr key={project._id} className="hover:bg-black-100/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-black-100">
                            {project.thumbnail ? (
                              <img src={project.thumbnail} alt={project.title} className="h-10 w-10 object-cover" />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center text-cyan-400">
                                P
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{project.title}</div>
                            <div className="text-xs text-blue-100/70 truncate max-w-xs">{project.shortDescription}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-100">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : project.status === 'in-progress' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100/70">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-100/70 hover:text-blue-100 transition-colors"
                              title="View Demo"
                            >
                              <FaExternalLinkAlt size={14} />
                            </a>
                          )}
                          
                          {project.sourceCodeUrl && (
                            <a
                              href={project.sourceCodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-100/70 hover:text-blue-100 transition-colors"
                              title="View Source Code"
                            >
                              <FaGithub size={14} />
                            </a>
                          )}
                          
                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="p-2 text-blue-100/70 hover:text-cyan-400 transition-colors"
                            title="Edit Project"
                          >
                            <FaEdit size={14} />
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-2 text-blue-100/70 hover:text-red-400 transition-colors"
                            title="Delete Project"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm ${
                  currentPage === 1
                    ? 'bg-black-100/40 text-blue-100/50 cursor-not-allowed'
                    : 'bg-black-100/60 text-blue-100 hover:bg-black-100/80'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center px-4 py-2 rounded-md bg-black-100/60 text-blue-100">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm ${
                  currentPage === totalPages
                    ? 'bg-black-100/40 text-blue-100/50 cursor-not-allowed'
                    : 'bg-black-100/60 text-blue-100 hover:bg-black-100/80'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsListPage;

 