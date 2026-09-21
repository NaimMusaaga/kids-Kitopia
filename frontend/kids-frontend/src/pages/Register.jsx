import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await api.post('/api/auth/register', formData);
      setMessage({ type: 'success', text: 'Harika! Ailemize katıldın. 🌈' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      const status = error.response?.status;
      const text = status === 409 ? 'Bu e-posta adresi zaten kayıtlı. 📧'
        : status === 400 ? 'Lütfen bilgileri kontrol et (şifre en az 6 karakter olmalı). 🔑'
        : 'Bir sorun oluştu, tekrar dener misin? 🤖';
      setMessage({ type: 'error', text });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="auth-emoji">🎨</span>
        <h1>Yeni Hesap Aç</h1>
        <p className="auth-sub">Birkaç saniyede maceraya katıl.</p>

        <label className="auth-field">
          <span>Adın</span>
          <input name="name" type="text" autoComplete="name" placeholder="Adın nedir? 😊" onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>E-posta</span>
          <input name="email" type="email" autoComplete="email" placeholder="ornek@mail.com" onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>Şifre</span>
          <input name="password" type="password" autoComplete="new-password" minLength={6} placeholder="En az 6 karakter" onChange={handleChange} required />
        </label>

        <button type="submit" className="btn btn-brand btn-lg auth-submit" disabled={submitting}>
          {submitting ? 'Kaydediliyor...' : 'Maceraya Başla! 🚀'}
        </button>

        {message && <p className={`form-message ${message.type}`} role="status">{message.text}</p>}

        <p className="auth-switch">Zaten üye misin? <Link to="/login">Giriş Yap</Link></p>
      </form>
    </div>
  );
}
