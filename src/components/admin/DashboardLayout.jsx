import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { 
  FaHome, FaProjectDiagram, FaBlog, FaTasks, 
  FaLightbulb, FaToolbox, FaSignOutAlt, FaBars,
  FaTimes, FaUser
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram /> },
    { name: 'Blog Posts', path: '/admin/blogs', icon: <FaBlog /> },
    { name: 'Tasks', path: '/admin/tasks', icon: <FaTasks /> },
    { name: 'Motivations', path: '/admin/motivations', icon: <FaLightbulb /> },
    { name: 'Build In Public', path: '/admin/build-in-public', icon: <FaToolbox /> },
  ];

  return (
    <div className="min-h-screen bg-black-200 text-blue-50 flex">
      {/* Mobile sidebar toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black-100/80 text-cyan-400"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-black-100 to-black-100/90 border-r border-blue-100/10 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Logo/Title */}
        <div className="p-5 border-b border-blue-100/10">
          <h1 className="text-xl font-bold text-cyan-400">
            Portfolio <span className="text-blue-100">Admin</span>
          </h1>
        </div>
        
        {/* User info */}
        <div className="p-5 flex items-center border-b border-blue-100/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.username || 'Admin User'}</p>
            <p className="text-xs text-blue-100/70">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border-l-2 border-cyan-400' 
                        : 'hover:bg-black-100 text-blue-100/70 hover:text-blue-100'
                    }`
                  }
                >
                  <span className="mr-3 text-cyan-400">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-blue-100/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-blue-100/70 hover:text-red-400 transition-colors rounded-md"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black-100/60 backdrop-blur-sm border-b border-blue-100/10 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {navItems.find(item => 
              item.path === location.pathname || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            )?.name || 'Dashboard'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              target="_blank" 
              className="px-3 py-1.5 text-sm bg-blue-100/10 hover:bg-blue-100/20 rounded-md text-blue-100 transition-colors"
            >
              View Site
            </a>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 