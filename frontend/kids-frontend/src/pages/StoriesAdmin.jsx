import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaBook, FaPen, FaMicrophone, FaTrashAlt, FaListUl, FaCloudUploadAlt } from 'react-icons/fa';

export default function StoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة الفورم الجديد (الحفاظ على المسميات الأصلية للربط مع API)
  const [newStory, setNewStory] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null); 
  const fileInputRef = useRef(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/stories/all');
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', newStory.title);
    formData.append('content', newStory.content);
    formData.append('file', file); 

    try {
      await axios.post('http://localhost:5000/api/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNewStory({ title: '', content: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchStories();
    } catch (err) {
      alert("Masal yüklenirken bir hata oluştu. Lütfen ses dosyasını kontrol edin.");
    }
  };

  const deleteStory = async (id) => {
    if (window.confirm("Bu masalı silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/stories/${id}`);
        fetchStories();
      } catch (err) { alert("Silme işlemi başarısız."); }
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header">
        <h1><FaBook /> Masal Yönetimi</h1>
        <p>Yeni sesli masallar ekleyin ve kütüphanenizi güncelleyin.</p>
      </div>

      <div className="admin-grid">
        {/* قسم إضافة قصة جديدة */}
        <div className="admin-card add-card">
          <div className="card-header">
            <FaPlus /> <span>Yeni Masal Ekle</span>
          </div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaPen /> Masal Başlığı</label>
              <input 
                placeholder="Örn: Pamuk Prenses" 
                value={newStory.title} 
                onChange={e => setNewStory({...newStory, title: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label><FaBook /> Masal İçeriği / Özeti</label>
              <textarea 
                placeholder="Masalın içeriğini buraya yazın..." 
                value={newStory.content} 
                onChange={e => setNewStory({...newStory, content: e.target.value})} 
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d3e2', minHeight: '100px' }}
              />
            </div>

            <div className="form-group">
              <label><FaMicrophone /> Ses Dosyası (Audio)</label>
              <div className="custom-file-upload">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={e => setFile(e.target.files[0])} 
                  ref={fileInputRef}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="admin-btn primary">
              <FaCloudUploadAlt /> Masalı Sisteme Yükle
            </button>
          </form>
        </div>

        {/* قسم قائمة القصص المتاحة */}
        <div className="admin-card list-card">
          <div className="card-header list-header" style={{ background: '#f6ad55' }}>
            <FaListUl /> <span>Kütüphanedeki Masallar</span>
          </div>
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
                  {stories.length > 0 ? stories.map(story => (
                    <tr key={story.id}>
                      <td className="video-name">{story.title}</td>
                      <td style={{ fontSize: '0.85rem', color: '#718096' }}>
                        {story.content && story.content.length > 50 ? story.content.substring(0, 50) + '...' : story.content}
                      </td>
                      <td className="text-center">
                        <button 
                          onClick={() => deleteStory(story.id)} 
                          className="admin-btn danger-sm"
                        >
                          <FaTrashAlt /> Sil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="empty-row">Henüz masal eklenmemiş.</td>
                    </tr>
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