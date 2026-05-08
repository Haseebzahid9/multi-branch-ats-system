import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const resumeRef = useRef();
  const clRef = useRef();

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => { setJob(r.data); setLoading(false); })
      .catch(() => { toast.error('Job not found'); setLoading(false); });
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to apply'); navigate('/signin'); return; }
    if (!resume) { toast.error('Resume is required'); return; }

    setApplying(true);
    const fd = new FormData();
    fd.append('jobId', id);
    fd.append('resume', resume);
    if (coverLetter) fd.append('coverLetter', coverLetter);

    try {
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully!');
      setShowModal(false);
      setResume(null);
      setCoverLetter(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally { setApplying(false); }
  };

  if (loading) return <div className="loading-full page-content"><div className="spinner"></div></div>;
  if (!job) return <div className="page-content empty-state"><h3>Job not found</h3><Link to="/jobs">Back to Jobs</Link></div>;

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="job-detail page-content">
      <div className="container">
        <Link to="/jobs" className="back-link"><i className="fas fa-arrow-left"></i> Back to Jobs</Link>

        <div className="jd-grid">
          {/* Main content */}
          <div className="jd-main">
            <div className="jd-header card">
              <div className="jd-header-top">
                <div className="jd-icon"><i className="fas fa-briefcase"></i></div>
                <div className="jd-header-badges">
                  <span className={`badge ${job.jobType === 'Full-time' ? 'badge-green' : 'badge-yellow'}`}>{job.jobType}</span>
                  {isExpired && <span className="badge badge-red">Closed</span>}
                </div>
              </div>
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-meta-row">
                <span><i className="fas fa-building"></i> {job.department}</span>
                <span><i className="fas fa-location-dot"></i> {job.branch}</span>
                <span><i className="fas fa-chair"></i> {job.seats} seats</span>
                {job.salary && <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>}
              </div>
            </div>

            <div className="card mt-16">
              <h2 className="jd-sec-title"><i className="fas fa-align-left"></i> Job Description</h2>
              <p className="jd-text">{job.description}</p>
            </div>

            <div className="card mt-16">
              <h2 className="jd-sec-title"><i className="fas fa-list-check"></i> Requirements</h2>
              <p className="jd-text">{job.requirements}</p>
            </div>

            {job.qualifications && (
              <div className="card mt-16">
                <h2 className="jd-sec-title"><i className="fas fa-graduation-cap"></i> Qualifications</h2>
                <p className="jd-text">{job.qualifications}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="jd-sidebar">
            <div className="card jd-apply-card">
              <h3>Apply for This Position</h3>
              {job.postedBy && <p className="text-muted text-sm">Posted by: {job.postedBy.name}</p>}
              <div className="jd-deadline">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <span>Deadline</span>
                  <strong>{new Date(job.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
              </div>
              {isExpired ? (
                <div className="badge badge-red" style={{ justifyContent: 'center', padding: '10px' }}>Applications Closed</div>
              ) : (
                <button className="btn btn-green btn-full btn-lg" onClick={() => {
                  if (!user) { toast.error('Please sign in to apply'); navigate('/signin'); }
                  else setShowModal(true);
                }}>
                  <i className="fas fa-paper-plane"></i> Apply Now
                </button>
              )}
            </div>

            <div className="card mt-16">
              <h3 className="text-sm" style={{ marginBottom: '14px', color: 'var(--text-secondary)' }}>JOB OVERVIEW</h3>
              <div className="jd-overview">
                <div><i className="fas fa-tag"></i><div><small>Job Type</small><span>{job.jobType}</span></div></div>
                <div><i className="fas fa-map-marker-alt"></i><div><small>Branch</small><span>{job.branch}</span></div></div>
                <div><i className="fas fa-users"></i><div><small>Openings</small><span>{job.seats}</span></div></div>
                <div><i className="fas fa-money-bill"></i><div><small>Salary</small><span>{job.salary || 'Competitive'}</span></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            <h2 className="modal-title"><i className="fas fa-paper-plane"></i> Apply: {job.title}</h2>
            <p className="text-muted text-sm mb-16">{job.department} · {job.branch}</p>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Resume (PDF) <span className="req">*</span></label>
                <div className="file-upload" onClick={() => resumeRef.current.click()}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{resume ? resume.name : 'Click to upload resume (PDF)'}</span>
                </div>
                <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => setResume(e.target.files[0])}/>
              </div>
              <div className="form-group">
                <label>Cover Letter (PDF/DOCX) <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                <div className="file-upload" onClick={() => clRef.current.click()}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{coverLetter ? coverLetter.name : 'Click to upload cover letter (optional)'}</span>
                </div>
                <input ref={clRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => setCoverLetter(e.target.files[0])}/>
              </div>
              <button type="submit" className="btn btn-green btn-full btn-lg" disabled={applying}>
                {applying ? <><span className="spinner"></span> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Application</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
