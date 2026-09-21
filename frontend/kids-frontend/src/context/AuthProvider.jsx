import { useState, useMemo, useCallback } from 'react';
import { AuthContext } from './auth-context';

function readStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) return user;
    // جلسة قديمة بدون بيانات مستخدم: ننظفها
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch { /* تجاهل */ }
  return null;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(({ token, user: u }) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(u));
    } catch { /* تجاهل */ }
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch { /* تجاهل */ }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
