import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Stories.css';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stories');
        setStories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) return <div className="loading-screen">En güzel masallar hazırlanıyor... ⏳</div>;

  return (
    <div className="stories-page-wrapper">
      <div className="stories-container">
        <h1 className="stories-title">📚 Sihirli Masal Dünyası</h1>
        
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-flip-card">
              <div className="story-card-inner">
                
                {/* الوجه الأمامي: صورة القصة وعنوانها */}
                <div className="story-card-front">
                  <div className="story-thumbnail-box">
                    <img 
                      src={story.thumbnail_url || 'https://via.placeholder.com/300x195?text=Masal+Resmi'} 
                      alt={story.title} 
                      className="story-thumbnail"
                    />
                    <div className="read-badge">📖</div>
                  </div>
                  <h3 className="story-title-text">{story.title}</h3>
                </div>

                {/* الوجه الخلفي: وصف القصة وزر القراءة */}
                <div className="story-card-back">
                  <div className="back-content">
                    <h3>{story.title}</h3>
                    <p>{story.description || "Bu masalda seni harika maceralar bekliyor. Hemen okumaya başla!"}</p>
                    <button 
                      className="read-now-btn"
                      onClick={() => navigate(`/story/${story.id}`)}
                    >
                      Şimdi Oku ✨
                    </button>
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