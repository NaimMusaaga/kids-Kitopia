import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import './BalloonGame.css';

const ROUND_SECONDS = 30;

function loadBest() {
  try { return Number(localStorage.getItem('balloonBest')) || 0; } catch { return 0; }
}

export default function BalloonGame() {
  const [status, setStatus] = useState('idle'); // idle | playing | over
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState(loadBest);
  const nextId = useRef(0);
  const scoreRef = useRef(0);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setBalloons([]);
    setTimeLeft(ROUND_SECONDS);
    setStatus('playing');
  };

  // العدّ التنازلي
  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setStatus('over');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // إنشاء البالونات: تسرع كلما زادت النقاط
  useEffect(() => {
    if (status !== 'playing') return;
    let timer;
    const spawn = () => {
      const id = nextId.current++;
      setBalloons((prev) => [...prev, {
        id,
        x: 4 + Math.random() * 84,
        size: 64 + Math.random() * 28,
        duration: 5 + Math.random() * 3,
        hue: Math.floor(Math.random() * 360),
        popped: false,
      }]);
      timer = setTimeout(spawn, Math.max(450, 950 - scoreRef.current * 12));
    };
    timer = setTimeout(spawn, 300);
    return () => clearTimeout(timer);
  }, [status]);

  // حفظ أفضل نتيجة عند نهاية الجولة
  useEffect(() => {
    if (status !== 'over') return;
    const finalScore = scoreRef.current;
    setBest((b) => {
      if (finalScore > b) {
        try { localStorage.setItem('balloonBest', String(finalScore)); } catch { /* تجاهل */ }
        return finalScore;
      }
      return b;
    });
  }, [status]);

  const pop = useCallback((id) => {
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setTimeout(() => setBalloons((prev) => prev.filter((b) => b.id !== id)), 250);
  }, []);

  // البالون الذي يخرج من الشاشة يُحذف
  const remove = useCallback((id) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <div className="game-page">
      <div className="container game-shell">
        <Link to="/games" className="game-back"><FaArrowLeft /> Oyunlar</Link>
        <h1>🎈 Balon Patlatma Oyunu</h1>

        <div className="game-hud">
          <span className="hud-item"><FaStar /> Puan: <strong>{score}</strong></span>
          <span className="hud-item"><FaClock /> Süre: <strong>{timeLeft}</strong></span>
          <span className="hud-item"><FaTrophy /> En iyi: <strong>{best}</strong></span>
        </div>

        <div className="game-container">
          {balloons.map((b) => (
            <button
              key={b.id}
              className={`balloon${b.popped ? ' popped' : ''}`}
              style={{
                left: `${b.x}%`,
                width: b.size,
                height: b.size * 1.2,
                animationDuration: `${b.duration}s`,
                background: `radial-gradient(circle at 30% 28%, hsl(${b.hue} 90% 82%), hsl(${b.hue} 75% 55%))`,
              }}
              onPointerDown={() => !b.popped && pop(b.id)}
              onAnimationEnd={(e) => e.animationName === 'float-up' && remove(b.id)}
              aria-label="Balonu patlat"
            />
          ))}

          {status !== 'playing' && (
            <div className="game-overlay">
              {status === 'over' ? (
                <>
                  <h2>Süre doldu! ⏰</h2>
                  <p>Toplam <strong>{score}</strong> balon patlattın{score >= best && score > 0 ? ' — yeni rekor! 🏆' : '.'}</p>
                  <button className="btn btn-sun btn-lg" onClick={start}>Tekrar Oyna</button>
                </>
              ) : (
                <>
                  <h2>Hazır mısın?</h2>
                  <p>{ROUND_SECONDS} saniyede olabildiğince çok balon patlat!</p>
                  <button className="btn btn-sun btn-lg" onClick={start}>Başla</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
