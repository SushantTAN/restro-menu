import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If trying to access /admin/login and already authenticated, redirect to dashboard
  if (isAuthenticated && location.pathname === '/admin/login') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If not authenticated and trying to access any admin page (except login), redirect to login
  if (!isAuthenticated && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the children (or Outlet for nested routes)
  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
