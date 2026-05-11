import { useEffect, useState } from 'react';
import axios from 'axios';
import './Videos.css';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // يبقى الرابط وطلب البيانات كما هو لضمان عمل الـ API
        const response = await axios.get('http://localhost:5000/api/videos');
        let data = Array.isArray(response.data) ? response.data : (Object.values(response.data).find(Array.isArray) || []);
        setVideos(data);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="loading-screen">En güzel videolar hazırlanıyor... ⏳</div>;

  return (
    <div className="videos-page-wrapper">
      <div className="videos-container">
        {/* العنوان بالتركي */}
        <h1 className="videos-title">🎬 Sihirli Çocuk Sineması</h1>
        
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id || Math.random()} className="video-flip-card">
              <div className="video-card-inner">
                
                {/* الوجه الأمامي: صورة الفيديو */}
                <div className="video-card-front">
                  <div className="thumbnail-box">
                    <img 
                      src={video.thumbnail_url || 'https://via.placeholder.com/300x180?text=Resim+Yok'} 
                      alt={video.title} 
                      className="video-img"
                    />
                    <div className="play-badge">▶</div>
                  </div>
                  <h3 className="video-title-text">{video.title}</h3>
                </div>

                {/* الوجه الخلفي: الوصف بالتركي وزر المشاهدة */}
                <div className="video-card-back">
                  <div className="back-content">
                    <h3>{video.title}</h3>
                    {/* نص وصفي افتراضي بالتركي في حال عدم وجود وصف من الـ API */}
                    <p>{video.description || "Bu harika macerayı keşfetmeye hazır mısın? İyi seyirler dileriz!"}</p>
                    <a 
                      href={video.video_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="watch-now-btn"
                    >
                      Şimdi İzle ✨
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}