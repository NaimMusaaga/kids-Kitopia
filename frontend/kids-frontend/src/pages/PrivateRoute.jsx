import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem('role'); // نفترض أنك خزنت الـ role عند تسجيل الدخول
  
  if (userRole !== role) {
    return <Navigate to="/login" />;
  }
  return children;
}