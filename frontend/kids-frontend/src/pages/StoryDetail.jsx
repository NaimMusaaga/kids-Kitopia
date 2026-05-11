import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMoon, FaStar, FaBed } from 'react-icons/fa'; // أيقونات توحي بالنوم
import './StoryDetail.css';

export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        // تأكد من صحة الرابط مع الـ Backend الخاص بك
        const response = await axios.get(`http://localhost:5000/api/stories/${id}`);
        setStory(response.data);
      } catch (err) {
        console.error("Masal çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [id]);

  if (loading) return (
    <div className="dream-loading">
      <FaMoon className="spinning-moon" />
      <span>Tatlı rüyalar hazırlanıyor... 🌌</span>
    </div>
  );

  if (!story) return (
    <div className="dream-error">
      <FaStar />
      <span>Hoppala! Bu masal uykuya dalmış galiba. Bulamadık.</span>
    </div>
  );

  return (
    <div className="story-sleep-wrapper">
      {/* نجوم خلفية تتلألأ */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`dream-star star-${i}`}>★</div>
      ))}

      {/* زر الرجوع للخلف */}
      <button className="back-to-dreams-btn" onClick={() => navigate('/stories')}>
        <FaArrowLeft /> Masal Diyarına Dön
      </button>

      <div className="story-sleep-card">
        {/* الجزء العلوي: صورة الغلاف */}
        <div className="sleep-header-image">
          <img 
            src={story.thumbnail_url || 'https://via.placeholder.com/800x400?text=Uyku+Masalı'} 
            alt={story.title} 
          />
          <div className="sleep-overlay-title">
             <h1>{story.title}</h1>
             <p className="story-author"><FaBed /> {story.author || 'Kitopia Masalcısı'}</p>
          </div>
        </div>

        <div className="sleep-content-section">
          {/* مشغل الصوت السحري */}
          <div className="dream-audio-container">
            <h3><FaMoon /> Masalı Dinle ve Uyu</h3>
            <audio controls className="sleep-audio-player">
              {/* تأكد من صحة رابط الصوت من الـ API */}
              <source src={`http://localhost:5000/public/${story.audio_path}`} type="audio/mpeg" />
              Tarayıcınız uyku seslerini desteklemiyor.
            </audio>
          </div>

          {/* محتوى القصة */}
          <div className="dream-text-content">
            <p className="story-text-body">
                {story.content || story.description || "Bu masalın sözleri yıldızlara uçmuş! Çok yakında geri dönecekler."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}