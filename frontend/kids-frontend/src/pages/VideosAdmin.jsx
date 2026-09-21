import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaVideo, FaFolder, FaChild, FaTrashAlt, FaCloudUploadAlt, FaListUl, FaYoutube, FaLink } from 'react-icons/fa';
import api from '../api';
import { getThumbnail, getYouTubeId } from '../utils/media';

const EMPTY_FORM = { title: '', url: '', category_id: '', age_group_id: '' };

export default function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [meta, setMeta] = useState({ categories: [], ageGroups: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newVideo, setNewVideo] = useState(EMPTY_FORM);
  const [sourceType, setSourceType] = useState('link'); // link | file
  const [videoFile, setVideoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    api.get('/api/videos/all')
      .then((res) => setVideos(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Veri hatası:', err))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  useEffect(() => {
    api.get('/api/videos/meta').then((res) => setMeta(res.data)).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newVideo.title);
    formData.append('category_id', newVideo.category_id);
    formData.append('age_group_id', newVideo.age_group_id);
    if (sourceType === 'file' && videoFile) formData.append('videoFile', videoFile);
    else formData.append('url', newVideo.url);

    setSaving(true);
    try {
      await api.post('/api/videos', formData);
      setNewVideo(EMPTY_FORM);
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Yükleme başarısız!');
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/api/videos/${id}`);
      reload();
    } catch {
      alert('Silme hatası!');
    }
  };

  const nameOf = (list, id) => list.find((x) => x.id === id)?.name;
  const previewId = getYouTubeId(newVideo.url);

  return (
    <div>
      <div className="admin-header">
        <h1><FaVideo /> Video Yönetimi</h1>
        <p>YouTube bağlantısı ekleyin: video sitede doğrudan oynatılır, izleyici YouTube'a gitmez.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaPlus /> <span>Yeni Video Ekle</span></div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaVideo /> Video Başlığı</label>
              <input
                placeholder="Örn: Renkleri Öğreniyoruz"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                required
              />
            </div>

            <div className="source-toggle" role="tablist">
              <button type="button" className={sourceType === 'link' ? 'on' : ''} onClick={() => setSourceType('link')}><FaYoutube /> YouTube bağlantısı</button>
              <button type="button" className={sourceType === 'file' ? 'on' : ''} onClick={() => setSourceType('file')}><FaCloudUploadAlt /> Dosya yükle</button>
            </div>

            {sourceType === 'link' ? (
              <div className="form-group">
                <label><FaLink /> Video Bağlantısı</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  required
                />
                {previewId && (
                  <div className="link-preview">
                    <img src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="" />
                    <span>Bağlantı tanındı ✓</span>
                  </div>
                )}
                <p className="form-hint">YouTube Studio'da videonun "Yerleştirmeye izin ver" seçeneği açık olmalı.</p>
              </div>
            ) : (
              <div className="form-group">
                <label><FaCloudUploadAlt /> Video Dosyası</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  ref={fileInputRef}
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label><FaFolder /> Kategori</label>
                <select value={newVideo.category_id} onChange={(e) => setNewVideo({ ...newVideo, category_id: e.target.value })}>
                  <option value="">Seçiniz</option>
                  {meta.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FaChild /> Yaş Grubu</label>
                <select value={newVideo.age_group_id} onChange={(e) => setNewVideo({ ...newVideo, age_group_id: e.target.value })}>
                  <option value="">Seçiniz</option>
                  {meta.ageGroups.map((g) => <option key={g.id} value={g.id}>{g.name} ({g.min_age}-{g.max_age})</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="admin-btn primary" disabled={saving}>
              <FaCloudUploadAlt /> {saving ? 'Kaydediliyor...' : 'Videoyu Ekle'}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header"><FaListUl /> <span>Mevcut Videolar ({videos.length})</span></div>
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">Yükleniyor...</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Video</th>
                    <th>Kategori / Yaş</th>
                    <th className="text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length > 0 ? videos.map((video) => {
                    const thumb = getThumbnail(video);
                    return (
                      <tr key={video.id}>
                        <td>
                          <div className="row-thumb">
                            {thumb ? <img src={thumb} alt="" loading="lazy" /> : <span className="row-thumb-fallback">🎬</span>}
                            <span className="video-name">{video.title}</span>
                          </div>
                        </td>
                        <td className="cell-muted">
                          {nameOf(meta.categories, video.category_id) || '—'} / {nameOf(meta.ageGroups, video.age_group_id) || '—'}
                        </td>
                        <td className="text-center">
                          <button onClick={() => deleteVideo(video.id)} className="admin-btn danger-sm">
                            <FaTrashAlt /> Sil
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="3" className="empty-row">Henüz video eklenmemiş.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
