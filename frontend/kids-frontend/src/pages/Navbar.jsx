import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlay, FaBook, FaGamepad, FaLock, FaUserPlus } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="kids-navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
           Kitopia
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-item"><FaHome /> Ana Sayfa</Link>
          <Link to="/videos" className="nav-item"><FaPlay /> Videolar</Link>
          <Link to="/stories" className="nav-item"><FaBook /> Hikayeler</Link>
          {/* الرابط المعدل للعبة */}
          <Link to="/balloon-game" className="nav-item"><FaGamepad /> Oyunlar</Link>
        </div>

        <div className="nav-auth">
          <Link to="/login" className="auth-item"><FaLock /> Giriş</Link>
          <Link to="/register" className="auth-item signup"><FaUserPlus /> Kayıt</Link>
        </div>
      </div>
    </nav>
  );
}