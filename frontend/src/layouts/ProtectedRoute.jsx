import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-[#6D28D9] animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-600">Loading FindIt...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
