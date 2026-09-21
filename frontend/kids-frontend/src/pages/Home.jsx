import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlay, FaBook, FaGamepad, FaArrowRight, FaShieldAlt, FaMobileAlt, FaSmile } from 'react-icons/fa';
import api, { recordWatch } from '../api';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [latest, setLatest] = useState([]);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    api.get('/api/videos')
      .then((res) => setLatest(Array.isArray(res.data) ? res.data.slice(0, 4) : []))
      .catch(() => setLatest([]));
  }, []);

  const play = (video) => {
    setPlaying(video);
    if (user) recordWatch(video.id);
  };

  const features = [
    { to: '/videos', icon: <FaPlay />, tone: 'brand', title: t('nav.videos'), desc: t('home.videosDesc') },
    { to: '/stories', icon: <FaBook />, tone: 'mint', title: t('home.storiesTitle'), desc: t('home.storiesDesc') },
    { to: '/games', icon: <FaGamepad />, tone: 'coral', title: t('nav.games'), desc: t('home.gamesDesc') },
  ];

  const perks = [
    { icon: <FaShieldAlt />, title: t('home.perkSafeTitle'), desc: t('home.perkSafeDesc') },
    { icon: <FaMobileAlt />, title: t('home.perkDeviceTitle'), desc: t('home.perkDeviceDesc') },
    { icon: <FaSmile />, title: t('home.perkFunTitle'), desc: t('home.perkFunDesc') },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content container">
          <span className="hero-pill">{t('home.pill')}</span>
          <h1 className="hero-title">Kitopia</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <div className="hero-actions">
            <button className="btn btn-sun btn-lg" onClick={() => navigate('/videos')}><FaPlay /> {t('home.watch')}</button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/stories')}><FaBook /> {t('home.listen')}</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <h2 className="section-title">{t('home.whatsInside')}</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className={`feature-card tone-${f.tone}`}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-link">{t('home.explore')} <FaArrowRight className="flip-rtl" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest videos — played right here on the site */}
      {latest.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <h2 className="section-title">{t('home.latest')}</h2>
            <Link to="/videos" className="see-all">{t('home.seeAll')} <FaArrowRight className="flip-rtl" /></Link>
          </div>
          <div className="card-grid">
            {latest.map((v) => <VideoCard key={v.id} video={v} onPlay={play} />)}
          </div>
        </section>
      )}

      {/* Perks */}
      <section className="section container">
        <div className="perk-grid">
          {perks.map((p) => (
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
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaText')}</p>
            <button className="btn btn-sun btn-lg" onClick={() => navigate('/register')}>{t('nav.register')}</button>
          </div>
        </section>
      )}

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
