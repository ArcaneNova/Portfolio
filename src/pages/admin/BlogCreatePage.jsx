import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaUpload, FaTags, FaEye, FaAngleDown, FaGlobe, FaCompress, FaExpand } from 'react-icons/fa';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { blogsAPI, uploadAPI } from '../../utils/api';
import { generateSlug, calculateReadTime } from '../../utils/helpers';
import MDEditor from '@uiw/react-md-editor';

const BlogCreatePage = () => {
  const navigate = useNavigate();
  
  // Blog state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('General');
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [selectedTab, setSelectedTab] = useState('content');
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const tagsContainerRef = useRef(null);
  
  // Calculate read time whenever content changes
  const [readTime, setReadTime] = useState(5);
  useEffect(() => {
    if (content) {
      setReadTime(calculateReadTime(content));
    }
  }, [content]);
  
  // Auto-generate SEO title from blog title
  useEffect(() => {
    if (title && !seoTitle) {
      setSeoTitle(title);
    }
  }, [title, seoTitle]);
  
  // Auto-generate excerpt from content if empty
  useEffect(() => {
    if (content && !excerpt) {
      const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
      if (plainText.length > 0) {
        const autoExcerpt = plainText.length > 300 
          ? plainText.substring(0, 297) + '...' 
          : plainText;
        setExcerpt(autoExcerpt);
      }
    }
  }, [content, excerpt]);
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WEBP)');
      return;
    }
    
    // Max size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image
      const response = await uploadAPI.uploadImage(formData);
      const imageUrl = response.data.url;
      
      setCoverImage(imageUrl);
      setError(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tag input
  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      
      const newTag = tagInput.trim().toLowerCase();
      
      // Check if tag already exists
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    if (!excerpt) {
      setError('Please provide a brief excerpt for your blog post');
      return;
    }
    
    if (!coverImage) {
      setError('Please upload a cover image');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Generate a slug from the title
      const slug = generateSlug(title);
      
      // Prepare blog data
      const blogData = {
        title,
        content,
        excerpt,
        coverImage,
        tags,
        category,
        slug,
        readTime,
        isPublished,
        seo: {
          metaTitle: seoTitle || title,
          metaDescription: seoDescription || excerpt,
          keywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : tags
        }
      };
      
      // Create the blog
      await blogsAPI.createBlog(blogData);
      
      // Navigate to blogs page on success
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error creating blog:', err);
      setError(err.response?.data?.message || 'Failed to create blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle discard changes
  const handleDiscard = () => {
    if (title || content || excerpt || coverImage || tags.length > 0) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        navigate('/admin/blogs');
      }
    } else {
      navigate('/admin/blogs');
    }
  };
  
  // Categories (can be expanded)
  const categories = [
    'General',
    'Programming',
    'Web Development',
    'Design',
    'Career',
    'Tutorial',
    'News',
    'Opinion'
  ];
  
  return (
    <DashboardLayout>
      <div className={`space-y-6 ${editorFullscreen ? 'h-screen overflow-hidden' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Blog Post</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/70" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Blog form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Cover Image <span className="text-red-500">*</span>
            </label>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-shrink-0">
                {coverImage ? (
                  <div className="relative h-48 w-full md:w-80 overflow-hidden rounded-md">
                    <img 
                      src={coverImage} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-md h-48 w-full md:w-80 cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <FaUpload className="text-gray-500 text-2xl mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload image</p>
                    <p className="text-gray-600 text-xs mt-1">JPEG, PNG, GIF, WEBP (Max 5MB)</p>
                  </div>
                )}
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
              </div>
              
              {!coverImage && (
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Or enter image URL"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Tabs */}
          <div className="bg-gray-900 rounded-md overflow-hidden border border-gray-700">
            <div className="flex border-b border-gray-700">
              <button
                type="button"
                onClick={() => setSelectedTab('content')}
                className={`px-4 py-2 text-sm ${
                  selectedTab === 'content'
                    ? 'bg-gray-800 text-white font-medium border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('excerpt')}
                className={`px-4 py-2 text-sm ${
                  selectedTab === 'excerpt'
                    ? 'bg-gray-800 text-white font-medium border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Excerpt
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('preview')}
                className={`px-4 py-2 text-sm ${
                  selectedTab === 'preview'
                    ? 'bg-gray-800 text-white font-medium border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Preview
              </button>
              <div className="ml-auto flex items-center px-2">
                <button
                  type="button"
                  onClick={() => setEditorFullscreen(!editorFullscreen)}
                  className="p-1 text-gray-400 hover:text-white"
                  title={editorFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                >
                  {editorFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
            
            <div className={`${editorFullscreen ? 'fixed inset-0 z-50 pt-14 bg-gray-900' : ''}`}>
              {selectedTab === 'content' && (
                <div data-color-mode="dark">
                  <MDEditor
                    value={content}
                    onChange={setContent}
                    height={editorFullscreen ? 'calc(100vh - 120px)' : 400}
                    preview="edit"
                    className="bg-gray-900"
                  />
                </div>
              )}
              
              {selectedTab === 'excerpt' && (
                <div className="p-4">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-400 mb-1">
                    Blog Excerpt <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({excerpt.length}/300 characters)
                    </span>
                  </label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
                    placeholder="Write a brief summary of your blog post (max 300 characters)"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                    maxLength={300}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This excerpt will be displayed in blog listings and social media shares.
                  </p>
                </div>
              )}
              
              {selectedTab === 'preview' && (
                <div className="p-6 prose prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{title || 'Untitled Blog Post'}</h1>
                  
                  {coverImage && (
                    <img 
                      src={coverImage} 
                      alt={title} 
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <div className="flex items-center text-sm text-gray-400 mb-6 space-x-4">
                    <span>
                      Category: {category}
                    </span>
                    <span>
                      {readTime} min read
                    </span>
                    <span>
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="markdown-preview">
                    <MDEditor.Markdown source={content || '_No content yet_'} />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Blog Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Tags
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTags className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags (press Enter or comma to add)"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {tags.length > 0 && (
                <div 
                  ref={tagsContainerRef}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1.5 text-indigo-400 hover:text-indigo-200"
                        onClick={() => removeTag(tag)}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Publishing Options */}
          <div className="bg-gray-900 rounded-md p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Publishing Options</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-3">
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Estimated Reading Time:</span>
                  <span className="font-medium text-white">{readTime} minutes</span>
                </div>
              </div>
            </div>
            
            {/* SEO Settings */}
            <div className="mt-6">
              <button
                type="button"
                className="flex items-center justify-between w-full text-left"
                onClick={() => setShowSeoSection(!showSeoSection)}
              >
                <div className="flex items-center">
                  <FaGlobe className="text-gray-400 mr-2" />
                  <span className="font-medium">SEO Settings</span>
                </div>
                <FaAngleDown className={`text-gray-400 transition-transform ${showSeoSection ? 'rotate-180' : ''}`} />
              </button>
              
              {showSeoSection && (
                <div className="mt-4 space-y-4 bg-gray-800 p-4 rounded-md">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-400 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="seoTitle"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="SEO Title (defaults to post title)"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-400 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      id="seoDescription"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="SEO Description (defaults to post excerpt)"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-400 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      id="seoKeywords"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="Comma-separated keywords (defaults to tags)"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BlogCreatePage; 