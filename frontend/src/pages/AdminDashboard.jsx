import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0, pending: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications'),
      api.get('/interviews'),
    ]).then(([jobs, apps, ivs]) => {
      setStats({
        jobs: jobs.data.filter(j => j.isActive).length,
        applications: apps.data.length,
        interviews: ivs.data.length,
        pending: apps.data.filter(a => a.status === 'Submitted').length,
      });
      setRecentApps(apps.data.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/admin/jobs', icon: 'fa-briefcase', label: 'Manage Jobs', color: 'green', count: stats.jobs },
    { to: '/admin/applications', icon: 'fa-file-alt', label: 'Applications', color: 'blue', count: stats.applications },
    { to: '/admin/interviews', icon: 'fa-calendar-check', label: 'Interviews', color: 'purple', count: stats.interviews },
    { to: '/admin/branches', icon: 'fa-building', label: 'Branches', color: 'yellow', count: null },
  ];

  if (loading) return <div className="loading-full page-content"><div className="spinner"></div></div>;

  return (
    <div className="admin-dash page-content">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="text-muted" style={{ marginTop: '6px' }}>
              Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
              &nbsp;·&nbsp;
              <span className="badge badge-green">{user?.role}</span>
            </p>
          </div>
          <Link to="/admin/jobs" className="btn btn-green"><i className="fas fa-plus"></i> Post New Job</Link>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label: 'Active Jobs', value: stats.jobs, icon: 'fa-briefcase', color: 'green' },
            { label: 'Total Applications', value: stats.applications, icon: 'fa-file-alt', color: 'blue' },
            { label: 'Pending Review', value: stats.pending, icon: 'fa-clock', color: 'yellow' },
            { label: 'Interviews Scheduled', value: stats.interviews, icon: 'fa-calendar-check', color: 'purple' },
          ].map((s, i) => (
            <div className={`astat astat-${s.color}`} key={i}>
              <div className="astat-icon"><i className={`fas ${s.icon}`}></i></div>
              <div>
                <span className="astat-num">{s.value}</span>
                <span className="astat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick">
          {quickLinks.map((q, i) => (
            <Link to={q.to} className={`ql-card ql-${q.color}`} key={i}>
              <div className="ql-icon"><i className={`fas ${q.icon}`}></i></div>
              <div className="ql-text">
                <span className="ql-label">{q.label}</span>
                {q.count !== null && <span className="ql-count">{q.count} total</span>}
              </div>
              <i className="fas fa-arrow-right ql-arrow"></i>
            </Link>
          ))}
        </div>

        {/* Recent Applications */}
        <h2 className="admin-section-title mt-32">Recent Applications</h2>
        <div className="card">
          {recentApps.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h3>No applications yet</h3>
              <p>Applications submitted by candidates will appear here</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Branch</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map(app => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.candidateId?.name || 'N/A'}</div>
                        <div className="text-muted text-xs">{app.candidateId?.email}</div>
                      </td>
                      <td className="text-sm">{app.jobId?.title}</td>
                      <td><span className="badge badge-gray">{app.jobId?.branch}</span></td>
                      <td className="text-muted text-sm">{new Date(app.appliedDate).toLocaleDateString('en-PK')}</td>
                      <td><StatusBadge s={app.status}/></td>
                      <td>
                        <Link to="/admin/applications" className="btn btn-ghost btn-sm">
                          <i className="fas fa-eye"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    'Submitted': 'badge-gray',
    'Under Review': 'badge-yellow',
    'Shortlisted': 'badge-green',
    'Interview Scheduled': 'badge-blue',
    'Rejected': 'badge-red',
    'Selected': 'badge-green',
  };
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
}
