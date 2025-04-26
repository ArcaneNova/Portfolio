import React from 'react';
import { FaChartLine, FaUsers, FaRegEye, FaRegHeart } from 'react-icons/fa';

const UserStatsWidget = ({ className }) => {
  // Dummy data - in a real app, this would come from props or an API
  const userData = {
    visitors: {
      count: 2467,
      change: 12.5,
      increasing: true
    },
    profileViews: {
      count: 846,
      change: 5.2,
      increasing: true
    },
    followers: {
      count: 326,
      change: -2.3,
      increasing: false
    },
    likes: {
      count: 1523,
      change: 8.7,
      increasing: true
    }
  };

  // Simple data for the chart
  const chartData = [20, 40, 35, 50, 45, 60, 70, 65, 75, 80, 85];
  const maxValue = Math.max(...chartData);

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">User Statistics</h2>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="h-32 mb-6 flex items-end space-x-1">
          {chartData.map((value, index) => (
            <div 
              key={index}
              className="flex-1 bg-indigo-600 rounded-t" 
              style={{ 
                height: `${(value / maxValue) * 100}%`,
                opacity: 0.5 + (index / chartData.length) * 0.5 
              }}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <FaRegEye size={18} />
              </div>
              <div className={`flex items-center text-xs font-medium ${userData.visitors.increasing ? 'text-green-400' : 'text-red-400'}`}>
                {userData.visitors.increasing ? '+' : '-'}{Math.abs(userData.visitors.change)}%
              </div>
            </div>
            <h3 className="text-xs text-gray-400">Total Visitors</h3>
            <p className="text-xl font-bold text-white mt-1">{userData.visitors.count.toLocaleString()}</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <FaChartLine size={18} />
              </div>
              <div className={`flex items-center text-xs font-medium ${userData.profileViews.increasing ? 'text-green-400' : 'text-red-400'}`}>
                {userData.profileViews.increasing ? '+' : '-'}{Math.abs(userData.profileViews.change)}%
              </div>
            </div>
            <h3 className="text-xs text-gray-400">Profile Views</h3>
            <p className="text-xl font-bold text-white mt-1">{userData.profileViews.count.toLocaleString()}</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <FaUsers size={18} />
              </div>
              <div className={`flex items-center text-xs font-medium ${userData.followers.increasing ? 'text-green-400' : 'text-red-400'}`}>
                {userData.followers.increasing ? '+' : '-'}{Math.abs(userData.followers.change)}%
              </div>
            </div>
            <h3 className="text-xs text-gray-400">Followers</h3>
            <p className="text-xl font-bold text-white mt-1">{userData.followers.count.toLocaleString()}</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
                <FaRegHeart size={18} />
              </div>
              <div className={`flex items-center text-xs font-medium ${userData.likes.increasing ? 'text-green-400' : 'text-red-400'}`}>
                {userData.likes.increasing ? '+' : '-'}{Math.abs(userData.likes.change)}%
              </div>
            </div>
            <h3 className="text-xs text-gray-400">Likes</h3>
            <p className="text-xl font-bold text-white mt-1">{userData.likes.count.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsWidget; 