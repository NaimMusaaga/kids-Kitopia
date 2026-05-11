import { useState, useEffect } from 'react';
import './BalloonGame.css'; // رح ننشئ هاد الملف كمان

export default function BalloonGame() {
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBalloon = {
        id: Date.now(),
        x: Math.random() * 80, // مكان عشوائي
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      };
      setBalloons((prev) => [...prev, newBalloon]);
    }, 1000); // بالون كل ثانية

    return () => clearInterval(interval);
  }, []);

  const popBalloon = (id) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="game-page">
      <h1>لعبة فرقعة البالونات 🎈</h1>
      <div className="game-container">
        {balloons.map((b) => (
          <div
            key={b.id}
            className="balloon"
            style={{ left: `${b.x}%`, backgroundColor: b.color }}
            onClick={() => popBalloon(b.id)}
          />
        ))}
      </div>
    </div>
  );
}