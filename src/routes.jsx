import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Public pages
import App from './App';

// Auth-related pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectsListPage from './pages/admin/projects/ProjectsListPage';
import ProjectCreatePage from './pages/admin/ProjectCreatePage';
import ProjectEditPage from './pages/admin/ProjectEditPage';

// Blog pages
import BlogsPage from './pages/admin/BlogsPage';
import BlogCreatePage from './pages/admin/BlogCreatePage';
import BlogEditPage from './pages/admin/BlogEditPage';

// Auth utils
import ProtectedRoute from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin/projects',
    element: <ProtectedRoute><ProjectsListPage /></ProtectedRoute>,
  },
  {
    path: '/admin/projects/create',
    element: <ProtectedRoute><ProjectCreatePage /></ProtectedRoute>,
  },
  {
    path: '/admin/projects/:id/edit',
    element: <ProtectedRoute><ProjectEditPage /></ProtectedRoute>,
  },
  {
    path: '/admin/blogs',
    element: <ProtectedRoute><BlogsPage /></ProtectedRoute>,
  },
  {
    path: '/admin/blogs/new',
    element: <ProtectedRoute><BlogCreatePage /></ProtectedRoute>,
  },
  {
    path: '/admin/blogs/edit/:id',
    element: <ProtectedRoute><BlogEditPage /></ProtectedRoute>,
  }
]);

export default router; 