import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import './Games.css';

const GAMES = [
  {
    to: '/games/quiz',
    emoji: '🧠',
    tone: 'brand',
    title: 'Sayı ve Renk Yarışması',
    desc: 'Say, topla, renkleri tanı ve yıldızları topla!',
    tag: 'Öğreten oyun',
  },
  {
    to: '/balloon-game',
    emoji: '🎈',
    tone: 'coral',
    title: 'Balon Patlatma',
    desc: '30 saniyede olabildiğince çok balon patlat.',
    tag: 'Hızlı oyun',
  },
];

export default function Games() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>🎮 Oyun Zamanı</h1>
          <p>Eğlen, öğren ve rekorlarını kır!</p>
        </div>
      </section>

      <div className="container page-body">
        <div className="games-grid">
          {GAMES.map((g) => (
            <Link key={g.to} to={g.to} className={`game-card tone-${g.tone}`}>
              <span className="game-card-art">{g.emoji}</span>
              <div className="game-card-body">
                <span className="game-card-tag">{g.tag}</span>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <span className="game-card-play"><FaPlay /> Oyna</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
