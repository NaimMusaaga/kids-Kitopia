import { useEffect, useState } from 'react';
import { FaVideo, FaUsers, FaBook } from 'react-icons/fa';
import api from '../api';
import { useLanguage } from '../i18n/language-context';

export default function DashboardHome() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ videoCount: 0, userCount: 0, storyCount: 0 });

  useEffect(() => {
    api.get('/api/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const statCards = [
    { title: t('dash.totalVideos'), count: stats.videoCount, icon: <FaVideo />, color: '#6c5ce7' },
    { title: t('dash.totalUsers'), count: stats.userCount, icon: <FaUsers />, color: '#12b886' },
    { title: t('dash.totalStories'), count: stats.storyCount, icon: <FaBook />, color: '#3b9cff' },
  ];

  return (
    <div>
      <h1 className="page-title">{t('dash.status')}</h1>
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.title} className="stat-card" style={{ borderInlineStart: `6px solid ${card.color}` }}>
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
