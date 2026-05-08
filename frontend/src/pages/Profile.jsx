import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', cnic: user?.cnic || '', branch: user?.branch || '' });
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('profile');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) return toast.error('Passwords do not match');
    if (password.newPass.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.put('/auth/profile', { password: password.newPass });
      toast.success('Password changed!');
      setPassword({ current: '', newPass: '', confirm: '' });
    } catch (err) { toast.error('Failed to change password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="profile-page page-content">
      <div className="container">
        <div className="profile-header card">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>{user?.name}</h1>
            <p className="text-muted">{user?.email}</p>
            <div className="flex-gap mt-8">
              <span className="badge badge-green">{user?.role}</span>
              {user?.branch && <span className="badge badge-gray"><i className="fas fa-location-dot"></i> {user.branch}</span>}
            </div>
          </div>
        </div>

        <div className="cd-tabs mt-24">
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><i className="fas fa-user"></i> Profile Info</button>
          <button className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}><i className="fas fa-lock"></i> Change Password</button>
        </div>

        {tab === 'profile' && (
          <div className="card mt-16">
            <h2 className="jd-sec-title"><i className="fas fa-user-edit"></i> Update Profile</h2>
            <form onSubmit={saveProfile}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Your full name"/>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="03xxxxxxxxx"/>
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>CNIC Number</label>
                  <input name="cnic" value={form.cnic} onChange={handle} placeholder="xxxxx-xxxxxxx-x"/>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={form.branch} onChange={handle}>
                    <option value="">Select Branch</option>
                    {['Islamabad', 'Lahore', 'Karachi', 'Remote'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email Address (read-only)</label>
                <input value={user?.email} readOnly style={{ opacity: .6 }}/>
              </div>
              <button type="submit" className="btn btn-green" disabled={loading}>
                {loading ? <><span className="spinner"></span> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="card mt-16">
            <h2 className="jd-sec-title"><i className="fas fa-lock"></i> Change Password</h2>
            <form onSubmit={savePassword} style={{ maxWidth: '440px' }}>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={password.newPass} onChange={e => setPassword({...password, newPass: e.target.value})} placeholder="At least 6 characters"/>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} placeholder="Repeat new password"/>
              </div>
              <button type="submit" className="btn btn-green" disabled={loading}>
                {loading ? <><span className="spinner"></span> Saving...</> : <><i className="fas fa-save"></i> Change Password</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
