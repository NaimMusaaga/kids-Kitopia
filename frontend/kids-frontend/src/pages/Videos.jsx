import { useEffect, useMemo, useState } from 'react';
import { FaPlay, FaSearch } from 'react-icons/fa';
import api from '../api';
import { getThumbnail } from '../utils/media';
import Thumb from '../components/Thumb';
import VideoModal from '../components/VideoModal';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    api.get('/api/videos')
      .then((res) => setVideos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return q ? videos.filter((v) => v.title?.toLocaleLowerCase('tr').includes(q)) : videos;
  }, [videos, query]);

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>🎬 Sihirli Çocuk Sineması</h1>
          <p>İzle, öğren ve eğlen. Videolar doğrudan burada oynatılır.</p>
        </div>
      </section>

      <div className="container page-body">
        <label className="search-bar">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            placeholder="Video ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Video ara"
          />
        </label>

        {loading && (
          <div className="state-box"><div className="spinner" />En güzel videolar hazırlanıyor...</div>
        )}

        {!loading && error && (
          <div className="state-box"><span className="state-emoji">😕</span>Videolar yüklenemedi. Lütfen daha sonra tekrar dene.</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-box"><span className="state-emoji">🔍</span>{query ? 'Aramanla eşleşen video bulunamadı.' : 'Henüz video eklenmemiş.'}</div>
        )}

        <div className="card-grid">
          {filtered.map((video) => (
            <button key={video.id} className="media-card" onClick={() => setPlaying(video)} aria-label={`${video.title} videosunu oynat`}>
              <div className="media-thumb">
                <Thumb src={getThumbnail(video)} alt={video.title} />
                <span className="play-badge"><FaPlay /></span>
              </div>
              <div className="media-body">
                <h3 className="media-title">{video.title}</h3>
                <p className="media-meta">Şimdi izle</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
