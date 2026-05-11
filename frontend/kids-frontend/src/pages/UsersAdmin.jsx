import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaUsers, FaUserTag, FaEnvelope, FaLock, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // حالة الفورم (الحفاظ على المسميات الأصلية للربط)
  const [newUser, setNewUser] = useState({ name: '', parent_email: '', password: '', role: 'user' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users/all');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Veri hatası:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      setNewUser({ name: '', parent_email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) { 
        console.error(err);
        alert("Kullanıcı eklenemedi, lütfen bilgileri kontrol edin."); 
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) { alert("Silme hatası!"); }
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header">
        <h1><FaUsers /> Kullanıcı Yönetimi</h1>
        <p>Sistemdeki kullanıcıları ve yetkilerini buradan yönetebilirsiniz.</p>
      </div>

      <div className="admin-grid">
        {/* قسم إضافة مستخدم جديد */}
        <div className="admin-card add-card">
          <div className="card-header">
            <FaUserPlus /> <span>Yeni Kullanıcı Ekle</span>
          </div>
          <form onSubmit={handleAddUser} className="admin-form">
            <div className="form-group">
              <label><FaUserTag /> Ad Soyad</label>
              <input 
                placeholder="Örn: Naim Musa" 
                value={newUser.name} 
                onChange={e => setNewUser({...newUser, name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> E-posta Adresi</label>
              <input 
                type="email"
                placeholder="ornek@mail.com" 
                value={newUser.parent_email} 
                onChange={e => setNewUser({...newUser, parent_email: e.target.value})} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> Şifre</label>
                <input 
                  type="password" 
                  placeholder="******" 
                  value={newUser.password} 
                  onChange={e => setNewUser({...newUser, password: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label><FaShieldAlt /> Yetki Rolü</label>
                <select 
                  value={newUser.role} 
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d3e2' }}
                >
                  <option value="user">Kullanıcı (User)</option>
                  <option value="admin">Yönetici (Admin)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="admin-btn primary">
              <FaUserPlus /> Kullanıcıyı Kaydet
            </button>
          </form>
        </div>

        {/* قسم قائمة المستخدمين */}
        <div className="admin-card list-card">
          <div className="card-header list-header" style={{ background: '#1cc88a' }}>
            <FaUsers /> <span>Sistemdeki Üyeler</span>
          </div>
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
                  {users.length > 0 ? users.map(user => (
                    <tr key={user.id}>
                      <td className="video-name">{user.name}</td>
                      <td>{user.parent_email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Yönetici' : 'Üye'}
                        </span>
                      </td>
                      <td className="text-center">
                        <button 
                          onClick={() => deleteUser(user.id)} 
                          className="admin-btn danger-sm"
                        >
                          <FaTrashAlt /> Sil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="empty-row">Henüz kullanıcı bulunmuyor.</td>
                    </tr>
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