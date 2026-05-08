import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AdminDashboard.css';

const EMPTY = { title:'', description:'', department:'', branch:'', seats:'', requirements:'', qualifications:'', salary:'', jobType:'Full-time', deadline:'' };

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/jobs?active=false').then(r => { setJobs(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (j) => { setEditing(j._id); setForm({ ...j, deadline: j.deadline?.slice(0,10) || '' }); setShowModal(true); };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/jobs/${editing}`, form);
      else await api.post('/jobs', form);
      toast.success(editing ? 'Job updated!' : 'Job created!');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this job?')) return;
    try { await api.delete(`/jobs/${id}`); toast.success('Job deactivated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-dash page-content">
      <div className="container">
        <div className="admin-header">
          <h1><i className="fas fa-briefcase"></i> Manage Jobs</h1>
          <button className="btn btn-green" onClick={openCreate}><i className="fas fa-plus"></i> Post New Job</button>
        </div>

        <div className="card">
          {loading ? <div className="loading-full" style={{minHeight:'200px'}}><div className="spinner"></div></div>
          : jobs.length === 0 ? <div className="empty-state"><i className="fas fa-briefcase"></i><h3>No jobs yet</h3></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Title</th><th>Department</th><th>Branch</th><th>Seats</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j._id}>
                      <td><strong>{j.title}</strong></td>
                      <td className="text-muted text-sm">{j.department}</td>
                      <td><span className="badge badge-gray">{j.branch}</span></td>
                      <td>{j.seats}</td>
                      <td className="text-sm text-muted">{new Date(j.deadline).toLocaleDateString('en-PK')}</td>
                      <td><span className={`badge ${j.isActive ? 'badge-green' : 'badge-red'}`}>{j.isActive ? 'Active' : 'Closed'}</span></td>
                      <td>
                        <div className="flex-gap">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(j)}><i className="fas fa-edit"></i></button>
                          {j.isActive && <button className="btn btn-danger btn-sm" onClick={() => deactivate(j._id)}><i className="fas fa-times"></i></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            <h2 className="modal-title">{editing ? 'Edit Job' : 'Post New Job'}</h2>
            <form onSubmit={save}>
              <div className="form-row-2">
                <div className="form-group"><label>Job Title <span className="req">*</span></label><input name="title" value={form.title} onChange={handle} required/></div>
                <div className="form-group"><label>Department <span className="req">*</span></label><input name="department" value={form.department} onChange={handle} required/></div>
              </div>
              <div className="form-row-2">
                <div className="form-group"><label>Branch <span className="req">*</span></label>
                  <select name="branch" value={form.branch} onChange={handle} required>
                    <option value="">Select</option>
                    {['Islamabad','Lahore','Karachi','Remote'].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Job Type</label>
                  <select name="jobType" value={form.jobType} onChange={handle}>
                    {['Full-time','Part-time','Contract','Internship'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group"><label>Available Seats <span className="req">*</span></label><input name="seats" type="number" min="1" value={form.seats} onChange={handle} required/></div>
                <div className="form-group"><label>Salary Range</label><input name="salary" value={form.salary} onChange={handle} placeholder="e.g. PKR 80,000 - 120,000"/></div>
              </div>
              <div className="form-group"><label>Application Deadline <span className="req">*</span></label><input name="deadline" type="date" value={form.deadline} onChange={handle} required/></div>
              <div className="form-group"><label>Description <span className="req">*</span></label><textarea name="description" rows="3" value={form.description} onChange={handle} required/></div>
              <div className="form-group"><label>Requirements <span className="req">*</span></label><textarea name="requirements" rows="3" value={form.requirements} onChange={handle} required/></div>
              <div className="form-group"><label>Qualifications</label><textarea name="qualifications" rows="2" value={form.qualifications} onChange={handle}/></div>
              <button type="submit" className="btn btn-green btn-full" disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : <><i className="fas fa-save"></i> {editing ? 'Update Job' : 'Post Job'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
