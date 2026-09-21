import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMoon, FaStar, FaBed } from 'react-icons/fa';
import api from '../api';
import { getThumbnail, getVideoSource, getAudioSource } from '../utils/media';
import './StoryDetail.css';

// نجوم الخلفية: مواضع ثابتة مشتقة من الفهرس (بدون عشوائية حتى لا تتغير عند كل رسم)
const STARS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: `${(i % 6) * 0.5}s`,
  size: `${0.7 + (i % 4) * 0.25}rem`,
}));

// key={id} يعيد تهيئة الحالة عند الانتقال بين قصتين
export default function StoryDetail() {
  const { id } = useParams();
  return <StoryView key={id} id={id} />;
}

function StoryView({ id }) {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get(`/api/stories/${id}`)
      .then((res) => { if (!cancelled) setStory(res.data); })
      .catch(() => { if (!cancelled) setStory(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <div className="dream-state">
      <FaMoon className="spinning-moon" />
      <span>Tatlı rüyalar hazırlanıyor...</span>
    </div>
  );

  if (!story) return (
    <div className="dream-state">
      <FaStar />
      <span>Hoppala! Bu masal uykuya dalmış galiba. Bulamadık.</span>
      <Link to="/stories" className="btn btn-sun">Masallara Dön</Link>
    </div>
  );

  const cover = getThumbnail(story);
  const audioSrc = getAudioSource(story);
  const video = getVideoSource(story);
  const text = story.content || story.description;

  return (
    <div className="story-sleep-wrapper">
      {STARS.map((s, i) => (
        <span key={i} className="dream-star" style={{ left: s.left, top: s.top, animationDelay: s.delay, fontSize: s.size }} aria-hidden="true">★</span>
      ))}

      <div className="container story-inner">
        <Link to="/stories" className="back-to-dreams-btn"><FaArrowLeft /> Masal Diyarına Dön</Link>

        <article className="story-sleep-card">
          <header className={`sleep-header${cover ? '' : ' no-cover'}`}>
            {cover && <img src={cover} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
            <div className="sleep-overlay-title">
              <h1>{story.title}</h1>
              <p className="story-author"><FaBed /> {story.author || 'Kitopia Masalcısı'}</p>
            </div>
          </header>

          <div className="sleep-content-section">
            {video.kind === 'youtube' && (
              <div className="story-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`}
                  title={story.title}
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            )}

            {audioSrc && (
              <div className="dream-audio-container">
                <h3><FaMoon /> Masalı Dinle ve Uyu</h3>
                <audio controls preload="none" className="sleep-audio-player" src={audioSrc}>
                  Tarayıcınız ses oynatmayı desteklemiyor.
                </audio>
              </div>
            )}

            <p className="story-text-body">
              {text || 'Bu masalın sözleri yıldızlara uçmuş! Çok yakında geri dönecekler.'}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
