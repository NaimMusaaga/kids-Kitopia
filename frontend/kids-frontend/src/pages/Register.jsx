import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Harika! Ailemize katıldın. 🌈');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Bir sorun oluştu, tekrar dener misin? 🤖');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <span className="form-emoji">🎨</span>
        <h2>Yeni Hesap Aç</h2>
        
        <div className="input-group">
          <input name="name" type="text" className="input-field" placeholder="Adın Nedir? 😊" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="email" type="email" className="input-field" placeholder="E-posta Adresin 📧" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="password" type="password" className="input-field" placeholder="Güçlü Bir Şifre 🔑" onChange={handleChange} required />
        </div>
        
        <button type="submit" className="submit-btn">Maceraya Başla! 🚀</button>
        
        <p className="footer-link">
          Zaten üye misin? <Link to="/login">Giriş Yap</Link>
        </p>

        {message && <p style={{color: 'white', marginTop: '15px', fontWeight: 'bold'}}>{message}</p>}
      </form>
    </div>
  );
}