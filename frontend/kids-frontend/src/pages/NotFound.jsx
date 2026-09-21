import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/language-context';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <div className="state-box">
        <span className="state-emoji">🧭</span>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link to="/" className="btn btn-brand">{t('notFound.home')}</Link>
      </div>
    </div>
  );
}
