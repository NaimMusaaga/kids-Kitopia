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

  // تحديث بيانات المستخدم المحفوظة (مثل العمر بعد تعديله)
  const updateUser = useCallback((patch) => {
    setUser((current) => {
      const next = { ...current, ...patch };
      try { localStorage.setItem('user', JSON.stringify(next)); } catch { /* تجاهل */ }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch { /* تجاهل */ }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
