import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaBook, FaPen, FaMicrophone, FaTrashAlt, FaListUl, FaCloudUploadAlt } from 'react-icons/fa';
import api from '../api';
import { useLanguage } from '../i18n/language-context';
import { useFeedback } from '../context/feedback-context';
import useSelection from '../hooks/useSelection';
import useDeleteAction from '../hooks/useDeleteAction';
import BulkBar from '../components/BulkBar';

export default function StoriesAdmin() {
  const { t } = useLanguage();
  const { toast } = useFeedback();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newStory, setNewStory] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    api.get('/api/stories/all')
      .then((res) => setStories(Array.isArray(res.data) ? res.data : []))
      .catch((err) => { console.error('Stories error:', err); setStories([]); })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  const selection = useSelection(stories);
  const remove = useDeleteAction('/api/stories', () => { selection.clear(); reload(); });

  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newStory.title);
    formData.append('content', newStory.content);
    formData.append('file', file);

    setSaving(true);
    try {
      await api.post('/api/stories', formData);
      setNewStory({ title: '', content: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast(t('sadmin.added'));
      reload();
    } catch (err) {
      toast(err.response?.status === 403 ? t('admin.forbidden') : t('sadmin.addFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1><FaBook /> {t('sadmin.title')}</h1>
        <p>{t('sadmin.subtitle')}</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaPlus /> <span>{t('sadmin.addNew')}</span></div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaPen /> {t('sadmin.storyTitle')}</label>
              <input
                placeholder={t('sadmin.titlePh')}
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label><FaBook /> {t('sadmin.content')}</label>
              <textarea
                placeholder={t('sadmin.contentPh')}
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label><FaMicrophone /> {t('sadmin.audio')}</label>
              <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} ref={fileInputRef} required />
            </div>

            <button type="submit" className="admin-btn primary" disabled={saving}>
              <FaCloudUploadAlt /> {saving ? t('sadmin.uploading') : t('sadmin.upload')}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header orange"><FaListUl /> <span>{t('sadmin.list', { n: stories.length })}</span></div>
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
                    <th>{t('sadmin.colName')}</th>
                    <th>{t('sadmin.colSummary')}</th>
                    <th className="text-center">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.length > 0 ? stories.map((story) => (
                    <tr key={story.id} className={selection.isSelected(story.id) ? 'row-selected' : ''}>
                      <td className="check-col">
                        <input type="checkbox" checked={selection.isSelected(story.id)} onChange={() => selection.toggle(story.id)} aria-label={t('admin.selectRow')} />
                      </td>
                      <td className="video-name">{story.title}</td>
                      <td className="cell-muted">
                        {story.content && story.content.length > 50 ? `${story.content.substring(0, 50)}...` : story.content}
                      </td>
                      <td className="text-center">
                        <button onClick={() => remove([story.id])} className="admin-btn danger-sm">
                          <FaTrashAlt /> {t('admin.delete')}
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="empty-row">{t('sadmin.empty')}</td></tr>
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
