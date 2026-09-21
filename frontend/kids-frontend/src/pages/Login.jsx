import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/auth-context';
import './Auth.css';

export default function Login() {
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
      setMessage({ type: 'success', text: 'Hoş geldin! Sihirli kapı açılıyor... 🗝️' });
      setTimeout(() => navigate(data.user.role === 'admin' ? '/dashboard' : '/'), 800);
    } catch (error) {
      const status = error.response?.status;
      setMessage({
        type: 'error',
        text: status === 401 ? 'E-posta ya da şifre hatalı. 🧐' : 'Bağlantı kurulamadı, lütfen tekrar dene. 🤖',
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="auth-emoji">👋</span>
        <h1>Giriş Yap</h1>
        <p className="auth-sub">Kitopia dünyasına geri dön.</p>

        <label className="auth-field">
          <span>E-posta</span>
          <input name="email" type="email" autoComplete="email" placeholder="ornek@mail.com" onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>Şifre</span>
          <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" onChange={handleChange} required />
        </label>

        <button type="submit" className="btn btn-brand btn-lg auth-submit" disabled={submitting}>
          {submitting ? 'Giriş yapılıyor...' : 'Dünyama Gir ✨'}
        </button>

        {message && <p className={`form-message ${message.type}`} role="status">{message.text}</p>}

        <p className="auth-switch">Henüz hesabın yok mu? <Link to="/register">Hemen Kayıt Ol!</Link></p>
      </form>
    </div>
  );
}
