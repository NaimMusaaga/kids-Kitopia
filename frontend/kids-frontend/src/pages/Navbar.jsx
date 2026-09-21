import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaPlay, FaBook, FaGamepad, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes, FaThLarge } from 'react-icons/fa';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // نغلق القائمة عند الضغط على أي رابط أو زر داخلها
  const closeOnAction = (e) => { if (e.target.closest('a, button')) setOpen(false); };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

  return (
    <header className="kids-navbar">
      <div className="nav-container container">
        <Link to="/" className="nav-logo" aria-label={t('nav.home')}>
          <span className="logo-mark">K</span>
          <span>Kitopia</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? t('nav.menuClose') : t('nav.menuOpen')}
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-menu${open ? ' open' : ''}`} onClick={closeOnAction}>
          <div className="nav-links">
            <NavLink to="/videos" className={linkClass}><FaPlay /> {t('nav.videos')}</NavLink>
            <NavLink to="/stories" className={linkClass}><FaBook /> {t('nav.stories')}</NavLink>
            <NavLink to="/games" className={linkClass}><FaGamepad /> {t('nav.games')}</NavLink>
          </div>

          <div className="nav-auth">
            <LanguageSwitcher />
            {user ? (
              <>
                <span className="nav-hello">{t('nav.hello', { name: user.name })}</span>
                {isAdmin && <Link to="/dashboard" className="auth-item"><FaThLarge /> {t('nav.panel')}</Link>}
                <button className="auth-item" onClick={handleLogout}><FaSignOutAlt /> {t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-item"><FaSignInAlt /> {t('nav.login')}</Link>
                <Link to="/register" className="auth-item signup"><FaUserPlus /> {t('nav.register')}</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
