import React from 'react';
import { 
  FaProjectDiagram, FaBlog, FaTasks, FaComments, 
  FaEye, FaCog, FaUsers, FaPlus
} from 'react-icons/fa';

const RecentActivityWidget = ({ className }) => {
  // Dummy data - in a real app, this would come from props or an API
  const activities = [
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
    },
    {
      id: 4,
      type: 'comment',
      action: 'added',
      subject: 'Comment on Build in Public post',
      time: '2 days ago',
      user: {
        name: 'Sarah Williams',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      }
    },
    {
      id: 5,
      type: 'view',
      action: 'viewed',
      subject: 'Task Manager Project',
      time: '3 days ago',
      user: {
        name: 'Michael Brown',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    }
  ];

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

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Recent Activity</h2>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          View all
        </button>
      </div>

      <div className="divide-y divide-gray-700">
        {activities.map((activity) => (
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
        ))}
      </div>
    </div>
  );
};

export default RecentActivityWidget; 