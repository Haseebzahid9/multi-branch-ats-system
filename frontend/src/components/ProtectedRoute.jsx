import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="loading-full">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );

  if (!user) return <Navigate to="/signin" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'candidate' ? '/dashboard' : '/admin'} replace />;
  }

  return children;
}
