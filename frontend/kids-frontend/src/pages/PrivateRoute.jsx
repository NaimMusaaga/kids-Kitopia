import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

// هذه حماية للواجهة فقط؛ الحماية الحقيقية تتم في الباك اند (requireAdmin)
export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
