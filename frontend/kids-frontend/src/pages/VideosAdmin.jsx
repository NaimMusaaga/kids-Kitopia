import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaVideo, FaFolder, FaChild, FaTrashAlt, FaCloudUploadAlt, FaListUl } from 'react-icons/fa';

export default function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newVideo, setNewVideo] = useState({ title: '', category_id: '', age_group_id: '' });
  const [videoFile, setVideoFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/videos/all');
      setVideos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Veri hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newVideo.title);
    formData.append('category_id', newVideo.category_id);
    formData.append('age_group_id', newVideo.age_group_id);
    formData.append('videoFile', videoFile);

    try {
      await axios.post('http://localhost:5000/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewVideo({ title: '', category_id: '', age_group_id: '' });
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchVideos();
    } catch (err) {
      alert("Yükleme başarısız!");
    }
  };

  const deleteVideo = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/videos/${id}`);
        fetchVideos();
      } catch (err) {
        alert("Silme hatası!");
      }
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header">
        <h1><FaVideo /> Video Yönetimi</h1>
        <p>Sisteme yeni videolar ekleyebilir ve mevcut olanları silebilirsiniz.</p>
      </div>

      <div className="admin-grid">
        {/* قسم إضافة فيديو جديد */}
        <div className="admin-card add-card">
          <div className="card-header">
            <FaPlus /> <span>Yeni Video Ekle</span>
          </div>
          <form onSubmit={handleAdd} className="admin-form">
            <div className="form-group">
              <label><FaVideo /> Video Başlığı</label>
              <input 
                placeholder="Örn: Renkleri Öğreniyoruz" 
                value={newVideo.title} 
                onChange={e => setNewVideo({...newVideo, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><FaFolder /> Kategori ID</label>
                <input 
                  type="number" 
                  placeholder="ID" 
                  value={newVideo.category_id} 
                  onChange={e => setNewVideo({...newVideo, category_id: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label><FaChild /> Yaş Grubu ID</label>
                <input 
                  type="number" 
                  placeholder="ID" 
                  value={newVideo.age_group_id} 
                  onChange={e => setNewVideo({...newVideo, age_group_id: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label><FaCloudUploadAlt /> Video Dosyası Seç</label>
              <div className="custom-file-upload">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={e => setVideoFile(e.target.files[0])} 
                  ref={fileInputRef} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="admin-btn primary">
              <FaCloudUploadAlt /> Videoyu Sisteme Yükle
            </button>
          </form>
        </div>

        {/* قسم قائمة الفيديوهات */}
        <div className="admin-card list-card">
          <div className="card-header list-header">
            <FaListUl /> <span>Mevcut Videolar</span>
          </div>
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">Yükleniyor...</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Video Başlığı</th>
                    <th className="text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id}>
                      <td className="video-name">{video.title}</td>
                      <td className="text-center">
                        <button onClick={() => deleteVideo(video.id)} className="admin-btn danger-sm">
                          <FaTrashAlt /> Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}