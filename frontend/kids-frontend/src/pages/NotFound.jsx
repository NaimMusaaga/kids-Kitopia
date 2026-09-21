import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="state-box">
        <span className="state-emoji">🧭</span>
        <h1>Sayfa bulunamadı</h1>
        <p>Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
        <Link to="/" className="btn btn-brand">Ana Sayfaya Dön</Link>
      </div>
    </div>
  );
}
