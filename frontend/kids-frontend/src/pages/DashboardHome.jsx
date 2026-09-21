import { useEffect, useState } from 'react';
import { FaVideo, FaUsers, FaBook } from 'react-icons/fa';
import api from '../api';

export default function DashboardHome() {
  const [stats, setStats] = useState({ videoCount: 0, userCount: 0, storyCount: 0 });

  useEffect(() => {
    api.get('/api/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const statCards = [
    { title: 'Toplam Video', count: stats.videoCount, icon: <FaVideo />, color: '#6c5ce7' },
    { title: 'Toplam Kullanıcı', count: stats.userCount, icon: <FaUsers />, color: '#12b886' },
    { title: 'Toplam Masal', count: stats.storyCount, icon: <FaBook />, color: '#3b9cff' },
  ];

  return (
    <div>
      <h1 className="page-title">Genel Durum</h1>
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.title} className="stat-card" style={{ borderLeft: `6px solid ${card.color}` }}>
            <div className="stat-info">
              <span className="stat-title">{card.title}</span>
              <span className="stat-number">{card.count}</span>
            </div>
            <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
