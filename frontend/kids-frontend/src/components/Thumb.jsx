import { useState } from 'react';

// صورة مصغرة مع بديل جميل إذا لم تتوفر الصورة أو فشل تحميلها
export default function Thumb({ src, alt, emoji = '🎬' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="thumb-fallback" role="img" aria-label={alt}>{emoji}</div>;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
