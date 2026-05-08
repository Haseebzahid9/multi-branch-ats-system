import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AdminDashboard.css';

export default function ManageInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/interviews').then(r => { setInterviews(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const update = async () => {
    setSaving(true);
    try {
      await api.put(`/interviews/${selected._id}`, { status });
      toast.success('Interview updated!');
      setSelected(null); load();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const upcoming = interviews.filter(iv => new Date(iv.interviewDate) >= new Date() && iv.status === 'Scheduled');
  const past = interviews.filter(iv => new Date(iv.interviewDate) < new Date() || iv.status !== 'Scheduled');

  return (
    <div className="admin-dash page-content">
      <div className="container">
        <div className="admin-header">
          <h1><i className="fas fa-calendar-check"></i> Interviews</h1>
          <span className="text-muted text-sm">{interviews.length} total</span>
        </div>

        {loading ? <div className="loading-full"><div className="spinner"></div></div> : (
          <>
            <h2 className="admin-section-title"><i className="fas fa-clock text-green"></i> Upcoming ({upcoming.length})</h2>
            <div className="grid-2 mb-24">
              {upcoming.length === 0 ? <div className="card"><p className="text-muted text-sm">No upcoming interviews</p></div>
              : upcoming.map(iv => <IVCard iv={iv} key={iv._id} onEdit={() => { setSelected(iv); setStatus(iv.status); }}/>)}
            </div>

            <h2 className="admin-section-title">Past / Completed ({past.length})</h2>
            <div className="card">
              {past.length === 0 ? <div className="empty-state" style={{ padding: '30px' }}><p className="text-muted">No past interviews</p></div> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Candidate</th><th>Job</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {past.map(iv => (
                        <tr key={iv._id}>
                          <td>{iv.candidateId?.name}<div className="text-muted text-xs">{iv.candidateId?.email}</div></td>
                          <td className="text-sm">{iv.jobId?.title}</td>
                          <td className="text-muted text-sm">{new Date(iv.interviewDate).toLocaleDateString('en-PK')}</td>
                          <td className="text-muted text-sm">{iv.interviewTime}</td>
                          <td><span className={`badge ${iv.status==='Completed'?'badge-green':iv.status==='Cancelled'?'badge-red':'badge-blue'}`}>{iv.status}</span></td>
                          <td><button className="btn btn-ghost btn-sm" onClick={() => { setSelected(iv); setStatus(iv.status); }}><i className="fas fa-edit"></i></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><i className="fas fa-times"></i></button>
            <h2 className="modal-title">Update Interview Status</h2>
            <p className="text-muted text-sm mb-16">{selected.candidateId?.name} · {selected.jobId?.title}</p>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-gap">
              <button className="btn btn-green" onClick={update} disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : <><i className="fas fa-save"></i> Save</>}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IVCard({ iv, onEdit }) {
  return (
    <div className="card iv-card">
      <div className="iv-header">
        <div className="iv-icon"><i className="fas fa-calendar-check"></i></div>
        <button className="btn btn-ghost btn-sm" onClick={onEdit}><i className="fas fa-edit"></i></button>
      </div>
      <h3>{iv.jobId?.title}</h3>
      <p className="text-muted text-sm">{iv.candidateId?.name} · {iv.candidateId?.email}</p>
      <div className="iv-details">
        <div><i className="fas fa-calendar"></i><span>{new Date(iv.interviewDate).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
        <div><i className="fas fa-clock"></i><span>{iv.interviewTime}</span></div>
        <div><i className="fas fa-location-dot"></i><span>{iv.location}</span></div>
      </div>
      {iv.message && <div className="iv-note"><i className="fas fa-sticky-note"></i>{iv.message}</div>}
    </div>
  );
}
