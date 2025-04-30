import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (userRole === 'admin') {
    // If admin is trying to access admin routes, allow access
    if (allowedRoles.includes('admin')) {
      return children;
    }
    // If admin is trying to access other routes, redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check if user is faculty
  if (userRole === 'faculty') {
    // If faculty is trying to access faculty routes, allow access
    if (allowedRoles.includes('faculty')) {
      return children;
    }
    // If faculty is trying to access other routes, redirect to faculty dashboard
    return <Navigate to="/faculty/dashboard" replace />;
  }

  // If role is not recognized, redirect to home
  return <Navigate to="/" replace />;
};

export default ProtectedRoute; 