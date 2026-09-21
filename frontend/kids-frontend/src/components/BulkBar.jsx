import { FaTrashAlt } from 'react-icons/fa';
import { useLanguage } from '../i18n/language-context';

// شريط يظهر عند تحديد صفوف في جدول الإدارة
export default function BulkBar({ count, onDelete }) {
  const { t } = useLanguage();
  if (count === 0) return null;

  return (
    <div className="bulk-bar">
      <span>{t('admin.selected', { n: count })}</span>
      <button type="button" className="admin-btn danger-sm" onClick={onDelete}>
        <FaTrashAlt /> {t('admin.deleteSelected')}
      </button>
    </div>
  );
}
