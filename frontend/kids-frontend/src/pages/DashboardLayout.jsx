import { Link, Outlet, useLocation } from 'react-router-dom';
// تم تغيير FaLayout إلى FaThLarge لأن الأولى غير موجودة
import { FaThLarge, FaVideo, FaBookOpen, FaUsers, FaChartLine } from 'react-icons/fa'; 
import './Dashboard.css';

export default function DashboardLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Genel Bakış', icon: <FaChartLine /> },
    { path: '/dashboard/videos', label: 'Video Yönetimi', icon: <FaVideo /> },
    { path: '/dashboard/stories', label: 'Masal Yönetimi', icon: <FaBookOpen /> },
    { path: '/dashboard/users', label: 'Kullanıcılar', icon: <FaUsers /> },
  ];

  return (
    <div className="dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          {/* تم تحديث اسم الأيقونة هنا أيضاً */}
          <FaThLarge className="header-icon" /> 
          <span>Panelim</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="dashboard-content">
        <header className="content-header">
          <h2>Yönetim Paneli</h2>
          <Link to="/" className="back-home">Siteye Dön</Link>
        </header>
        <div className="inner-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}