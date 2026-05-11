import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setMessage('Hoş geldin! Sihirli kapı açılıyor... 🗝️');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage('Hoppala! Bilgilerinde bir hata var. 🧐');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <span className="form-emoji">👋</span>
        <h2>Giriş Yap</h2>
        <div className="input-group">
          <input name="email" type="email" className="input-field" placeholder="E-posta Adresin 📧" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="password" type="password" className="input-field" placeholder="Gizli Şifren 🔑" onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Dünyama Gir ✨</button>
        
        <p className="footer-link">
          Henüz hesabın yok mu? <Link to="/register">Hemen Kayıt Ol!</Link>
        </p>

        {message && <p style={{color: 'white', marginTop: '15px', fontWeight: 'bold'}}>{message}</p>}
      </form>
    </div>
  );
}