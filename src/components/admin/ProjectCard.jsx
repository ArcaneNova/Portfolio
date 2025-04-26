import React from 'react';
import { 
  FaProjectDiagram, FaGithub, FaExternalLinkAlt, 
  FaEllipsisH, FaEye, FaRegHeart, FaComment 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const { 
    _id, 
    title, 
    description, 
    image, 
    tags = [], 
    sourceLink, 
    demoLink, 
    status = 'active',
    createdAt,
    stats = { views: 124, likes: 45, comments: 12 }
  } = project;

  // Placeholder image if none provided
  const placeholderImage = 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60';

  // Determine status badge styling
  const getStatusBadge = () => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
      case 'active':
        return 'bg-blue-500/20 text-blue-400';
      case 'paused':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Project image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image || placeholderImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge()}`}>
            {status}
          </span>
        </div>
        
        {/* Links */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          {sourceLink && (
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800/80 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <FaGithub size={16} />
            </a>
          )}
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800/80 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <FaExternalLinkAlt size={16} />
            </a>
          )}
        </div>
      </div>
      
      {/* Project details */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <FaEllipsisH size={16} />
          </button>
        </div>
        
        <p className="text-gray-400 mt-2 text-sm line-clamp-2">{description}</p>
        
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <FaEye className="mr-1" size={14} />
            <span>{stats.views}</span>
          </div>
          <div className="flex items-center">
            <FaRegHeart className="mr-1" size={14} />
            <span>{stats.likes}</span>
          </div>
          <div className="flex items-center">
            <FaComment className="mr-1" size={14} />
            <span>{stats.comments}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-4 flex justify-between">
          <Link
            to={`/admin/projects/${_id}`}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View Details
          </Link>
          <Link
            to={`/admin/projects/edit/${_id}`}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 