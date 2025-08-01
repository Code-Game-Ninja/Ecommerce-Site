import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireVendor = false }) => {
  const { isLoggedIn, isVendor, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If vendor role is required but user is not a vendor
  if (requireVendor && !isVendor()) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is logged in but trying to access login/signup pages
  if (isLoggedIn && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 