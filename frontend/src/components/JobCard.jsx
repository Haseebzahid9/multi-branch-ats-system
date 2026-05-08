import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const branchIcon = { Islamabad: 'fa-landmark', Lahore: 'fa-city', Karachi: 'fa-water', Remote: 'fa-wifi' };

export default function JobCard({ job }) {
  const deadline = new Date(job.deadline);
  const isExpired = deadline < new Date();
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="job-icon">
          <i className={`fas ${branchIcon[job.branch] || 'fa-briefcase'}`}></i>
        </div>
        <div className="job-card-badges">
          <span className={`badge ${job.jobType === 'Full-time' ? 'badge-green' : job.jobType === 'Contract' ? 'badge-yellow' : 'badge-blue'}`}>
            {job.jobType}
          </span>
          {!isExpired && daysLeft <= 7 && <span className="badge badge-red">Closing Soon</span>}
        </div>
      </div>

      <h3 className="job-title">{job.title}</h3>
      <p className="job-dept"><i className="fas fa-building"></i>{job.department}</p>

      <div className="job-meta">
        <span><i className={`fas ${branchIcon[job.branch] || 'fa-location-dot'}`}></i>{job.branch}</span>
        <span><i className="fas fa-chair"></i>{job.seats} seat{job.seats !== 1 ? 's' : ''}</span>
        {job.salary && <span><i className="fas fa-money-bill-wave"></i>{job.salary}</span>}
      </div>

      <div className="job-card-footer">
        <span className={`deadline ${isExpired ? 'expired' : ''}`}>
          <i className="fas fa-calendar-alt"></i>
          {isExpired ? 'Closed' : `${daysLeft}d left`}
        </span>
        <Link to={`/jobs/${job._id}`} className="btn btn-green btn-sm">
          Apply Now
        </Link>
      </div>
    </div>
  );
}
