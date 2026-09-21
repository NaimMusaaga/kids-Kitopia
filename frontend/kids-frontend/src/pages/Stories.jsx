import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaSearch } from 'react-icons/fa';
import api from '../api';
import { getThumbnail } from '../utils/media';
import { useLanguage } from '../i18n/language-context';
import Thumb from '../components/Thumb';

export default function Stories() {
  const { t, lang } = useLanguage();
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
    const q = query.trim().toLocaleLowerCase(lang);
    return q ? stories.filter((s) => s.title?.toLocaleLowerCase(lang).includes(q)) : stories;
  }, [stories, query, lang]);

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>{t('stories.heroTitle')}</h1>
          <p>{t('stories.heroText')}</p>
        </div>
      </section>

      <div className="container page-body">
        <label className="search-bar">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            placeholder={t('stories.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('stories.search')}
          />
        </label>

        {loading && (
          <div className="state-box"><div className="spinner" />{t('stories.loading')}</div>
        )}

        {!loading && error && (
          <div className="state-box"><span className="state-emoji">😕</span>{t('stories.error')}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-box"><span className="state-emoji">🔍</span>{query.trim() ? t('stories.emptySearch') : t('stories.empty')}</div>
        )}

        <div className="card-grid">
          {filtered.map((story) => (
            <Link key={story.id} to={`/story/${story.id}`} className="media-card">
              <div className="media-thumb">
                <Thumb src={getThumbnail(story)} alt={story.title} emoji="📖" />
                <span className="media-tag"><FaBookOpen /> {t('stories.tag')}</span>
              </div>
              <div className="media-body">
                <h3 className="media-title">{story.title}</h3>
                <p className="media-meta">{story.author || t('stories.author')}{story.duration ? ` · ${story.duration}` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
