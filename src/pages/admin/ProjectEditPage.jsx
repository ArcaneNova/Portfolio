import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaImage, FaSpinner, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const ProjectEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
    featured: false,
    category: 'web'
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [originalProject, setOriginalProject] = useState(null);

  const categories = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: '3d', label: '3D/Graphics' },
    { value: 'game', label: 'Game Development' },
    { value: 'ai', label: 'AI/Machine Learning' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/api/projects/${id}`);
        const project = response.data;
        setOriginalProject(project);
        
        // Format technologies from array to comma-separated string
        const techString = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : '';
        
        setFormData({
          title: project.title || '',
          description: project.description || '',
          technologies: techString,
          githubLink: project.githubLink || '',
          liveLink: project.liveLink || '',
          featured: project.featured || false,
          category: project.category || 'web'
        });
        
        // Set thumbnail preview if exists
        if (project.thumbnailUrl) {
          setThumbnailPreview(project.thumbnailUrl);
        }
        
      } catch (err) {
        console.error('Error fetching project:', err);
        toast.error('Failed to load project data');
        navigate('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          thumbnail: 'Please select an image file'
        }));
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          thumbnail: 'Image size should be less than 5MB'
        }));
        return;
      }
      
      setThumbnail(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any thumbnail errors
      if (errors.thumbnail) {
        setErrors(prev => ({
          ...prev,
          thumbnail: null
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.technologies.trim()) {
      newErrors.technologies = 'At least one technology must be specified';
    }
    
    if (formData.githubLink && !isValidUrl(formData.githubLink)) {
      newErrors.githubLink = 'Please enter a valid URL';
    }
    
    if (formData.liveLink && !isValidUrl(formData.liveLink)) {
      newErrors.liveLink = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart form submission
      const projectData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        projectData.append(key, formData[key]);
      });
      
      // Convert technologies string to array and serialize
      const techArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');
      
      projectData.set('technologies', JSON.stringify(techArray));
      
      // Append thumbnail file if changed
      if (thumbnail) {
        projectData.append('thumbnail', thumbnail);
      }
      
      // Send request to API
      await api.put(`/api/projects/${id}`, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Project updated successfully!');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error updating project:', err);
      
      if (err.response && err.response.data) {
        // Server validation errors
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          toast.error(err.response.data.message || 'Failed to update project');
        }
      } else {
        toast.error('Network error. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success('Project deleted successfully!');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Project: {originalProject?.title}</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 flex items-center disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" /> Delete
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 flex items-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Project Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-300">
                  Technologies *
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    errors.technologies ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.technologies && (
                  <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right column - Links and Image */}
            <div className="space-y-4">
              <div>
                <label htmlFor="githubLink" className="block text-sm font-medium text-gray-300">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    errors.githubLink ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.githubLink && (
                  <p className="mt-1 text-sm text-red-500">{errors.githubLink}</p>
                )}
              </div>

              <div>
                <label htmlFor="liveLink" className="block text-sm font-medium text-gray-300">
                  Live Demo URL
                </label>
                <input
                  type="text"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    errors.liveLink ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.liveLink && (
                  <p className="mt-1 text-sm text-red-500">{errors.liveLink}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
                    Feature this project (show on home page)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Thumbnail {!thumbnailPreview && '*'}
                </label>
                <div className={`p-4 border-2 border-dashed rounded-lg text-center ${
                  errors.thumbnail ? 'border-red-500' : 'border-gray-600'
                }`}>
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="mx-auto max-h-40 object-contain" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnail(null);
                          // If it's the original image, don't remove the preview
                          if (thumbnailPreview !== originalProject?.thumbnailUrl) {
                            setThumbnailPreview(originalProject?.thumbnailUrl || null);
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-gray-400">
                        <label 
                          htmlFor="thumbnail" 
                          className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="thumbnail" 
                            name="thumbnail" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProjectEditPage; 