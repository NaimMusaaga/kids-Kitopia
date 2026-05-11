import { FaInstagram, FaFacebook, FaTwitter, FaHeart, FaTiktok } from 'react-icons/fa';
import './Footer.css';
import { CgYoutube } from 'react-icons/cg';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>KIDS WORLD</h3>
          <p>Çocukların hayal dünyasına açılan kapı.</p>
        </div>
        
        <div className="footer-section">
          <h4>Sayfalar</h4>
          <a href="/about">Hakkımızda</a>
          <a href="/contact">İletişim</a>
          <a href="/privacy">Gizlilik Politikası</a>
        </div>

        <div className="footer-section">
          <h4>Bizi Takip Edin</h4>
          <div className="social-icons">
            <FaInstagram />
            <FaFacebook />
            <CgYoutube />
            <FaTiktok />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2026 Tüm Hakları Saklıdır <FaHeart color="#ff4757" /> Kids World</p>
      </div>
    </footer>
  );
}