import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMagic, FaHistory } from 'react-icons/fa';
import api, { recordWatch } from '../api';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import { useFeedback } from '../context/feedback-context';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import './Videos.css';

const AGES = Array.from({ length: 12 }, (_, i) => i + 1);

export default function Videos() {
  const { user, updateUser } = useAuth();
  const { t, lang } = useLanguage();
  const { toast } = useFeedback();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState(null);

  const [recs, setRecs] = useState([]);
  const [history, setHistory] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api.get('/api/videos')
      .then((res) => setVideos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // اقتراحات وسجل المشاهدة للمستخدم المسجّل فقط
  useEffect(() => {
    if (!user) return;
    api.get('/api/recommend/me').then((res) => setRecs(Array.isArray(res.data) ? res.data : [])).catch(() => setRecs([]));
    api.get('/api/videos/history').then((res) => setHistory(Array.isArray(res.data) ? res.data : [])).catch(() => setHistory([]));
  }, [user, reloadKey]);

  const play = (video) => {
    setPlaying(video);
    if (user) recordWatch(video.id).then(() => setReloadKey((k) => k + 1));
  };

  const saveAge = async (age) => {
    try {
      const { data } = await api.put('/api/users/me/age', { age });
      updateUser({ age: data.age, age_group_id: data.age_group_id });
      setReloadKey((k) => k + 1);
      toast(t('videos.ageSet'));
    } catch {
      toast(t('videos.ageFail'), 'error');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang);
    return q ? videos.filter((v) => v.title?.toLocaleLowerCase(lang).includes(q)) : videos;
  }, [videos, query, lang]);

  const searching = query.trim() !== '';

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>{t('videos.heroTitle')}</h1>
          <p>{t('videos.heroText')}</p>
        </div>
      </section>

      <div className="container page-body">
        <label className="search-bar">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            placeholder={t('videos.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('videos.search')}
          />
        </label>

        {/* ليس مسجّلاً: تلميح لطيف */}
        {!user && !searching && (
          <p className="tip-line">
            <FaMagic /> <Link to="/login">{t('videos.loginTip')}</Link>
          </p>
        )}

        {/* مسجّل ولم يحدد عمر الطفل بعد */}
        {user && !user.age_group_id && !searching && (
          <div className="age-card">
            <h3>{t('videos.ageTitle')}</h3>
            <p>{t('videos.ageText')}</p>
            <div className="age-chips">
              {AGES.map((a) => (
                <button key={a} type="button" onClick={() => saveAge(a)}>{a}</button>
              ))}
            </div>
          </div>
        )}

        {user && !searching && recs.length > 0 && (
          <section className="video-row">
            <div className="row-head">
              <h2><FaMagic /> {t('videos.forYou')}</h2>
              <span>{t('videos.forYouSub')}</span>
            </div>
            <div className="card-grid">
              {recs.slice(0, 4).map((v) => <VideoCard key={v.id} video={v} onPlay={play} />)}
            </div>
          </section>
        )}

        {user && !searching && history.length > 0 && (
          <section className="video-row">
            <div className="row-head">
              <h2><FaHistory /> {t('videos.recent')}</h2>
            </div>
            <div className="card-grid">
              {history.slice(0, 4).map((v) => <VideoCard key={v.id} video={v} onPlay={play} />)}
            </div>
          </section>
        )}

        {user && !searching && (recs.length > 0 || history.length > 0) && videos.length > 0 && (
          <div className="row-head all"><h2>{t('videos.all')}</h2></div>
        )}

        {loading && (
          <div className="state-box"><div className="spinner" />{t('videos.loading')}</div>
        )}

        {!loading && error && (
          <div className="state-box"><span className="state-emoji">😕</span>{t('videos.error')}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-box"><span className="state-emoji">🔍</span>{searching ? t('videos.emptySearch') : t('videos.empty')}</div>
        )}

        <div className="card-grid">
          {filtered.map((video) => <VideoCard key={video.id} video={video} onPlay={play} showHint />)}
        </div>
      </div>

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
