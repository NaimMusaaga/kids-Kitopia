import { useNavigate } from 'react-router-dom';
import { FaPalette, FaCalculator, FaDog, FaShapes, FaGamepad, FaArrowCircleRight } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  // مصفوفة بيانات الكاتيجوري لتسهيل الكود
  const categories = [
    { id: 1, name: 'Renkler', icon: <FaPalette />, class: 'colors', path: '/colors', desc: 'Rengarenk dünyayı keşfet!' },
    { id: 2, name: 'Sayılar', icon: <FaCalculator />, class: 'numbers', path: '/numbers', desc: '1, 2, 3... Haydi sayalım!' },
    { id: 3, name: 'Hayvanlar', icon: <FaDog />, class: 'animals', path: '/animals', desc: 'Sevimli dostlarımızla tanış!' },
    { id: 4, name: 'Şekiller', icon: <FaShapes />, class: 'shapes', path: '/shapes', desc: 'Daire, kare ve dahası!' },
    { id: 5, name: 'Oyunlar', icon: <FaGamepad />, class: 'games', path: '/balloon-game', desc: 'Eğlence dolu oyunlar oyna!' },
  ];

  return (
    <div className="home-page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Kitopia</h1>
          <p className="hero-subtitle">Çocuğunuzla en güzel masalların tadını çıkarın!</p>
          <button className="watch-btn" onClick={() => navigate('/videos')}>Masalları İzle</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section-new">
        <h2>Hızlı Kategoriler</h2>
        <div className="categories-grid-new">
          {categories.map((cat) => (
            /* حاوية الكرت الأساسية */
            <div key={cat.id} className={`flip-card ${cat.class}`} onClick={() => navigate(cat.path)}>
              {/* الحاوية الداخلية التي تدور */}
              <div className="flip-card-inner">
                
                {/* الوجه الأمامي (يظهر أولاً) */}
                <div className="flip-card-front">
                  <div className="icon-wrapper-front">{cat.icon}</div>
                  <span>{cat.name}</span>
                </div>
                
                {/* الوجه الخلفي (يظهر عند تمرير الفأرة) */}
                <div className="flip-card-back">
                  <div className="icon-wrapper-back">{cat.icon}</div>
                  <div className="back-title">{cat.name}</div>
                  <p className="back-desc">{cat.desc}</p>
                  <FaArrowCircleRight style={{fontSize: '24px', marginTop: '10px'}}/>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-new">
        <div className="cta-content-new">
          <h2>Eğlence Dünyasına Katıl!</h2>
          <p>Harika masallar ve oyunlar seni bekliyor. Hemen kayıt ol وكن جزءاً من عائلتنا!</p>
          <button className="cta-btn-new" onClick={() => navigate('/register')}>
            Kayıt Ol
          </button>
        </div>
      </section>
    </div>
  );
}