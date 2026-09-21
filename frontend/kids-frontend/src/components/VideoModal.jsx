import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getVideoSource } from '../utils/media';
import { useLanguage } from '../i18n/language-context';
import './VideoModal.css';

// يعرض الفيديو داخل الموقع: يوتيوب مدمج (بدون مغادرة الصفحة) أو ملف مرفوع
export default function VideoModal({ video, onClose }) {
  const { t } = useLanguage();
  const closeRef = useRef(null);
  const source = getVideoSource(video);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="vm-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="vm-dialog" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="vm-close" onClick={onClose} aria-label={t('modal.close')}>
          <FaTimes />
        </button>

        <div className="vm-player">
          {source.kind === 'youtube' && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
          {source.kind === 'file' && (
            <video src={source.src} controls autoPlay playsInline />
          )}
          {(source.kind === 'external' || source.kind === 'none') && (
            <div className="vm-unavailable">{t('modal.unavailable')}</div>
          )}
        </div>

        <h3 className="vm-title">{video.title}</h3>
      </div>
    </div>
  );
}
