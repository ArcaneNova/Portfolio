import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaImage } from 'react-icons/fa';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

const ProjectCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    githubLink: '',
    liveLink: '',
    featured: false,
    category: 'web',
    thumbnail: null
  });
  
  const [techInput, setTechInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        thumbnail: file
      });
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };
  
  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail image is required';
    
    // URL validations
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    if (formData.githubLink && !urlRegex.test(formData.githubLink)) {
      newErrors.githubLink = 'Please enter a valid URL';
    }
    
    if (formData.liveLink && !urlRegex.test(formData.liveLink)) {
      newErrors.liveLink = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object for file upload
      const projectData = new FormData();
      projectData.append('title', formData.title);
      projectData.append('description', formData.description);
      projectData.append('technologies', JSON.stringify(formData.technologies));
      projectData.append('githubLink', formData.githubLink);
      projectData.append('liveLink', formData.liveLink);
      projectData.append('featured', formData.featured);
      projectData.append('category', formData.category);
      projectData.append('thumbnail', formData.thumbnail);
      
      await api.post('/api/projects', projectData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Project</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
              disabled={isSubmitting}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              <FaSave className="mr-2" /> {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technologies*
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a technology"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {errors.technologies && <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Links */}
              <div>
                <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GitHub Link
                </label>
                <input
                  type="text"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.githubLink ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://github.com/username/repo"
                />
                {errors.githubLink && <p className="mt-1 text-sm text-red-500">{errors.githubLink}</p>}
              </div>
              
              <div>
                <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Live Link
                </label>
                <input
                  type="text"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.liveLink ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com"
                />
                {errors.liveLink && <p className="mt-1 text-sm text-red-500">{errors.liveLink}</p>}
              </div>
              
              {/* Category & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop App</option>
                    <option value="ai">AI/ML</option>
                    <option value="game">Game Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>
              </div>
              
              {/* Thumbnail */}
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Thumbnail Image*
                </label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'}`}>
                  {previewUrl ? (
                    <div className="text-center">
                      <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({...formData, thumbnail: null});
                          setPreviewUrl('');
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="thumbnail"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.thumbnail && <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProjectCreatePage; 