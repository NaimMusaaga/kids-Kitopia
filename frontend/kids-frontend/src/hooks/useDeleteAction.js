import { useFeedback } from '../context/feedback-context';
import { useLanguage } from '../i18n/language-context';
import api from '../api';

// حذف عنصر أو عدة عناصر مع نافذة تأكيد ورسالة نتيجة واضحة
export default function useDeleteAction(endpoint, onDone) {
  const { confirm, toast } = useFeedback();
  const { t } = useLanguage();

  return async (ids) => {
    const ok = await confirm({
      message: ids.length === 1 ? t('admin.confirmOne') : t('admin.confirmMany', { n: ids.length }),
    });
    if (!ok) return;

    const results = await Promise.allSettled(ids.map((id) => api.delete(`${endpoint}/${id}`)));
    const failed = results.filter((r) => r.status === 'rejected');
    const done = ids.length - failed.length;

    if (failed.length === 0) {
      toast(done === 1 ? t('admin.deleted') : t('admin.deletedMany', { n: done }));
    } else if (done > 0) {
      toast(t('admin.deletePartial', { ok: done, fail: failed.length }), 'error');
    } else {
      const status = failed[0].reason?.response?.status;
      toast(status === 403 ? t('admin.forbidden') : t('admin.deleteFailed'), 'error');
    }
    onDone();
  };
}
