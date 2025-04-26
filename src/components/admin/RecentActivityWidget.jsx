import React, { useState, useEffect } from 'react';
import { 
  FaProjectDiagram, FaBlog, FaTasks, FaComments, 
  FaEye, FaCog, FaUsers, FaPlus
} from 'react-icons/fa';
import { projectsAPI, blogsAPI, tasksAPI } from '../../utils/api';

const RecentActivityWidget = ({ className }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch recent data from different apis
        const [projectsResponse, blogsResponse, tasksResponse] = await Promise.all([
          projectsAPI.getAllProjects({ limit: 2, sort: 'createdAt:desc' }),
          blogsAPI.getAllBlogs({ limit: 2, sort: 'createdAt:desc' }),
          tasksAPI.getAllTasks({ limit: 2, sort: 'createdAt:desc' })
        ]);
        
        // Create activities array from the responses
        const combinedActivities = [
          // Map projects to activities
          ...(projectsResponse.data?.data || []).map(project => ({
            id: `project-${project._id}`,
            type: 'project',
            action: 'created',
            subject: project.title,
            time: getRelativeTime(new Date(project.createdAt)),
            user: {
              name: project.author?.username || 'Admin User',
              avatar: project.author?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'
            }
          })),
          
          // Map blogs to activities
          ...(blogsResponse.data?.data || []).map(blog => ({
            id: `blog-${blog._id}`,
            type: 'blog',
            action: 'published',
            subject: blog.title,
            time: getRelativeTime(new Date(blog.createdAt)),
            user: {
              name: blog.author?.username || 'Admin User',
              avatar: blog.author?.profileImage || 'https://randomuser.me/api/portraits/women/44.jpg'
            }
          })),
          
          // Map tasks to activities
          ...(tasksResponse.data?.data || []).map(task => ({
            id: `task-${task._id}`,
            type: 'task',
            action: task.completed ? 'completed' : 'added',
            subject: task.title,
            time: getRelativeTime(new Date(task.createdAt)),
            user: {
              name: task.assignee?.username || 'Admin User',
              avatar: task.assignee?.profileImage || 'https://randomuser.me/api/portraits/men/67.jpg'
            }
          }))
        ];
        
        // Sort by time (most recent first) and limit to 5
        const sortedActivities = combinedActivities
          .sort((a, b) => {
            // Convert relative time strings to comparable values (hacky but works for demo)
            const timeA = convertTimeToMinutes(a.time);
            const timeB = convertTimeToMinutes(b.time);
            return timeA - timeB;
          })
          .slice(0, 5);
        
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Fallback to sample data in case of error
        setActivities([
          {
            id: 1,
            type: 'project',
            action: 'created',
            subject: '3D Portfolio Website',
            time: '2 hours ago',
            user: {
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            }
          },
          {
            id: 2,
            type: 'blog',
            action: 'published',
            subject: 'Getting Started with Three.js',
            time: '5 hours ago',
            user: {
              name: 'Jane Smith',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            }
          },
          {
            id: 3,
            type: 'task',
            action: 'completed',
            subject: 'Update project documentation',
            time: 'Yesterday',
            user: {
              name: 'Alex Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Helper function to convert timestamps to relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  // Helper to convert time strings to minutes for sorting
  const convertTimeToMinutes = (timeStr) => {
    if (timeStr === 'Just now') return 0;
    if (timeStr.includes('minutes')) return parseInt(timeStr) || 1;
    if (timeStr.includes('hours')) return (parseInt(timeStr) || 1) * 60;
    if (timeStr === 'Yesterday') return 24 * 60;
    if (timeStr.includes('days')) return (parseInt(timeStr) || 1) * 24 * 60;
    return 7 * 24 * 60; // more than a week
  };
  
  // Get the appropriate icon for each activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return <FaProjectDiagram />;
      case 'blog':
        return <FaBlog />;
      case 'task':
        return <FaTasks />;
      case 'comment':
        return <FaComments />;
      case 'view':
        return <FaEye />;
      case 'setting':
        return <FaCog />;
      case 'user':
        return <FaUsers />;
      default:
        return <FaPlus />;
    }
  };

  // Get the appropriate color for each activity type
  const getActivityColor = (type) => {
    switch (type) {
      case 'project':
        return 'text-blue-400 bg-blue-500/10';
      case 'blog':
        return 'text-purple-400 bg-purple-500/10';
      case 'task':
        return 'text-amber-400 bg-amber-500/10';
      case 'comment':
        return 'text-green-400 bg-green-500/10';
      case 'view':
        return 'text-cyan-400 bg-cyan-500/10';
      case 'setting':
        return 'text-gray-400 bg-gray-500/10';
      case 'user':
        return 'text-pink-400 bg-pink-500/10';
      default:
        return 'text-indigo-400 bg-indigo-500/10';
    }
  };
  
  // Loading skeleton
  const ActivitySkeleton = () => (
    <div className="flex p-4">
      <div className="mr-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse mr-2"></div>
          <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-48 animate-pulse mt-2"></div>
        <div className="h-3 bg-gray-700 rounded w-16 animate-pulse mt-2"></div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Recent Activity</h2>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          View all
        </button>
      </div>

      <div className="divide-y divide-gray-700">
        {loading ? (
          <>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex p-4 hover:bg-gray-700/30 transition-colors">
              <div className="mr-4">
                <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <img 
                    src={activity.user.avatar} 
                    alt={activity.user.name} 
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium text-white">{activity.user.name}</span>
                </div>
                
                <p className="text-sm text-gray-300 mt-1">
                  {activity.action} <span className="font-medium">{activity.subject}</span>
                </p>
                
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget; 