import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaLinkedin, FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

// Social media links
const socialLinks = [
  {
    name: 'Email',
    icon: <FaEnvelope size={20} />,
    url: 'mailto:your.email@example.com',
    color: 'bg-gradient-to-r from-pink-500 to-red-500'
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin size={20} />,
    url: 'https://linkedin.com/in/yourusername',
    color: 'bg-gradient-to-r from-blue-400 to-blue-600'
  },
  {
    name: 'Twitter',
    icon: <FaTwitter size={20} />,
    url: 'https://twitter.com/yourusername',
    color: 'bg-gradient-to-r from-blue-400 to-cyan-400'
  },
  {
    name: 'GitHub',
    icon: <FaGithub size={20} />,
    url: 'https://github.com/yourusername',
    color: 'bg-gradient-to-r from-gray-600 to-gray-800'
  },
  {
    name: 'Discord',
    icon: <FaDiscord size={20} />,
    url: 'https://discord.gg/yourinvite',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
  }
];

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, you would send the form data to your backend or a form service
        console.log('Form submitted:', formData);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        setIsSubmitting(false);
        setSubmitStatus('success');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }, 1500);
    }
  };
  
  // GSAP animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'center center',
        toggleActions: 'play none none none'
      }
    });
    
    tl.from('.contact-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.contact-description', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.contact-form', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.social-link', {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.5');
    
  }, { scope: sectionRef });
  
  return (
    <section ref={sectionRef} id="contact" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black-200 opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
        
        {/* Animated elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-100/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative">
        {/* Section header */}
        <CyberpunkInterface className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white contact-title">
              <span className="text-blue-100">&lt;</span> Get In Touch <span className="text-blue-100">/&gt;</span>
            </h2>
            <p className="max-w-2xl mx-auto text-blue-50 contact-description">
              Have a project in mind or want to collaborate? I'm always open to discussing new opportunities and challenges.
            </p>
          </div>
        </CyberpunkInterface>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <div className="contact-form">
            <CyberpunkInterface className="h-full">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-blue-100">Send a Message</h3>
                
                {submitStatus === 'success' && (
                  <motion.div 
                    className="mb-6 p-4 bg-blue-100/10 border border-blue-100/30 rounded-md text-blue-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Thank you for your message! I'll get back to you soon.
                  </motion.div>
                )}
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-50 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-black-100 border ${
                          formErrors.name ? 'border-red-500' : 'border-blue-100/30'
                        } rounded-md px-4 py-2 text-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-100`}
                        placeholder="Enter your name"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-50 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-black-100 border ${
                          formErrors.email ? 'border-red-500' : 'border-blue-100/30'
                        } rounded-md px-4 py-2 text-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-100`}
                        placeholder="Enter your email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Subject field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-blue-50 mb-1">
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full bg-black-100 border ${
                          formErrors.subject ? 'border-red-500' : 'border-blue-100/30'
                        } rounded-md px-4 py-2 text-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-100`}
                        placeholder="What is this regarding?"
                      />
                      {formErrors.subject && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-blue-50 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={`w-full bg-black-100 border ${
                          formErrors.message ? 'border-red-500' : 'border-blue-100/30'
                        } rounded-md px-4 py-2 text-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-100`}
                        placeholder="Tell me about your project or inquiry"
                      ></textarea>
                      {formErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Submit button */}
                  <div className="pt-2">
                    <GlowEffect className="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-100/10 backdrop-blur-md border border-blue-100/30 px-6 py-3 rounded-lg text-blue-50 hover:bg-blue-100/20 transition-colors relative overflow-hidden group"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>Send Message</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        )}
                        <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-blue-100/20 to-transparent"></div>
                      </button>
                    </GlowEffect>
                  </div>
                </form>
              </div>
            </CyberpunkInterface>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col justify-between">
            <CyberpunkInterface className="mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-blue-100">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100/10 flex items-center justify-center mr-3">
                      <FaEnvelope className="text-blue-100" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-50">Email</p>
                      <a href="mailto:your.email@example.com" className="text-blue-100 hover:underline">
                       arshadnoor585@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100/10 flex items-center justify-center mr-3">
                      <FaDiscord className="text-blue-100" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-50">Discord</p>
                      <p className="text-blue-100">officialarshadnoor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-50">Location</p>
                      <p className="text-blue-100">Jalandhar, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </CyberpunkInterface>
            
            {/* Availability */}
            <CyberpunkInterface className="mb-8">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-100">Availability</h3>
                <p className="text-blue-50 mb-2">Currently available for:</p>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-blue-100 rounded-full mr-2"></span>
                    Full-time positions
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-blue-100 rounded-full mr-2"></span>
                    Freelance projects
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-blue-100 rounded-full mr-2"></span>
                    Consulting and technical advising
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-blue-100 rounded-full mr-2"></span>
                    Open source collaboration
                  </li>
                </ul>
              </div>
            </CyberpunkInterface>
            
            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-100">Connect With Me</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <GlowEffect key={index} className="social-link">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow duration-300`}
                      aria-label={`Connect on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  </GlowEffect>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
