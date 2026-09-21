import { useEffect, useState } from 'react';
import { FaUserPlus, FaUsers, FaUserTag, FaEnvelope, FaLock, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../api';
import { useAuth } from '../context/auth-context';

const EMPTY_USER = { name: '', parent_email: '', password: '', role: 'user' };

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    api.get('/api/users/all')
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => { console.error('Veri hatası:', err); setUsers([]); })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', newUser);
      setNewUser(EMPTY_USER);
      reload();
    } catch (err) {
      alert(err.response?.status === 409 ? 'Bu e-posta zaten kayıtlı.' : 'Kullanıcı eklenemedi, lütfen bilgileri kontrol edin.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Silme hatası!');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1><FaUsers /> Kullanıcı Yönetimi</h1>
        <p>Sistemdeki kullanıcıları ve yetkilerini buradan yönetebilirsiniz.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="card-header"><FaUserPlus /> <span>Yeni Kullanıcı Ekle</span></div>
          <form onSubmit={handleAddUser} className="admin-form">
            <div className="form-group">
              <label><FaUserTag /> Ad Soyad</label>
              <input placeholder="Örn: Naim Musa" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> E-posta Adresi</label>
              <input type="email" placeholder="ornek@mail.com" value={newUser.parent_email} onChange={(e) => setNewUser({ ...newUser, parent_email: e.target.value })} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> Şifre</label>
                <input type="password" placeholder="En az 6 karakter" minLength={6} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label><FaShieldAlt /> Yetki Rolü</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="user">Kullanıcı (User)</option>
                  <option value="admin">Yönetici (Admin)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="admin-btn primary"><FaUserPlus /> Kullanıcıyı Kaydet</button>
          </form>
        </div>

        <div className="admin-card">
          <div className="card-header green"><FaUsers /> <span>Sistemdeki Üyeler ({users.length})</span></div>
          <div className="table-wrapper">
            {loading ? (
              <div className="admin-loading">Yükleniyor...</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>E-posta</th>
                    <th>Yetki</th>
                    <th className="text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((u) => (
                    <tr key={u.id}>
                      <td className="video-name">{u.name}</td>
                      <td>{u.parent_email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role === 'admin' ? 'Yönetici' : 'Üye'}</span>
                      </td>
                      <td className="text-center">
                        <button onClick={() => deleteUser(u.id)} className="admin-btn danger-sm" disabled={u.id === me?.id} title={u.id === me?.id ? 'Kendi hesabını silemezsin' : ''}>
                          <FaTrashAlt /> Sil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="empty-row">Henüz kullanıcı bulunmuyor.</td></tr>
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
