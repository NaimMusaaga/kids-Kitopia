import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaVideo, FaUsers, FaBook } from 'react-icons/fa';

export default function DashboardHome() {
  const [stats, setStats] = useState({ videoCount: 0, userCount: 0, storyCount: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const statCards = [
    { title: 'Toplam Video', count: stats.videoCount, icon: <FaVideo />, color: '#4e73df' },
    { title: 'Toplam Kullanıcı', count: stats.userCount, icon: <FaUsers />, color: '#1cc88a' },
    { title: 'Toplam Masal', count: stats.storyCount, icon: <FaBook />, color: '#36b9cc' },
  ];

  return (
    <div className="stats-container">
      <h1 className="page-title">Genel Durum</h1>
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" style={{ borderLeft: `5px solid ${card.color}` }}>
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