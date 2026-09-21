import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaBook, FaPen, FaMicrophone, FaTrashAlt, FaListUl, FaCloudUploadAlt } from 'react-icons/fa';
import api from '../api';

export default function StoriesAdmin() {
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
      .catch((err) => { console.error('Veri çekme hatası:', err); setStories([]); })
      .finally(() => setLoading(false));
  }, [reloadKey]);

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
      reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Masal yüklenirken bir hata oluştu. Lütfen ses dosyasını kontrol edin.');
    } finally {
      setSaving(false);
    }
  };

  const deleteStory = async (id) => {
    if (!window.confirm('Bu masalı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/api/stories/${id}`);
      reload();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1><FaBook /> Masal Yönetimi</h1>
        <p>Yeni sesli masallar ekleyin ve kütüphanenizi güncelleyin.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaPlus /> <span>Yeni Masal Ekle</span></div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaPen /> Masal Başlığı</label>
              <input
                placeholder="Örn: Pamuk Prenses"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label><FaBook /> Masal İçeriği / Özeti</label>
              <textarea
                placeholder="Masalın içeriğini buraya yazın..."
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label><FaMicrophone /> Ses Dosyası (Audio)</label>
              <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} ref={fileInputRef} required />
            </div>

            <button type="submit" className="admin-btn primary" disabled={saving}>
              <FaCloudUploadAlt /> {saving ? 'Yükleniyor...' : 'Masalı Sisteme Yükle'}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header orange"><FaListUl /> <span>Kütüphanedeki Masallar ({stories.length})</span></div>
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">Yükleniyor...</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Masal Adı</th>
                    <th>İçerik Özeti</th>
                    <th className="text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.length > 0 ? stories.map((story) => (
                    <tr key={story.id}>
                      <td className="video-name">{story.title}</td>
                      <td className="cell-muted">
                        {story.content && story.content.length > 50 ? `${story.content.substring(0, 50)}...` : story.content}
                      </td>
                      <td className="text-center">
                        <button onClick={() => deleteStory(story.id)} className="admin-btn danger-sm">
                          <FaTrashAlt /> Sil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="empty-row">Henüz masal eklenmemiş.</td></tr>
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
