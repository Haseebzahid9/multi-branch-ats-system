import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './CandidateDashboard.css';

const STATUS_BADGE = {
  'Submitted':            'badge-gray',
  'Under Review':         'badge-yellow',
  'Shortlisted':          'badge-green',
  'Interview Scheduled':  'badge-blue',
  'Rejected':             'badge-red',
  'Selected':             'badge-green',
};

const STATUS_ICON = {
  'Submitted':            'fa-paper-plane',
  'Under Review':         'fa-magnifying-glass',
  'Shortlisted':          'fa-star',
  'Interview Scheduled':  'fa-calendar-check',
  'Rejected':             'fa-times-circle',
  'Selected':             'fa-trophy',
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('applications');

  useEffect(() => {
    Promise.all([
      api.get('/applications/my'),
      api.get('/interviews/my'),
    ]).then(([apps, ivs]) => {
      setApplications(apps.data);
      setInterviews(ivs.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Applied', value: applications.length, icon: 'fa-paper-plane', color: 'blue' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, icon: 'fa-magnifying-glass', color: 'yellow' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length, icon: 'fa-star', color: 'green' },
    { label: 'Interviews', value: interviews.length, icon: 'fa-calendar-check', color: 'purple' },
  ];

  if (loading) return <div className="loading-full page-content"><div className="spinner"></div></div>;

  return (
    <div className="cd-page page-content">
      <div className="container">
        {/* Header */}
        <div className="cd-header">
          <div className="cd-welcome">
            <div className="cd-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1>Welcome back, <span>{user.name?.split(' ')[0]}</span></h1>
              <p><i className="fas fa-envelope"></i> {user.email} &nbsp;•&nbsp; <span className="badge badge-green">{user.role}</span></p>
            </div>
          </div>
          <Link to="/jobs" className="btn btn-green btn-sm"><i className="fas fa-search"></i> Browse Jobs</Link>
        </div>

        {/* Stats */}
        <div className="cd-stats">
          {stats.map((s, i) => (
            <div className={`cd-stat cd-stat-${s.color}`} key={i}>
              <div className="cd-stat-icon"><i className={`fas ${s.icon}`}></i></div>
              <div>
                <span className="cd-stat-num">{s.value}</span>
                <span className="cd-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="cd-tabs">
          <button className={tab === 'applications' ? 'active' : ''} onClick={() => setTab('applications')}>
            <i className="fas fa-list"></i> My Applications ({applications.length})
          </button>
          <button className={tab === 'interviews' ? 'active' : ''} onClick={() => setTab('interviews')}>
            <i className="fas fa-calendar"></i> Scheduled Interviews ({interviews.length})
          </button>
        </div>

        {/* Applications Table */}
        {tab === 'applications' && (
          <div className="card">
            {applications.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-briefcase"></i>
                <h3>No applications yet</h3>
                <p>Start by browsing available jobs and submitting your application</p>
                <Link to="/jobs" className="btn btn-green btn-sm mt-16"><i className="fas fa-search"></i> Browse Jobs</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Job Title</th><th>Department</th><th>Branch</th><th>Applied</th><th>Status</th><th>Resume</th></tr></thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td><Link to={`/jobs/${app.jobId?._id}`} className="text-green">{app.jobId?.title || 'N/A'}</Link></td>
                        <td className="text-muted">{app.jobId?.department}</td>
                        <td><span className="badge badge-gray">{app.jobId?.branch}</span></td>
                        <td className="text-muted text-sm">{new Date(app.appliedDate).toLocaleDateString('en-PK')}</td>
                        <td>
                          <span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>
                            <i className={`fas ${STATUS_ICON[app.status] || 'fa-circle'}`}></i>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.resumeURL && (
                            <a href={app.resumeURL} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                              <i className="fas fa-file-pdf"></i> View
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Interviews Tab */}
        {tab === 'interviews' && (
          <div className="cd-interviews">
            {interviews.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar"></i>
                <h3>No interviews scheduled</h3>
                <p>Keep applying to get interview invitations</p>
              </div>
            ) : (
              <div className="grid-2">
                {interviews.map(iv => (
                  <div className="card iv-card" key={iv._id}>
                    <div className="iv-header">
                      <div className="iv-icon"><i className="fas fa-calendar-check"></i></div>
                      <span className={`badge ${iv.status === 'Scheduled' ? 'badge-blue' : iv.status === 'Completed' ? 'badge-green' : 'badge-red'}`}>{iv.status}</span>
                    </div>
                    <h3>{iv.jobId?.title}</h3>
                    <p className="text-muted text-sm">{iv.jobId?.department} · {iv.jobId?.branch}</p>
                    <div className="iv-details">
                      <div><i className="fas fa-calendar"></i><span>{new Date(iv.interviewDate).toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span></div>
                      <div><i className="fas fa-clock"></i><span>{iv.interviewTime}</span></div>
                      <div><i className="fas fa-location-dot"></i><span>{iv.location}</span></div>
                    </div>
                    {iv.message && <div className="iv-note"><i className="fas fa-sticky-note"></i>{iv.message}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
