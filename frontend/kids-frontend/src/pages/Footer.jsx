import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/language-context';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-section footer-brand">
          <div className="footer-logo">Kitopia</div>
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="footer-section">
          <h4>{t('footer.discover')}</h4>
          <Link to="/videos">{t('nav.videos')}</Link>
          <Link to="/stories">{t('nav.stories')}</Link>
          <Link to="/games">{t('nav.games')}</Link>
        </div>

        <div className="footer-section">
          <h4>{t('footer.account')}</h4>
          <Link to="/login">{t('nav.login')}</Link>
          <Link to="/register">{t('nav.register')}</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
