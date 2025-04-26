import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black-200">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-cyan-500 font-mono">Authenticating...</span>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  // Check if admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/unauthorized" />;
  }

  // Render the protected component
  return element;
};

export default ProtectedRoute; 