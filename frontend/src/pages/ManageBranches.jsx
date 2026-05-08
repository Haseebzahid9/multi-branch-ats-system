import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AdminDashboard.css';

const EMPTY = { branchName: '', location: '', manager: '', description: '' };

export default function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/branches').then(r => { setBranches(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (b) => { setEditing(b._id); setForm(b); setShowModal(true); };
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/branches/${editing}`, form);
      else await api.post('/branches', form);
      toast.success(editing ? 'Branch updated!' : 'Branch created!');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this branch?')) return;
    try { await api.delete(`/branches/${id}`); toast.success('Branch deactivated'); load(); }
    catch { toast.error('Failed'); }
  };

  const BRANCH_ICONS = { Islamabad: 'fa-landmark', Lahore: 'fa-city', Karachi: 'fa-water', Remote: 'fa-wifi' };

  return (
    <div className="admin-dash page-content">
      <div className="container">
        <div className="admin-header">
          <h1><i className="fas fa-building"></i> Manage Branches</h1>
          <button className="btn btn-green" onClick={openCreate}><i className="fas fa-plus"></i> Add Branch</button>
        </div>

        {loading ? <div className="loading-full"><div className="spinner"></div></div> : (
          <div className="grid-2">
            {branches.map(b => (
              <div className="card" key={b._id}>
                <div className="flex-between mb-16">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="iv-icon"><i className={`fas ${BRANCH_ICONS[b.branchName] || 'fa-building'}`}></i></div>
                    <h3>{b.branchName}</h3>
                  </div>
                  <div className="flex-gap">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}><i className="fas fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm" onClick={() => deactivate(b._id)}><i className="fas fa-times"></i></button>
                  </div>
                </div>
                <div className="iv-details">
                  <div><i className="fas fa-location-dot"></i><span>{b.location}</span></div>
                  {b.manager && <div><i className="fas fa-user-tie"></i><span>Manager: {b.manager}</span></div>}
                  {b.description && <div><i className="fas fa-info-circle"></i><span>{b.description}</span></div>}
                </div>
              </div>
            ))}
            {branches.length === 0 && <div className="empty-state"><i className="fas fa-building"></i><h3>No branches yet</h3></div>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            <h2 className="modal-title">{editing ? 'Edit Branch' : 'Add Branch'}</h2>
            <form onSubmit={save}>
              <div className="form-group"><label>Branch Name <span className="req">*</span></label><input name="branchName" value={form.branchName} onChange={handle} required/></div>
              <div className="form-group"><label>Location <span className="req">*</span></label><input name="location" value={form.location} onChange={handle} required placeholder="City, Address"/></div>
              <div className="form-group"><label>Branch Manager</label><input name="manager" value={form.manager} onChange={handle} placeholder="Manager name"/></div>
              <div className="form-group"><label>Description</label><textarea name="description" rows="2" value={form.description} onChange={handle}/></div>
              <button type="submit" className="btn btn-green btn-full" disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : <><i className="fas fa-save"></i> {editing ? 'Update' : 'Create'} Branch</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
