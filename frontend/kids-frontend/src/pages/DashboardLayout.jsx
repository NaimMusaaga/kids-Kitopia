import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FaThLarge, FaVideo, FaBookOpen, FaUsers, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Dashboard.css';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const menu = [
    { path: '/dashboard', label: t('dash.overview'), icon: <FaChartLine />, end: true },
    { path: '/dashboard/videos', label: t('dash.videos'), icon: <FaVideo /> },
    { path: '/dashboard/stories', label: t('dash.stories'), icon: <FaBookOpen /> },
    { path: '/dashboard/users', label: t('dash.users'), icon: <FaUsers /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <FaThLarge className="header-icon" />
          <span>{t('dash.brand')}</span>
        </div>
        <nav className="sidebar-nav" aria-label={t('dash.menu')}>
          <ul>
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <h2>{t('dash.title')}</h2>
          <div className="header-actions">
            <LanguageSwitcher />
            <span className="header-user">{user?.name}</span>
            <Link to="/" className="back-home">{t('dash.backToSite')}</Link>
            <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> {t('nav.logout')}</button>
          </div>
        </header>
        <div className="inner-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
