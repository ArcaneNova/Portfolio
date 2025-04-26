import { useState, useEffect } from 'react';
import { 
  FaProjectDiagram, FaBlog, FaTasks, FaLightbulb, 
  FaToolbox, FaEye, FaCheckCircle, FaClock, 
  FaCalendarAlt, FaChartLine, FaChartBar, FaUser,
  FaArrowUp, FaArrowDown, FaEllipsisH, FaPlus
} from 'react-icons/fa';
import { projectsAPI, blogsAPI, tasksAPI, motivationsAPI, buildInPublicAPI } from '../../utils/api';
import DashboardLayout from '../../components/admin/DashboardLayout';
import UserStatsWidget from '../../components/admin/UserStatsWidget';
import RecentActivityWidget from '../../components/admin/RecentActivityWidget';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    projects: { count: 0, loading: true, change: 2 },
    blogs: { count: 0, loading: true, change: -1 },
    tasks: { count: 0, loading: true, change: 5 },
    motivations: { count: 0, loading: true, change: 0 },
    buildInPublic: { count: 0, loading: true, change: 3 }
  });
  
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Projects count and recent projects
        const projectsResponse = await projectsAPI.getAllProjects({ limit: 5 });
        if (projectsResponse.data?.success) {
          setStats(prev => ({ 
            ...prev, 
            projects: { 
              count: projectsResponse.data.count, 
              loading: false, 
              change: calculateChange(projectsResponse.data.count, prev.projects.count) 
            } 
          }));
          setRecentProjects(projectsResponse.data.data);
        }
        
        // Blogs count
        const blogsResponse = await blogsAPI.getAllBlogs({ limit: 1 });
        if (blogsResponse.data?.success) {
          setStats(prev => ({ 
            ...prev, 
            blogs: { 
              count: blogsResponse.data.count, 
              loading: false, 
              change: calculateChange(blogsResponse.data.count, prev.blogs.count) 
            } 
          }));
        }
        
        // Tasks count and recent tasks
        const tasksResponse = await tasksAPI.getAllTasks({ limit: 5, sort: 'createdAt:desc' });
        if (tasksResponse.data?.success) {
          setStats(prev => ({ 
            ...prev, 
            tasks: { 
              count: tasksResponse.data.count, 
              loading: false, 
              change: calculateChange(tasksResponse.data.count, prev.tasks.count) 
            } 
          }));
        }
        
        // Today's tasks
        const todaysTasks = await tasksAPI.getTodaysTasks();
        if (todaysTasks.data?.success) {
          setRecentTasks(todaysTasks.data.data);
        }
        
        // Motivations count
        const motivationsResponse = await motivationsAPI.getAllMotivations({ limit: 1 });
        if (motivationsResponse.data?.success) {
          setStats(prev => ({ 
            ...prev, 
            motivations: { 
              count: motivationsResponse.data.count, 
              loading: false, 
              change: calculateChange(motivationsResponse.data.count, prev.motivations.count) 
            } 
          }));
        }
        
        // Build in Public count
        const buildInPublicResponse = await buildInPublicAPI.getAllPosts({ limit: 1 });
        if (buildInPublicResponse.data?.success) {
          setStats(prev => ({ 
            ...prev, 
            buildInPublic: { 
              count: buildInPublicResponse.data.count, 
              loading: false, 
              change: calculateChange(buildInPublicResponse.data.count, prev.buildInPublic.count) 
            } 
          }));
        }
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load some dashboard data. Please refresh to try again.');
      } finally {
        setLoading(false);
      }
    };

    // Helper function to calculate percentage change
    const calculateChange = (newValue, oldValue) => {
      if (oldValue === 0 || oldValue === undefined) return 0;
      const change = ((newValue - oldValue) / oldValue) * 100;
      return Math.round(change);
    };

    fetchStats();
    
    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Dashboard stat cards
  const statCards = [
    { 
      title: 'Projects', 
      count: stats.projects.count, 
      icon: <FaProjectDiagram size={20} />, 
      color: 'from-blue-500 to-indigo-600',
      lightColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      change: stats.projects.change,
      loading: stats.projects.loading, 
      link: '/admin/projects' 
    },
    { 
      title: 'Blog Posts', 
      count: stats.blogs.count, 
      icon: <FaBlog size={20} />, 
      color: 'from-purple-500 to-indigo-600',
      lightColor: 'bg-purple-500/10',
      textColor: 'text-purple-500',
      change: stats.blogs.change,
      loading: stats.blogs.loading, 
      link: '/admin/blogs' 
    },
    { 
      title: 'Tasks', 
      count: stats.tasks.count, 
      icon: <FaTasks size={20} />, 
      color: 'from-amber-500 to-orange-600',
      lightColor: 'bg-amber-500/10',
      textColor: 'text-amber-500',
      change: stats.tasks.change,
      loading: stats.tasks.loading, 
      link: '/admin/tasks' 
    },
    { 
      title: 'Motivations', 
      count: stats.motivations.count, 
      icon: <FaLightbulb size={20} />, 
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500',
      change: stats.motivations.change,
      loading: stats.motivations.loading, 
      link: '/admin/motivations' 
    },
    { 
      title: 'Build in Public', 
      count: stats.buildInPublic.count, 
      icon: <FaToolbox size={20} />, 
      color: 'from-pink-500 to-rose-600',
      lightColor: 'bg-pink-500/10',
      textColor: 'text-pink-500',
      change: stats.buildInPublic.change,
      loading: stats.buildInPublic.loading, 
      link: '/admin/build-in-public' 
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header with actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back, {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.username || 'Admin' : 'Admin'}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 rounded-lg p-1 flex items-center">
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedPeriod === 'week' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedPeriod === 'month' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedPeriod === 'year' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </button>
            </div>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
              <FaPlus className="mr-2" size={14} />
              New Project
            </button>
          </div>
        </div>
        
        {/* Error message if any */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map(({ title, count, icon, color, lightColor, textColor, change, loading: cardLoading, link }) => (
            <div 
              key={title} 
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${lightColor} ${textColor}`}>
                  {icon}
                </div>
                <div className="flex items-center">
                  {change !== 0 && (
                    <span className={`flex items-center text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'} mr-2`}>
                      {change > 0 ? <FaArrowUp size={10} className="mr-1" /> : <FaArrowDown size={10} className="mr-1" />}
                      {Math.abs(change)}%
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700">
                    <FaEllipsisH size={14} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h2 className="text-sm font-medium text-gray-400">{title}</h2>
                <div className="mt-2">
                  {cardLoading ? (
                    <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-3xl font-bold text-white">{count}</p>
                  )}
                </div>
              </div>
              
              <a href={link} className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 flex items-center group">
                <span className="mr-1">View details</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>
        
        {/* Tabs for Recent Content */}
        <div className="border-b border-gray-700 pb-2">
          <div className="flex space-x-6">
            <button 
              className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('all')}
            >
              All
              {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>}
            </button>
            <button 
              className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'projects' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
              {activeTab === 'projects' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>}
            </button>
            <button 
              className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'tasks' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
              {activeTab === 'tasks' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>}
            </button>
            <button 
              className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'blogs' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('blogs')}
            >
              Blogs
              {activeTab === 'blogs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Recent Projects</h2>
              <a href="/admin/projects" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View all
              </a>
            </div>
            
            <div className="divide-y divide-gray-700">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center p-4">
                    <div className="w-10 h-10 rounded bg-gray-700 animate-pulse"></div>
                    <div className="ml-3 space-y-2 flex-1">
                      <div className="w-2/3 h-4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-1/3 h-3 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <div key={project._id} className="flex items-center p-4 hover:bg-gray-700/50 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${project.image ? '' : 'bg-indigo-500/20'} flex items-center justify-center text-indigo-400 overflow-hidden`}>
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <FaProjectDiagram />
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{project.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                        <FaCalendarAlt size={10} className="mr-1" /> 
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : project.status === 'in-progress' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {project.status || 'Active'}
                      </span>
                    </div>
                    <button className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaEllipsisH size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <FaProjectDiagram size={30} className="mx-auto mb-3 text-gray-500" />
                  <p>No projects found</p>
                  <button className="mt-3 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    Create a project
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Tasks */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Today's Tasks</h2>
              <a href="/admin/tasks" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View all
              </a>
            </div>
            
            <div className="divide-y divide-gray-700">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center p-4">
                    <div className="w-10 h-10 rounded bg-gray-700 animate-pulse"></div>
                    <div className="ml-3 space-y-2 flex-1">
                      <div className="w-2/3 h-4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-1/3 h-3 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : recentTasks.length > 0 ? (
                recentTasks.map(task => (
                  <div key={task._id} className="flex items-center p-4 hover:bg-gray-700/50 transition-colors group">
                    <div className="w-6 h-6 flex-shrink-0">
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 rounded-md border-2 border-gray-600 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900" 
                        checked={task.completed}
                        readOnly
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'} truncate`}>{task.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                        <FaClock size={10} className="mr-1" /> 
                        Due: {new Date(task.dueDate || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : task.priority === 'medium' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority || 'Low'}
                      </span>
                    </div>
                    <button className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaEllipsisH size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <FaCheckCircle size={30} className="mx-auto mb-3 text-gray-500" />
                  <p>No tasks for today</p>
                  <button className="mt-3 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    Create a task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <a 
              href="/admin/projects/new"
              className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                <FaProjectDiagram size={20} />
              </div>
              <span className="text-sm text-gray-200">Add Project</span>
            </a>
            
            <a 
              href="/admin/blogs/new"
              className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform">
                <FaBlog size={20} />
              </div>
              <span className="text-sm text-gray-200">Create Blog</span>
            </a>
            
            <a 
              href="/admin/tasks/new"
              className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                <FaTasks size={20} />
              </div>
              <span className="text-sm text-gray-200">Add Task</span>
            </a>
            
            <a 
              href="/admin/motivations/new"
              className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                <FaLightbulb size={20} />
              </div>
              <span className="text-sm text-gray-200">Add Motivation</span>
            </a>
            
            <a 
              href="/admin/build-in-public/new"
              className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-3 group-hover:scale-110 transition-transform">
                <FaToolbox size={20} />
              </div>
              <span className="text-sm text-gray-200">Build In Public</span>
            </a>
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UserStatsWidget className="lg:col-span-1" />
          <RecentActivityWidget className="lg:col-span-2" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 