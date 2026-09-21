import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FaThLarge, FaVideo, FaBookOpen, FaUsers, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/auth-context';
import './Dashboard.css';

const MENU = [
  { path: '/dashboard', label: 'Genel Bakış', icon: <FaChartLine />, end: true },
  { path: '/dashboard/videos', label: 'Videolar', icon: <FaVideo /> },
  { path: '/dashboard/stories', label: 'Masallar', icon: <FaBookOpen /> },
  { path: '/dashboard/users', label: 'Kullanıcılar', icon: <FaUsers /> },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <FaThLarge className="header-icon" />
          <span>Kitopia Panel</span>
        </div>
        <nav className="sidebar-nav" aria-label="Yönetim menüsü">
          <ul>
            {MENU.map((item) => (
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
          <h2>Yönetim Paneli</h2>
          <div className="header-actions">
            <span className="header-user">{user?.name}</span>
            <Link to="/" className="back-home">Siteye Dön</Link>
            <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Çıkış</button>
          </div>
        </header>
        <div className="inner-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
