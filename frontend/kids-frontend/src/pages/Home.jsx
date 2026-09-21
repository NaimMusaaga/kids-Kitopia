import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlay, FaBook, FaGamepad, FaArrowRight, FaShieldAlt, FaMobileAlt, FaSmile } from 'react-icons/fa';
import api from '../api';
import { getThumbnail } from '../utils/media';
import { useAuth } from '../context/auth-context';
import Thumb from '../components/Thumb';
import VideoModal from '../components/VideoModal';
import './Home.css';

const FEATURES = [
  { to: '/videos', icon: <FaPlay />, tone: 'brand', title: 'Videolar', desc: 'Eğlenirken öğreten, çocuklara özel seçilmiş videolar.' },
  { to: '/stories', icon: <FaBook />, tone: 'mint', title: 'Sesli Masallar', desc: 'Uyku öncesi dinlenecek sıcacık masallar.' },
  { to: '/games', icon: <FaGamepad />, tone: 'coral', title: 'Oyunlar', desc: 'Balon patlat, sayı ve renk yarışmasına katıl!' },
];

const PERKS = [
  { icon: <FaShieldAlt />, title: 'Güvenli', desc: 'Reklamsız ve çocuklara uygun içerik.' },
  { icon: <FaMobileAlt />, title: 'Her Cihazda', desc: 'Telefon, tablet ve bilgisayarda kusursuz çalışır.' },
  { icon: <FaSmile />, title: 'Eğlenceli', desc: 'Renkli, sade ve kullanımı kolay tasarım.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [latest, setLatest] = useState([]);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    api.get('/api/videos')
      .then((res) => setLatest(Array.isArray(res.data) ? res.data.slice(0, 4) : []))
      .catch(() => setLatest([]));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content container">
          <span className="hero-pill">🌈 Çocuklar için güvenli eğlence</span>
          <h1 className="hero-title">Kitopia</h1>
          <p className="hero-subtitle">Çocuğunuzla en güzel masalların, videoların ve oyunların tadını çıkarın!</p>
          <div className="hero-actions">
            <button className="btn btn-sun btn-lg" onClick={() => navigate('/videos')}><FaPlay /> Videoları İzle</button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/stories')}><FaBook /> Masalları Dinle</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <h2 className="section-title">Neler Var?</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className={`feature-card tone-${f.tone}`}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-link">Keşfet <FaArrowRight /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest videos — played right here on the site */}
      {latest.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <h2 className="section-title">Yeni Videolar</h2>
            <Link to="/videos" className="see-all">Tümünü gör <FaArrowRight /></Link>
          </div>
          <div className="card-grid">
            {latest.map((v) => (
              <button key={v.id} className="media-card" onClick={() => setPlaying(v)}>
                <div className="media-thumb">
                  <Thumb src={getThumbnail(v)} alt={v.title} />
                  <span className="play-badge"><FaPlay /></span>
                </div>
                <div className="media-body">
                  <h3 className="media-title">{v.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Perks */}
      <section className="section container">
        <div className="perk-grid">
          {PERKS.map((p) => (
            <div key={p.title} className="perk">
              <span className="perk-icon">{p.icon}</span>
              <div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="container">
          <div className="cta-box">
            <h2>Eğlence Dünyasına Katıl!</h2>
            <p>Harika masallar ve oyunlar seni bekliyor. Hemen ücretsiz kayıt ol.</p>
            <button className="btn btn-sun btn-lg" onClick={() => navigate('/register')}>Kayıt Ol</button>
          </div>
        </section>
      )}

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
