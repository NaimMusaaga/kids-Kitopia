import { FaPlay } from 'react-icons/fa';
import { getThumbnail } from '../utils/media';
import { useLanguage } from '../i18n/language-context';
import Thumb from './Thumb';

// بطاقة فيديو: الضغط عليها يفتح المشغّل داخل الموقع
export default function VideoCard({ video, onPlay, showHint = false }) {
  const { t } = useLanguage();

  return (
    <button className="media-card" onClick={() => onPlay(video)} aria-label={t('videos.play', { title: video.title })}>
      <div className="media-thumb">
        <Thumb src={getThumbnail(video)} alt={video.title} />
        <span className="play-badge"><FaPlay /></span>
      </div>
      <div className="media-body">
        <h3 className="media-title">{video.title}</h3>
        {showHint && <p className="media-meta">{t('videos.watchNow')}</p>}
      </div>
    </button>
  );
}
