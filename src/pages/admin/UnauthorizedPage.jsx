import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth.jsx';

const UnauthorizedPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-200 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 text-red-500 flex justify-center">
          <FaExclamationTriangle size={64} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Unauthorized Access</h1>
        <p className="text-blue-100/70 mb-8">
          You don't have the necessary permissions to access this area. 
          This section is restricted to administrators only.
        </p>
        
        <div className="space-y-4">
          <a
            href="/"
            className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-blue-100/20 rounded-md text-white font-medium transition-colors hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-600/30"
          >
            <span className="flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Return to Homepage
            </span>
          </a>
          
          <button
            onClick={handleLogout}
            className="block w-full py-3 px-4 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 font-medium transition-colors hover:bg-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 