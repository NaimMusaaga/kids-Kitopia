import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { useLanguage } from '../i18n/language-context';
import './Games.css';

const GAMES = [
  { to: '/games/quiz', emoji: '🧠', tone: 'brand', key: 'quiz' },
  { to: '/balloon-game', emoji: '🎈', tone: 'coral', key: 'balloon' },
];

export default function Games() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>{t('games.heroTitle')}</h1>
          <p>{t('games.heroText')}</p>
        </div>
      </section>

      <div className="container page-body">
        <div className="games-grid">
          {GAMES.map((g) => (
            <Link key={g.to} to={g.to} className={`game-card tone-${g.tone}`}>
              <span className="game-card-art">{g.emoji}</span>
              <div className="game-card-body">
                <span className="game-card-tag">{t(`games.${g.key}Tag`)}</span>
                <h3>{t(`games.${g.key}Title`)}</h3>
                <p>{t(`games.${g.key}Desc`)}</p>
                <span className="game-card-play"><FaPlay /> {t('games.play')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
