import React from 'react';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';

/**
 * A reusable button component with multiple style variants.
 * Supports different types: filled, outlined, special
 * Can include icons from FontAwesome
 */
const Button = ({ type = "filled", title, icon, link, className, id }) => {
  // Get the right icon component
  const getIcon = () => {
    switch(icon) {
      case 'github':
        return <FaGithub className="h-5 w-5" />;
      case 'linkedin':
        return <FaLinkedin className="h-5 w-5" />;
      case 'file':
        return <FaFileAlt className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Get the appropriate class names based on button type
  const getButtonClasses = () => {
    switch(type) {
      case 'filled':
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      case 'outlined':
        return "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10";
      case 'special':
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${getButtonClasses()} ${className || ""}`}
      onClick={(e) => {
        // If there's a section ID to scroll to, handle it
        if (id) {
          e.preventDefault();
          const target = document.getElementById(id);
          
          if (target) {
            const offset = window.innerHeight * 0.15;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }}
    >
      {icon && getIcon()}
      <span>{title}</span>
    </a>
  );
};

export default Button;
