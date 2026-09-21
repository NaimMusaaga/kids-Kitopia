import { useEffect, useState } from 'react';
import { FaUserPlus, FaUsers, FaUserTag, FaEnvelope, FaLock, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../api';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../i18n/language-context';
import { useFeedback } from '../context/feedback-context';
import useSelection from '../hooks/useSelection';
import useDeleteAction from '../hooks/useDeleteAction';
import BulkBar from '../components/BulkBar';

const EMPTY_USER = { name: '', parent_email: '', password: '', role: 'user' };

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const { t } = useLanguage();
  const { toast } = useFeedback();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    api.get('/api/users/all')
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => { console.error('Users error:', err); setUsers([]); })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  // لا يمكن للمدير حذف حسابه الحالي
  const selection = useSelection(users, (u) => u.id !== me?.id);
  const remove = useDeleteAction('/api/users', () => { selection.clear(); reload(); });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', newUser);
      setNewUser(EMPTY_USER);
      toast(t('uadmin.added'));
      reload();
    } catch (err) {
      toast(err.response?.status === 409 ? t('uadmin.exists') : t('uadmin.addFailed'), 'error');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1><FaUsers /> {t('uadmin.title')}</h1>
        <p>{t('uadmin.subtitle')}</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaUserPlus /> <span>{t('uadmin.addNew')}</span></div>
          <form onSubmit={handleAddUser} className="admin-form">
            <div className="form-group">
              <label><FaUserTag /> {t('uadmin.name')}</label>
              <input placeholder={t('uadmin.namePh')} value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> {t('uadmin.email')}</label>
              <input type="email" dir="ltr" placeholder="name@mail.com" value={newUser.parent_email} onChange={(e) => setNewUser({ ...newUser, parent_email: e.target.value })} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> {t('uadmin.password')}</label>
                <input type="password" dir="ltr" placeholder={t('uadmin.passwordPh')} minLength={6} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label><FaShieldAlt /> {t('uadmin.role')}</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="user">{t('uadmin.roleUser')}</option>
                  <option value="admin">{t('uadmin.roleAdmin')}</option>
                </select>
              </div>
            </div>

            <button type="submit" className="admin-btn primary"><FaUserPlus /> {t('uadmin.save')}</button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header green"><FaUsers /> <span>{t('uadmin.list', { n: users.length })}</span></div>
          <BulkBar count={selection.selected.length} onDelete={() => remove(selection.selected)} />
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">{t('admin.loading')}</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th className="check-col">
                      <input type="checkbox" checked={selection.allSelected} onChange={selection.toggleAll} aria-label={t('admin.selectAll')} />
                    </th>
                    <th>{t('uadmin.colName')}</th>
                    <th>{t('uadmin.colEmail')}</th>
                    <th>{t('uadmin.colAge')}</th>
                    <th>{t('uadmin.colRole')}</th>
                    <th className="text-center">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((u) => {
                    const isMe = u.id === me?.id;
                    return (
                      <tr key={u.id} className={selection.isSelected(u.id) ? 'row-selected' : ''}>
                        <td className="check-col">
                          <input type="checkbox" checked={selection.isSelected(u.id)} disabled={isMe} onChange={() => selection.toggle(u.id)} aria-label={t('admin.selectRow')} />
                        </td>
                        <td className="video-name">{u.name}</td>
                        <td dir="ltr" className="cell-email">{u.parent_email}</td>
                        <td className="cell-muted">{u.age || '—'}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role === 'admin' ? t('uadmin.admin') : t('uadmin.member')}</span>
                        </td>
                        <td className="text-center">
                          <button onClick={() => remove([u.id])} className="admin-btn danger-sm" disabled={isMe} title={isMe ? t('uadmin.cantDeleteSelf') : ''}>
                            <FaTrashAlt /> {t('admin.delete')}
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="6" className="empty-row">{t('uadmin.empty')}</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
