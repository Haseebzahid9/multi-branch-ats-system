import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import './Jobs.css';

const BRANCHES = ['', 'Islamabad', 'Lahore', 'Karachi', 'Remote'];
const DEPARTMENTS = ['', 'Information Technology', 'Project Management', 'Design', 'Infrastructure', 'Analytics', 'Business', 'Administration', 'Healthcare', 'Education'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    branch: searchParams.get('branch') || '',
    department: searchParams.get('department') || '',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.branch) params.branch = filters.branch;
      if (filters.department) params.department = filters.department;
      const { data } = await api.get('/jobs', { params });
      setJobs(data);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [filters]);

  const handleFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    const sp = {};
    if (updated.search) sp.search = updated.search;
    if (updated.branch) sp.branch = updated.branch;
    if (updated.department) sp.department = updated.department;
    setSearchParams(sp);
  };

  return (
    <div className="jobs-page page-content">
      <div className="jobs-hero">
        <div className="container">
          <div className="section-badge"><i className="fas fa-briefcase"></i> Browse Opportunities</div>
          <h1 className="jobs-title">Find Your Perfect <span>Career Opportunity</span></h1>
          <p>Explore {jobs.length}+ verified positions across Pakistan</p>
        </div>
      </div>

      <div className="container jobs-body">
        {/* Filters */}
        <div className="jobs-filters">
          <div className="filter-search">
            <i className="fas fa-search"></i>
            <input
              placeholder="Search by title, department..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
            />
          </div>
          <select value={filters.branch} onChange={e => handleFilter('branch', e.target.value)}>
            {BRANCHES.map(b => <option key={b} value={b}>{b || 'All Branches'}</option>)}
          </select>
          <select value={filters.department} onChange={e => handleFilter('department', e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'All Departments'}</option>)}
          </select>
          {(filters.search || filters.branch || filters.department) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ search: '', branch: '', department: '' }); setSearchParams({}); }}>
              <i className="fas fa-times"></i> Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div className="jobs-results-header">
          <span className="text-muted text-sm">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</span>
        </div>

        {loading ? (
          <div className="loading-full"><div className="spinner"></div><span>Loading jobs...</span></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-briefcase"></i>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid-3">{jobs.map(j => <JobCard key={j._id} job={j}/>)}</div>
        )}
      </div>
    </div>
  );
}
