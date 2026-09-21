import { API_URL } from '../api';

const YT_REGEX = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/;

export function getYouTubeId(url) {
  const m = String(url || '').match(YT_REGEX);
  return m ? m[1] : null;
}

// يحوّل مسار من قاعدة البيانات إلى رابط كامل (يدعم \ من ويندوز)
export function resolveUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}/${String(path).replace(/\\/g, '/').replace(/^\/+/, '')}`;
}

// صور via.placeholder.com لم تعد تعمل، نعتبرها غير موجودة
const isDeadPlaceholder = (u) => !u || /via\.placeholder\.com/i.test(u);

export function getThumbnail(item) {
  if (!isDeadPlaceholder(item.thumbnail_url)) return item.thumbnail_url;
  const id = getYouTubeId(item.video_url || item.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// يحدد كيف يُعرض الفيديو: youtube (مدمج) | file (ملف مرفوع) | external
export function getVideoSource(item) {
  const link = item.video_url || item.url;
  const ytId = getYouTubeId(link);
  if (ytId) return { kind: 'youtube', id: ytId };
  if (link && /^\/?uploads[\\/]/i.test(link)) return { kind: 'file', src: resolveUrl(link) };
  if (link && /^https?:\/\//i.test(link)) return { kind: /\.(mp4|webm|ogg)(\?|$)/i.test(link) ? 'file' : 'external', src: link };
  return { kind: 'none' };
}

export function getAudioSource(story) {
  if (story.file_path) return resolveUrl(story.file_path);
  if (story.audio_path) return `${API_URL}/public/${story.audio_path}`;
  return null;
}
