import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaVideo, FaFolder, FaChild, FaTrashAlt, FaCloudUploadAlt, FaListUl, FaYoutube, FaLink } from 'react-icons/fa';
import api from '../api';
import { getThumbnail, getYouTubeId } from '../utils/media';
import { useLanguage } from '../i18n/language-context';
import { useFeedback } from '../context/feedback-context';
import useSelection from '../hooks/useSelection';
import useDeleteAction from '../hooks/useDeleteAction';
import BulkBar from '../components/BulkBar';

const EMPTY_FORM = { title: '', url: '', category_id: '', age_group_id: '' };

export default function VideosAdmin() {
  const { t } = useLanguage();
  const { toast } = useFeedback();
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
      .catch((err) => console.error('Videos error:', err))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  useEffect(() => {
    api.get('/api/videos/meta').then((res) => setMeta(res.data)).catch(() => {});
  }, []);

  const selection = useSelection(videos);
  const remove = useDeleteAction('/api/videos', () => { selection.clear(); reload(); });

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
      toast(t('vadmin.added'));
      reload();
    } catch (err) {
      toast(err.response?.status === 403 ? t('admin.forbidden') : t('vadmin.addFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const nameOf = (list, id) => list.find((x) => x.id === id)?.name;
  const previewId = getYouTubeId(newVideo.url);

  return (
    <div>
      <div className="admin-header">
        <h1><FaVideo /> {t('vadmin.title')}</h1>
        <p>{t('vadmin.subtitle')}</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaPlus /> <span>{t('vadmin.addNew')}</span></div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaVideo /> {t('vadmin.videoTitle')}</label>
              <input
                placeholder={t('vadmin.titlePh')}
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                required
              />
            </div>

            <div className="source-toggle" role="tablist">
              <button type="button" className={sourceType === 'link' ? 'on' : ''} onClick={() => setSourceType('link')}><FaYoutube /> {t('vadmin.ytTab')}</button>
              <button type="button" className={sourceType === 'file' ? 'on' : ''} onClick={() => setSourceType('file')}><FaCloudUploadAlt /> {t('vadmin.fileTab')}</button>
            </div>

            {sourceType === 'link' ? (
              <div className="form-group">
                <label><FaLink /> {t('vadmin.link')}</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  required
                />
                {previewId && (
                  <div className="link-preview">
                    <img src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="" />
                    <span>{t('vadmin.recognized')}</span>
                  </div>
                )}
                <p className="form-hint">{t('vadmin.hint')}</p>
              </div>
            ) : (
              <div className="form-group">
                <label><FaCloudUploadAlt /> {t('vadmin.file')}</label>
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
                <label><FaFolder /> {t('vadmin.category')}</label>
                <select value={newVideo.category_id} onChange={(e) => setNewVideo({ ...newVideo, category_id: e.target.value })}>
                  <option value="">{t('vadmin.choose')}</option>
                  {meta.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FaChild /> {t('vadmin.ageGroup')}</label>
                <select value={newVideo.age_group_id} onChange={(e) => setNewVideo({ ...newVideo, age_group_id: e.target.value })}>
                  <option value="">{t('vadmin.choose')}</option>
                  {meta.ageGroups.map((g) => <option key={g.id} value={g.id}>{g.name} ({g.min_age}-{g.max_age})</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="admin-btn primary" disabled={saving}>
              <FaCloudUploadAlt /> {saving ? t('vadmin.adding') : t('vadmin.add')}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header"><FaListUl /> <span>{t('vadmin.list', { n: videos.length })}</span></div>
          <BulkBar count={selection.selected.length} onDelete={() => remove(selection.selected)} />
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">{t('admin.loading')}</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th className="check-col">
                      <input type="checkbox" checked={selection.allSelected} onChange={selection.toggleAll} aria-label={t('admin.selectAll')} />
                    </th>
                    <th>{t('vadmin.colVideo')}</th>
                    <th>{t('vadmin.colMeta')}</th>
                    <th className="text-center">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length > 0 ? videos.map((video) => {
                    const thumb = getThumbnail(video);
                    return (
                      <tr key={video.id} className={selection.isSelected(video.id) ? 'row-selected' : ''}>
                        <td className="check-col">
                          <input type="checkbox" checked={selection.isSelected(video.id)} onChange={() => selection.toggle(video.id)} aria-label={t('admin.selectRow')} />
                        </td>
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
                          <button onClick={() => remove([video.id])} className="admin-btn danger-sm">
                            <FaTrashAlt /> {t('admin.delete')}
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="4" className="empty-row">{t('vadmin.empty')}</td></tr>
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
