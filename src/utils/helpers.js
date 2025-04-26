/**
 * Collection of helper functions used throughout the application
 */

/**
 * Format a date string to a human-readable format
 * @param {string|Date} dateString - The date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  // Default format options
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  
  return formatDate(date);
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length (default: a 180)
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 180) => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  
  return text.slice(0, length) + '...';
};

/**
 * Generate a slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Calculate read time for a text
 * @param {string} text - The content to calculate read time for
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {number} - Estimated read time in minutes
 */
export const calculateReadTime = (text, wordsPerMinute = 200) => {
  if (!text) return 1;
  
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Extract image URLs from markdown content
 * @param {string} markdown - Markdown content
 * @returns {string[]} - Array of image URLs
 */
export const extractImagesFromMarkdown = (markdown) => {
  if (!markdown) return [];
  
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = [...markdown.matchAll(regex)];
  
  return matches.map(match => match[1]);
};

/**
 * Convert markdown to plain text
 * @param {string} markdown - Markdown content
 * @returns {string} - Plain text
 */
export const markdownToPlainText = (markdown) => {
  if (!markdown) return '';
  
  return markdown
    .replace(/#{1,6}\s?([^\n]+)/g, '$1') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '') // Images
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/^>\s(.+)/gm, '$1') // Blockquotes
    .replace(/^\s*[-+*]\s+(.+)/gm, '$1') // Unordered lists
    .replace(/^\s*\d+\.\s+(.+)/gm, '$1') // Ordered lists
    .replace(/(\n\s*){3,}/g, '\n\n'); // Multiple newlines
}; 