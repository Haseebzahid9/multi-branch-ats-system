import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AdminDashboard.css';

const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];
const BADGE = { 'Submitted':'badge-gray', 'Under Review':'badge-yellow', 'Shortlisted':'badge-green', 'Interview Scheduled':'badge-blue', 'Rejected':'badge-red', 'Selected':'badge-green' };

export default function ManageApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', jobId: '' });
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [hrNotes, setHrNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showIntModal, setShowIntModal] = useState(false);
  const [intForm, setIntForm] = useState({ interviewDate: '', interviewTime: '', location: 'Online (Google Meet)', message: '' });

  const load = () => {
    const p = {};
    if (filter.status) p.status = filter.status;
    if (filter.jobId) p.jobId = filter.jobId;
    api.get('/applications', { params: p }).then(r => { setApps(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { api.get('/jobs').then(r => setJobs(r.data)); }, []);
  useEffect(load, [filter]);

  const updateStatus = async (appId) => {
    if (!newStatus) return toast.error('Select a status');
    setSaving(true);
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus, hrNotes });
      toast.success('Status updated & email sent!');
      setSelected(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const scheduleInterview = async (app) => {
    if (!intForm.interviewDate || !intForm.interviewTime) return toast.error('Date and time required');
    setSaving(true);
    try {
      await api.post('/interviews', {
        candidateId: app.candidateId?._id,
        jobId: app.jobId?._id,
        applicationId: app._id,
        ...intForm,
      });
      toast.success('Interview scheduled & email sent!');
      setShowIntModal(false); setSelected(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-dash page-content">
      <div className="container">
        <div className="admin-header">
          <h1><i className="fas fa-file-alt"></i> Manage Applications</h1>
          <span className="text-muted text-sm">{apps.length} application{apps.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Filters */}
        <div className="jobs-filters card mb-16" style={{ marginBottom: '20px' }}>
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filter.jobId} onChange={e => setFilter({ ...filter, jobId: e.target.value })}>
            <option value="">All Jobs</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title} ({j.branch})</option>)}
          </select>
          {(filter.status || filter.jobId) && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilter({ status: '', jobId: '' })}><i className="fas fa-times"></i> Clear</button>
          )}
        </div>

        <div className="card">
          {loading ? <div className="loading-full" style={{ minHeight: '200px' }}><div className="spinner"></div></div>
          : apps.length === 0 ? <div className="empty-state"><i className="fas fa-file-alt"></i><h3>No applications found</h3></div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Candidate</th><th>Job</th><th>Branch</th><th>Applied</th><th>Status</th><th>Resume</th><th>Actions</th></tr></thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app._id}>
                      <td>
                        <div className="fw-bold">{app.candidateId?.name}</div>
                        <div className="text-muted text-xs">{app.candidateId?.email}</div>
                        {app.candidateId?.phone && <div className="text-muted text-xs">{app.candidateId.phone}</div>}
                      </td>
                      <td className="text-sm">{app.jobId?.title}</td>
                      <td><span className="badge badge-gray">{app.jobId?.branch}</span></td>
                      <td className="text-muted text-sm">{new Date(app.appliedDate).toLocaleDateString('en-PK')}</td>
                      <td><span className={`badge ${BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                      <td>
                        {app.resumeURL && <a href={app.resumeURL} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><i className="fas fa-file-pdf"></i></a>}
                        {app.coverLetterURL && <a href={app.coverLetterURL} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><i className="fas fa-file-word"></i></a>}
                      </td>
                      <td>
                        <div className="flex-gap">
                          <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(app); setNewStatus(app.status); setHrNotes(app.hrNotes || ''); }}>
                            <i className="fas fa-edit"></i> Update
                          </button>
                          {(app.status === 'Shortlisted') && (
                            <button className="btn btn-green btn-sm" onClick={() => { setSelected(app); setShowIntModal(true); }}>
                              <i className="fas fa-calendar-plus"></i>
                            </button>
                          )}
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

      {/* Status update modal */}
      {selected && !showIntModal && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><i className="fas fa-times"></i></button>
            <h2 className="modal-title">Update Application Status</h2>
            <p className="text-muted text-sm mb-16">{selected.candidateId?.name} · {selected.jobId?.title}</p>
            <div className="form-group">
              <label>New Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>HR Notes (internal)</label>
              <textarea rows="3" value={hrNotes} onChange={e => setHrNotes(e.target.value)} placeholder="Internal notes..."/>
            </div>
            <div className="flex-gap">
              <button className="btn btn-green" onClick={() => updateStatus(selected._id)} disabled={saving}>
                {saving ? <><span className="spinner"></span> Sending...</> : <><i className="fas fa-paper-plane"></i> Update & Notify</>}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule interview modal */}
      {selected && showIntModal && (
        <div className="modal-overlay" onClick={() => { setShowIntModal(false); setSelected(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowIntModal(false); setSelected(null); }}><i className="fas fa-times"></i></button>
            <h2 className="modal-title"><i className="fas fa-calendar-plus"></i> Schedule Interview</h2>
            <p className="text-muted text-sm mb-16">{selected.candidateId?.name} · {selected.jobId?.title}</p>
            <div className="form-row-2">
              <div className="form-group"><label>Interview Date <span className="req">*</span></label><input type="date" value={intForm.interviewDate} onChange={e => setIntForm({ ...intForm, interviewDate: e.target.value })}/></div>
              <div className="form-group"><label>Time <span className="req">*</span></label><input type="time" value={intForm.interviewTime} onChange={e => setIntForm({ ...intForm, interviewTime: e.target.value })}/></div>
            </div>
            <div className="form-group"><label>Location</label><input value={intForm.location} onChange={e => setIntForm({ ...intForm, location: e.target.value })} placeholder="Online (Google Meet)"/></div>
            <div className="form-group"><label>Message to Candidate</label><textarea rows="3" value={intForm.message} onChange={e => setIntForm({ ...intForm, message: e.target.value })} placeholder="Additional instructions..."/></div>
            <div className="flex-gap">
              <button className="btn btn-green" onClick={() => scheduleInterview(selected)} disabled={saving}>
                {saving ? <><span className="spinner"></span> Scheduling...</> : <><i className="fas fa-paper-plane"></i> Schedule & Notify</>}
              </button>
              <button className="btn btn-ghost" onClick={() => { setShowIntModal(false); setSelected(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
