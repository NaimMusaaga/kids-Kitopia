import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../i18n/language-context';
import './Auth.css';

const AGES = Array.from({ length: 17 }, (_, i) => i + 1);

export default function Register() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '' });
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
      setMessage({ type: 'success', text: t('auth.registerOk') });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      const status = error.response?.status;
      const text = status === 409 ? t('auth.exists') : status === 400 ? t('auth.invalid') : t('auth.registerError');
      setMessage({ type: 'error', text });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <span className="auth-emoji">🎨</span>
        <h1>{t('auth.registerTitle')}</h1>
        <p className="auth-sub">{t('auth.registerSub')}</p>

        <label className="auth-field">
          <span>{t('auth.name')}</span>
          <input name="name" type="text" autoComplete="name" placeholder={t('auth.namePh')} onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>{t('auth.email')}</span>
          <input name="email" type="email" dir="ltr" autoComplete="email" placeholder={t('auth.emailPh')} onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>{t('auth.password')}</span>
          <input name="password" type="password" dir="ltr" autoComplete="new-password" minLength={6} placeholder={t('auth.passwordPh')} onChange={handleChange} required />
        </label>
        <label className="auth-field">
          <span>{t('auth.childAge')}</span>
          <select name="age" value={formData.age} onChange={handleChange} required>
            <option value="">{t('auth.agePick')}</option>
            {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <small>{t('auth.ageHint')}</small>
        </label>

        <button type="submit" className="btn btn-brand btn-lg auth-submit" disabled={submitting}>
          {submitting ? t('auth.registerBusy') : t('auth.registerSubmit')}
        </button>

        {message && <p className={`form-message ${message.type}`} role="status">{message.text}</p>}

        <p className="auth-switch">{t('auth.haveAccount')} <Link to="/login">{t('auth.loginLink')}</Link></p>
      </form>
    </div>
  );
}
