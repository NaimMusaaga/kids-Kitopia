import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import './Auth.css';

export default function Login() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const { data } = await api.post('/api/auth/login', formData);
      login(data);
      setMessage({ type: 'success', text: t('auth.welcome') });
      setTimeout(() => navigate(data.user.role === 'admin' ? '/dashboard' : '/'), 800);
    } catch (error) {
      const status = error.response?.status;
      setMessage({ type: 'error', text: status === 401 ? t('auth.badCreds') : t('auth.network') });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="auth-emoji">👋</span>
        <h1>{t('auth.loginTitle')}</h1>
        <p className="auth-sub">{t('auth.loginSub')}</p>

        <label className="auth-field">
          <span>{t('auth.email')}</span>
          <input name="email" type="email" dir="ltr" autoComplete="email" placeholder={t('auth.emailPh')} onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>{t('auth.password')}</span>
          <input name="password" type="password" dir="ltr" autoComplete="current-password" placeholder="••••••••" onChange={handleChange} required />
        </label>

        <button type="submit" className="btn btn-brand btn-lg auth-submit" disabled={submitting}>
          {submitting ? t('auth.loginBusy') : t('auth.loginSubmit')}
        </button>

        {message && <p className={`form-message ${message.type}`} role="status">{message.text}</p>}

        <p className="auth-switch">{t('auth.noAccount')} <Link to="/register">{t('auth.signUpNow')}</Link></p>
      </form>
    </div>
  );
}
