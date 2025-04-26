import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { FaPlus, FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectsWidget = ({ projects = [], loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Filter projects based on the filter and search query
  const filteredProjects = projects
    .filter(project => {
      // Filter by status
      if (filter !== 'all' && project.status !== filter) {
        return false;
      }

      // Filter by search query
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort projects
      if (sort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sort === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  // Generate placeholder projects for loading state
  const placeholderProjects = Array.from({ length: 6 }, (_, i) => ({
    _id: `placeholder-${i}`,
    title: '',
    description: '',
    image: '',
    tags: [],
    status: 'active',
    createdAt: new Date().toISOString(),
  }));

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-medium text-white">My Projects</h2>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 appearance-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          
          {/* Sort Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 appearance-none cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
          
          {/* Add Project Button */}
          <Link
            to="/admin/projects/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap"
          >
            <FaPlus className="mr-2" size={12} />
            Add
          </Link>
        </div>
      </div>
      
      {/* Projects Grid */}
      {loading ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderProjects.map(project => (
            <div key={project._id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden h-80 animate-pulse">
              <div className="h-48 bg-gray-700"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="pt-2 flex gap-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center">
          <p className="text-gray-400 mb-4">No projects found matching your criteria</p>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <FaPlus className="mr-2" size={12} />
            Create a New Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsWidget; 