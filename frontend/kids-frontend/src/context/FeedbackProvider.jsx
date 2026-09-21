import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTrashAlt } from 'react-icons/fa';
import { FeedbackContext } from './feedback-context';
import { useLanguage } from '../i18n/language-context';
import './FeedbackProvider.css';

// بديل عن alert() و confirm() الأصليين: نوافذ المتصفح قد تُحجب (مثل معاينة التطبيقات)
// فتبدو أزرار الحذف "ميتة". هذه النسخة تعمل داخل الصفحة في كل مكان.
export default function FeedbackProvider({ children }) {
  const { t } = useLanguage();
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null); // { opts, resolve }
  const nextId = useRef(0);
  const cancelRef = useRef(null);

  const toast = useCallback((text, type = 'success') => {
    const id = nextId.current++;
    setToasts((list) => [...list, { id, text, type }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4000);
  }, []);

  const confirm = useCallback((opts) => new Promise((resolve) => setDialog({ opts, resolve })), []);

  const close = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  useEffect(() => {
    if (!dialog) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { dialog.resolve(false); setDialog(null); } };
    document.addEventListener('keydown', onKey);
    cancelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [dialog]);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite">
        {toasts.map((x) => (
          <div key={x.id} className={`toast ${x.type}`}>
            {x.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
            <span>{x.text}</span>
          </div>
        ))}
      </div>

      {dialog && (
        <div className="cd-backdrop" onClick={() => close(false)}>
          <div className="cd-box" role="alertdialog" aria-modal="true" aria-labelledby="cd-title" onClick={(e) => e.stopPropagation()}>
            <span className="cd-icon"><FaTrashAlt /></span>
            <h3 id="cd-title">{dialog.opts.title || t('admin.confirmTitle')}</h3>
            <p>{dialog.opts.message}</p>
            <div className="cd-actions">
              <button ref={cancelRef} className="cd-btn" onClick={() => close(false)}>{t('admin.cancel')}</button>
              <button className="cd-btn danger" onClick={() => close(true)}>{dialog.opts.confirmLabel || t('admin.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
