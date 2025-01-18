import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/contexts/AuthContext';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';
import Login from '../../pages/auth/Login';
const ProtectedRoute = ({ children }) => {
  const { user, authChecked, loading } = useAuth();

  if (loading || !authChecked) {
    return <AnimatedLoader />;
  }

  if (!user) {
    return <Login />;
  }

  if (user.role !== 'ADMIN') {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
