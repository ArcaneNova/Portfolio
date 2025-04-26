import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import UnauthorizedPage from './pages/admin/UnauthorizedPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ProjectsListPage from './pages/admin/projects/ProjectsListPage';
import MyJourney from './pages/MyJourney';

// Create the router with all routes
const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <App />
  },
  {
    path: '/journey',
    element: <MyJourney />
  },
  
  // Admin routes
  {
    path: '/admin/login',
    element: <LoginPage />
  },
  {
    path: '/admin/unauthorized',
    element: <UnauthorizedPage />
  },
  {
    path: '/admin',
    element: <ProtectedRoute element={<DashboardPage />} adminOnly={true} />
  },
  
  // Admin - Projects management
  {
    path: '/admin/projects',
    element: <ProtectedRoute element={<ProjectsListPage />} adminOnly={true} />
  },
  {
    path: '/admin/projects/new',
    element: <ProtectedRoute element={<div>New Project (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/projects/:id',
    element: <ProtectedRoute element={<div>Edit Project (Coming Soon)</div>} adminOnly={true} />
  },
  
  // Admin - Blogs management
  {
    path: '/admin/blogs',
    element: <ProtectedRoute element={<div>Blogs List (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/blogs/new',
    element: <ProtectedRoute element={<div>New Blog (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/blogs/:id',
    element: <ProtectedRoute element={<div>Edit Blog (Coming Soon)</div>} adminOnly={true} />
  },
  
  // Admin - Tasks management
  {
    path: '/admin/tasks',
    element: <ProtectedRoute element={<div>Tasks List (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/tasks/new',
    element: <ProtectedRoute element={<div>New Task (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/tasks/:id',
    element: <ProtectedRoute element={<div>Edit Task (Coming Soon)</div>} adminOnly={true} />
  },
  
  // Admin - Motivations management
  {
    path: '/admin/motivations',
    element: <ProtectedRoute element={<div>Motivations List (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/motivations/new',
    element: <ProtectedRoute element={<div>New Motivation (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/motivations/:id',
    element: <ProtectedRoute element={<div>Edit Motivation (Coming Soon)</div>} adminOnly={true} />
  },
  
  // Admin - Build In Public management
  {
    path: '/admin/build-in-public',
    element: <ProtectedRoute element={<div>Build In Public List (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/build-in-public/new',
    element: <ProtectedRoute element={<div>New Build In Public (Coming Soon)</div>} adminOnly={true} />
  },
  {
    path: '/admin/build-in-public/:id',
    element: <ProtectedRoute element={<div>Edit Build In Public (Coming Soon)</div>} adminOnly={true} />
  },
  
  // Catch-all route for 404s
  {
    path: '*',
    element: <div>404 Page Not Found</div>
  }
]);

export default router; 