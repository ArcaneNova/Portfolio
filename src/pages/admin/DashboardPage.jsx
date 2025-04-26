import { useState, useEffect } from 'react';
import { FaProjectDiagram, FaBlog, FaTasks, FaLightbulb, FaToolbox, FaEye } from 'react-icons/fa';
import { projectsAPI, blogsAPI, tasksAPI, motivationsAPI, buildInPublicAPI } from '../../utils/api';
import DashboardLayout from '../../components/admin/DashboardLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    projects: { count: 0, loading: true },
    blogs: { count: 0, loading: true },
    tasks: { count: 0, loading: true },
    motivations: { count: 0, loading: true },
    buildInPublic: { count: 0, loading: true }
  });
  
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Projects count
        const projectsResponse = await projectsAPI.getAllProjects({ limit: 5 });
        setStats(prev => ({ ...prev, projects: { count: projectsResponse.data.count, loading: false } }));
        setRecentProjects(projectsResponse.data.data);
        
        // Blogs count
        const blogsResponse = await blogsAPI.getAllBlogs({ limit: 1 });
        setStats(prev => ({ ...prev, blogs: { count: blogsResponse.data.count, loading: false } }));
        
        // Tasks count and recent tasks
        const tasksResponse = await tasksAPI.getAllTasks({ limit: 5, sort: '-createdAt' });
        const todaysTasks = await tasksAPI.getTodaysTasks();
        setStats(prev => ({ ...prev, tasks: { count: tasksResponse.data.count, loading: false } }));
        setRecentTasks(todaysTasks.data.data);
        
        // Motivations count
        const motivationsResponse = await motivationsAPI.getAllMotivations({ limit: 1 });
        setStats(prev => ({ ...prev, motivations: { count: motivationsResponse.data.count, loading: false } }));
        
        // Build in Public count
        const buildInPublicResponse = await buildInPublicAPI.getAllPosts({ limit: 1 });
        setStats(prev => ({ ...prev, buildInPublic: { count: buildInPublicResponse.data.count, loading: false } }));
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  // Dashboard stat cards
  const statCards = [
    { title: 'Projects', count: stats.projects.count, icon: <FaProjectDiagram />, color: 'from-cyan-500 to-blue-600', loading: stats.projects.loading, link: '/admin/projects' },
    { title: 'Blog Posts', count: stats.blogs.count, icon: <FaBlog />, color: 'from-purple-500 to-indigo-600', loading: stats.blogs.loading, link: '/admin/blogs' },
    { title: 'Tasks', count: stats.tasks.count, icon: <FaTasks />, color: 'from-amber-500 to-orange-600', loading: stats.tasks.loading, link: '/admin/tasks' },
    { title: 'Motivations', count: stats.motivations.count, icon: <FaLightbulb />, color: 'from-emerald-500 to-teal-600', loading: stats.motivations.loading, link: '/admin/motivations' },
    { title: 'Build in Public', count: stats.buildInPublic.count, icon: <FaToolbox />, color: 'from-pink-500 to-rose-600', loading: stats.buildInPublic.loading, link: '/admin/build-in-public' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Error message if any */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map(({ title, count, icon, color, loading: cardLoading, link }) => (
              <a 
                key={title} 
                href={link}
                className="bg-black-100/40 border border-blue-100/10 rounded-xl p-6 transition-transform hover:transform hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/5 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-blue-100">{title}</h2>
                    <div className="mt-2">
                      {cardLoading ? (
                        <div className="w-12 h-6 bg-blue-100/20 rounded animate-pulse"></div>
                      ) : (
                        <p className="text-3xl font-bold text-white">{count}</p>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
                    {icon}
                  </div>
                </div>
                <div className="mt-4 text-xs text-blue-100/60 flex items-center">
                  <span className="mr-1">View all</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-black-100/40 border border-blue-100/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">Recent Projects</h2>
              <a href="/admin/projects" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View all
              </a>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center p-3 border border-blue-100/10 rounded-lg bg-black-100/40">
                    <div className="w-10 h-10 rounded bg-blue-100/20 animate-pulse"></div>
                    <div className="ml-3 space-y-2 flex-1">
                      <div className="w-2/3 h-4 bg-blue-100/20 rounded animate-pulse"></div>
                      <div className="w-1/3 h-3 bg-blue-100/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <div key={project._id} className="flex items-center p-3 border border-blue-100/10 rounded-lg bg-black-100/40 hover:bg-black-100/60 transition-colors">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400">
                      <FaProjectDiagram />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-white">{project.title}</h3>
                      <p className="text-xs text-blue-100/70">
                        {project.category} • {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : project.status === 'in-progress' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-blue-100/50">
                  No projects found
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Tasks */}
          <div className="bg-black-100/40 border border-blue-100/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">Today's Tasks</h2>
              <a href="/admin/tasks" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View all
              </a>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                // Loading placeholders
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center p-3 border border-blue-100/10 rounded-lg bg-black-100/40">
                    <div className="w-10 h-10 rounded bg-blue-100/20 animate-pulse"></div>
                    <div className="ml-3 space-y-2 flex-1">
                      <div className="w-2/3 h-4 bg-blue-100/20 rounded animate-pulse"></div>
                      <div className="w-1/3 h-3 bg-blue-100/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : recentTasks.length > 0 ? (
                recentTasks.map(task => (
                  <div key={task._id} className="flex items-center p-3 border border-blue-100/10 rounded-lg bg-black-100/40 hover:bg-black-100/60 transition-colors">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-amber-400">
                      <FaTasks />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-white">{task.title}</h3>
                      <p className="text-xs text-blue-100/70">
                        {task.category} • {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : task.priority === 'medium' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-blue-100/50">
                  No tasks for today
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-black-100/40 border border-blue-100/10 rounded-xl p-6">
          <h2 className="text-xl font-medium text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/admin/projects/new"
              className="flex flex-col items-center p-4 bg-black-100/60 rounded-lg border border-blue-100/10 hover:bg-black-100/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 mb-3">
                <FaProjectDiagram />
              </div>
              <span className="text-sm text-white">Add Project</span>
            </a>
            
            <a 
              href="/admin/blogs/new"
              className="flex flex-col items-center p-4 bg-black-100/60 rounded-lg border border-blue-100/10 hover:bg-black-100/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center text-purple-400 mb-3">
                <FaBlog />
              </div>
              <span className="text-sm text-white">Create Blog</span>
            </a>
            
            <a 
              href="/admin/tasks/new"
              className="flex flex-col items-center p-4 bg-black-100/60 rounded-lg border border-blue-100/10 hover:bg-black-100/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-amber-400 mb-3">
                <FaTasks />
              </div>
              <span className="text-sm text-white">Add Task</span>
            </a>
            
            <a 
              href="/"
              target="_blank"
              className="flex flex-col items-center p-4 bg-black-100/60 rounded-lg border border-blue-100/10 hover:bg-black-100/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-teal-600/20 flex items-center justify-center text-green-400 mb-3">
                <FaEye />
              </div>
              <span className="text-sm text-white">View Site</span>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 