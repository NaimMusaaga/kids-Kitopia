import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaSearch } from 'react-icons/fa';
import api from '../api';
import { getThumbnail } from '../utils/media';
import Thumb from '../components/Thumb';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/api/stories')
      .then((res) => setStories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return q ? stories.filter((s) => s.title?.toLocaleLowerCase('tr').includes(q)) : stories;
  }, [stories, query]);

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>📚 Sihirli Masal Dünyası</h1>
          <p>Dinle, hayal kur ve tatlı rüyalara dal.</p>
        </div>
      </section>

      <div className="container page-body">
        <label className="search-bar">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            placeholder="Masal ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Masal ara"
          />
        </label>

        {loading && (
          <div className="state-box"><div className="spinner" />En güzel masallar hazırlanıyor...</div>
        )}

        {!loading && error && (
          <div className="state-box"><span className="state-emoji">😕</span>Masallar yüklenemedi. Lütfen daha sonra tekrar dene.</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-box"><span className="state-emoji">🔍</span>{query ? 'Aramanla eşleşen masal bulunamadı.' : 'Henüz masal eklenmemiş.'}</div>
        )}

        <div className="card-grid">
          {filtered.map((story) => (
            <Link key={story.id} to={`/story/${story.id}`} className="media-card">
              <div className="media-thumb">
                <Thumb src={getThumbnail(story)} alt={story.title} emoji="📖" />
                <span className="media-tag"><FaBookOpen /> Masal</span>
              </div>
              <div className="media-body">
                <h3 className="media-title">{story.title}</h3>
                <p className="media-meta">{story.author || 'Kitopia Masalcısı'}{story.duration ? ` · ${story.duration}` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
