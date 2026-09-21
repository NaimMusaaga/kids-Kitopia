import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-section footer-brand">
          <div className="footer-logo">Kitopia</div>
          <p>Çocukların hayal dünyasına açılan güvenli kapı: videolar, sesli masallar ve oyunlar.</p>
        </div>

        <div className="footer-section">
          <h4>Keşfet</h4>
          <Link to="/videos">Videolar</Link>
          <Link to="/stories">Masallar</Link>
          <Link to="/games">Oyunlar</Link>
        </div>

        <div className="footer-section">
          <h4>Hesap</h4>
          <Link to="/login">Giriş Yap</Link>
          <Link to="/register">Kayıt Ol</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kitopia · Tüm hakları saklıdır · <FaHeart color="#ff6b6b" aria-label="sevgi" /> ile yapıldı</p>
      </div>
    </footer>
  );
}
