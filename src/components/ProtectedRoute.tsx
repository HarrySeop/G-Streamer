import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isSignedIn } = useAuth();

  return isSignedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
