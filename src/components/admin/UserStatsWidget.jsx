import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaRegEye, FaRegHeart } from 'react-icons/fa';

const UserStatsWidget = ({ className }) => {
  const [userData, setUserData] = useState({
    visitors: {
      count: 0,
      change: 0,
      increasing: true
    },
    profileViews: {
      count: 0,
      change: 0,
      increasing: true
    },
    followers: {
      count: 0,
      change: 0,
      increasing: false
    },
    likes: {
      count: 0,
      change: 0,
      increasing: true
    }
  });
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        setUserData({
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
        });
        
        // Sample chart data
        setChartData([20, 40, 35, 50, 45, 60, 70, 65, 75, 80, 85]);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, []);

  const maxValue = chartData.length > 0 ? Math.max(...chartData) : 100;

  // Loading skeleton for stats
  const StatSkeleton = () => (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-gray-600 rounded-lg animate-pulse w-9 h-9"></div>
        <div className="bg-gray-600 rounded h-4 w-10 animate-pulse"></div>
      </div>
      <div className="h-3 bg-gray-600 rounded w-16 animate-pulse mb-2"></div>
      <div className="h-6 bg-gray-600 rounded w-20 animate-pulse"></div>
    </div>
  );

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">User Statistics</h2>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="h-32 mb-6 flex items-end space-x-1">
          {loading ? (
            Array.from({ length: 11 }).map((_, index) => (
              <div 
                key={index}
                className="flex-1 bg-gray-700 rounded-t animate-pulse" 
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))
          ) : (
            chartData.map((value, index) => (
              <div 
                key={index}
                className="flex-1 bg-indigo-600 rounded-t" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  opacity: 0.5 + (index / chartData.length) * 0.5 
                }}
              />
            ))
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatsWidget; 