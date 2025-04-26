import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { 
  FaHome, FaProjectDiagram, FaBlog, FaTasks, 
  FaLightbulb, FaToolbox, FaSignOutAlt, FaBars,
  FaTimes, FaUser, FaBell, FaCog, FaSearch,
  FaMoon, FaSun, FaChevronDown
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New project created', time: '2 hours ago', read: false },
    { id: 2, text: 'Task deadline approaching', time: '5 hours ago', read: false },
    { id: 3, text: 'Blog post published', time: 'Yesterday', read: true }
  ]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram size={18} /> },
    { name: 'Blog Posts', path: '/admin/blogs', icon: <FaBlog size={18} /> },
    { name: 'Tasks', path: '/admin/tasks', icon: <FaTasks size={18} /> },
    { name: 'Motivations', path: '/admin/motivations', icon: <FaLightbulb size={18} /> },
    { name: 'Build In Public', path: '/admin/build-in-public', icon: <FaToolbox size={18} /> },
  ];

  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd update CSS variables or classes here
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
      setNotificationDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Background and text colors based on theme
  const themeClasses = darkMode 
    ? {
        bg: 'bg-gray-900',
        sidebar: 'bg-gray-800',
        text: 'text-white',
        secondaryText: 'text-gray-300',
        border: 'border-gray-700',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        buttonText: 'text-white',
        card: 'bg-gray-800',
        cardHover: 'hover:bg-gray-700',
        input: 'bg-gray-700 text-white',
        navActive: 'bg-indigo-800 text-white',
        navInactive: 'text-gray-400 hover:text-gray-100 hover:bg-gray-700',
      }
    : {
        bg: 'bg-gray-100',
        sidebar: 'bg-white',
        text: 'text-gray-800',
        secondaryText: 'text-gray-600',
        border: 'border-gray-200',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        buttonText: 'text-white',
        card: 'bg-white',
        cardHover: 'hover:bg-gray-50',
        input: 'bg-gray-100 text-gray-800',
        navActive: 'bg-indigo-100 text-indigo-800',
        navInactive: 'text-gray-500 hover:text-gray-900 hover:bg-gray-200',
      };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} flex flex-col lg:flex-row transition-colors duration-200 relative`}>
      {/* Mobile sidebar toggle */}
      <button 
        className={`lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-md ${themeClasses.card} text-indigo-500`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 inset-y-0 left-0 w-72 h-screen ${themeClasses.sidebar} border-r ${themeClasses.border} transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-lg overflow-hidden`}
      >
        {/* Logo/Title */}
        <div className={`p-6 border-b ${themeClasses.border}`}>
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-500">Portfolio</span> <span className={themeClasses.text}>Admin</span>
          </h1>
        </div>
        
        {/* User info */}
        <div className={`p-5 flex items-center border-b ${themeClasses.border}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUser size={20} />
            )}
          </div>
          <div className="ml-4">
            <p className="text-base font-medium">{user?.username || 'Admin User'}</p>
            <p className="text-sm text-gray-400">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-4 py-4">
          <div className={`flex items-center px-3 py-2 rounded-lg ${themeClasses.input} ${themeClasses.border}`}>
            <FaSearch className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full bg-transparent border-none focus:outline-none ${themeClasses.text} text-sm`}
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-4 py-2 text-xs uppercase font-semibold text-gray-400">Main</div>
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? `${themeClasses.navActive} font-medium`
                        : `${themeClasses.navInactive}`
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="px-4 py-2 mt-6 text-xs uppercase font-semibold text-gray-400">Settings</div>
          <ul className="space-y-1 px-3">
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? `${themeClasses.navActive} font-medium`
                      : `${themeClasses.navInactive}`
                  }`
                }
              >
                <span className="mr-3"><FaCog size={18} /></span>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Theme Toggle & Logout */}
        <div className={`p-4 border-t ${themeClasses.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${themeClasses.secondaryText}`}>Theme</span>
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 ${themeClasses.cardHover}`}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-600" />}
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${themeClasses.navInactive}`}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className={`${themeClasses.card} border-b ${themeClasses.border} p-4 flex justify-between items-center shadow-sm`}>
            <h2 className="text-xl font-semibold ml-2 lg:ml-0 pl-8 lg:pl-0">
              {navItems.find(item => 
                item.path === location.pathname || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path))
              )?.name || 'Dashboard'}
            </h2>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className={`p-2 rounded-full relative ${themeClasses.cardHover}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                >
                  <FaBell />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {notificationDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-80 ${themeClasses.card} rounded-lg shadow-lg border ${themeClasses.border} z-50 py-2`}>
                    <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button className="text-xs text-indigo-500 hover:text-indigo-400">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 ${notification.read ? '' : 'bg-indigo-900/10'} hover:bg-gray-700/30 border-b border-gray-700/50`}
                          >
                            <div className="flex justify-between items-start">
                              <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>{notification.text}</p>
                              {!notification.read && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1"></span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-gray-500">No notifications</p>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-700">
                      <button className="text-xs text-indigo-500 hover:text-indigo-400 w-full text-center">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User dropdown */}
              <div className="relative">
                <button 
                  className={`flex items-center space-x-2 ${themeClasses.cardHover} rounded-lg px-3 py-2`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationDropdownOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUser size={14} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm hidden md:block">{user?.username || 'Admin'}</span>
                  <FaChevronDown size={12} className="text-gray-400" />
                </button>
                
                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${themeClasses.card} rounded-lg shadow-lg py-2 border ${themeClasses.border} z-50`}>
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium">{user?.username || 'Admin User'}</p>
                      <p className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</p>
                    </div>
                    <a href="/admin/profile" className="block px-4 py-2 text-sm hover:bg-gray-700">Profile</a>
                    <a href="/admin/settings" className="block px-4 py-2 text-sm hover:bg-gray-700">Settings</a>
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <a 
                href="/" 
                target="_blank" 
                className={`hidden md:block px-4 py-2 text-sm ${themeClasses.button} ${themeClasses.buttonText} rounded-lg shadow-sm transition-colors`}
              >
                View Site
              </a>
            </div>
          </header>
          
          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-6 pl-6 lg:pl-6">
            {children}
          </div>
          
          {/* Footer */}
          <footer className={`border-t ${themeClasses.border} py-4 px-6`}>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">© 2023 Portfolio Admin Dashboard</p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-gray-500 hover:text-indigo-500">Help</a>
                <a href="#" className="text-sm text-gray-500 hover:text-indigo-500">Privacy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-indigo-500">Terms</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout; 