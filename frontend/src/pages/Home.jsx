import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import './Home.css';

const FEATURES = [
  { icon: 'fa-shield-halved', title: 'Verified Postings', desc: 'All job listings are verified and approved by our recruitment team before going live.' },
  { icon: 'fa-bell', title: 'Instant Alerts, Apply Fast', desc: 'Get real-time notifications for new opportunities that match your profile and skills.' },
  { icon: 'fa-lock', title: 'Transparent CV/Profile', desc: 'Build a comprehensive profile visible to verified recruiters across all branches.' },
  { icon: 'fa-crosshairs', title: 'Easy Apply', desc: 'Simple application process — upload your resume and apply in seconds.' },
  { icon: 'fa-user-tie', title: 'Merit-Based Hiring', desc: "Pakistan's first fully transparent merit-based multi-branch recruitment platform." },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Our dedicated help desk is available around the clock to assist you.' },
];

const TESTIMONIALS = [
  { name: 'Ali Ahmed', role: 'Software Engineer', dept: 'Islamabad Branch', quote: 'Job Portal ATS made my job search incredibly easy. The application process was smooth and I got hired within 2 weeks!' },
  { name: 'Fatima Khan', role: 'Project Manager', dept: 'Lahore Branch', quote: "I was able to track my application status in real-time and received timely notifications. The portal's interface is amazing!" },
  { name: 'Hassan Raza', role: 'UI/UX Designer', dept: 'Remote', quote: 'Finally a merit-based system that values qualifications and experience. No more physical applications and long queues.' },
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [stats] = useState({ jobs: 50, depts: 4, users: '1,200' });
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs?active=true').then(r => setJobs(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('branch', location);
    if (jobType) params.set('jobType', jobType);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-dots"></div>
        <div className="container hero-inner">
          <div className="hero-left">
            <div className="section-badge"><i className="fas fa-briefcase"></i> Pakistan's #1 ATS Platform</div>
            <h1 className="hero-title">
              Your Gateway to<br/>
              <span className="hero-hl">Top Tech</span><br/>
              <span className="hero-hl">Careers</span>
            </h1>
            <p className="hero-desc">
              Discover hundreds of verified job opportunities across Islamabad, Lahore, Karachi and Remote.
              Build your career with transparency, trust, and excellence.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn-primary btn-lg">
                <i className="fas fa-search"></i> Explore All Jobs
              </Link>
              <button className="btn btn-outline btn-lg" onClick={handleSearch}>
                Quick Search <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="hero-stats">
              <div className="hstat"><span className="hstat-num">{stats.jobs}+</span><span className="hstat-label">Active Jobs</span></div>
              <div className="hstat-div"></div>
              <div className="hstat"><span className="hstat-num">{stats.depts}+</span><span className="hstat-label">Branches</span></div>
              <div className="hstat-div"></div>
              <div className="hstat"><span className="hstat-num">{stats.users}+</span><span className="hstat-label">Applicants</span></div>
            </div>
          </div>
          <div className="hero-right">
            {[
              { icon: 'fa-shield-halved', title: 'Verified Jobs', sub: 'All postings are authenticated' },
              { icon: 'fa-bell', title: 'Instant Alerts', sub: 'Get notified immediately' },
              { icon: 'fa-crosshairs', title: 'Easy Apply', sub: 'Simple application process' },
              { icon: 'fa-trophy', title: 'Career Growth', sub: 'Build your future' },
              { icon: 'fa-circle-question', title: 'Need Help?', sub: 'Email: haseeb4998@gmail.com\nPhone: 03184006367' },
            ].map((f, i) => (
              <div className={`hcard hcard-${i}`} key={i}>
                <div className="hcard-icon"><i className={`fas ${f.icon}`}></i></div>
                <div>
                  <div className="hcard-title">{f.title}</div>
                  <div className="hcard-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JOB SEARCH ===== */}
      <section className="search-section">
        <div className="container">
          <div className="search-head">
            <h2 className="search-big-title">JOB SEARCH</h2>
            <p>Search from hundreds of verified job opportunities across all branches</p>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-field">
                <i className="fas fa-search"></i>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, keywords, or department"/>
              </div>
              <div className="search-field">
                <i className="fas fa-location-dot"></i>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or branch (Islamabad, Lahore...)"/>
              </div>
              <div className="search-field">
                <i className="fas fa-briefcase"></i>
                <select value={jobType} onChange={e => setJobType(e.target.value)}>
                  <option value="">Job Type</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
            <div className="search-row2">
              <div className="search-field">
                <i className="fas fa-chart-bar"></i>
                <select><option value="">Experience Level</option><option>Fresh</option><option>1-2 years</option><option>3-5 years</option><option>5+ years</option></select>
              </div>
              <div className="search-field">
                <i className="fas fa-coins"></i>
                <select><option value="">Salary Range</option><option>30k-50k</option><option>50k-100k</option><option>100k-200k</option><option>200k+</option></select>
              </div>
              <button type="submit" className="btn btn-primary search-submit-btn">
                <i className="fas fa-search"></i> Search Jobs
              </button>
            </div>
            <div className="popular-tags">
              <span>Popular:</span>
              {['Software Engineer', 'UI/UX Designer', 'Data Analyst', 'DevOps', 'Project Manager'].map(t => (
                <button key={t} type="button" className="tag-btn" onClick={() => { setSearch(t); navigate(`/jobs?search=${t}`); }}>{t}</button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ===== LATEST JOBS ===== */}
      <section className="latest-jobs section">
        <div className="container">
          <div className="flex-between mb-32">
            <div>
              <div className="section-badge" style={{ marginBottom: '14px' }}><i className="fas fa-fire"></i> Fresh Opportunities</div>
              <h2 className="section-title">Latest <span className="hl">Job Openings</span></h2>
              <p className="text-muted text-sm" style={{ marginTop: '8px' }}>Fresh opportunities posted recently across all branches</p>
            </div>
            <Link to="/jobs" className="btn btn-green">View All Jobs <i className="fas fa-arrow-right"></i></Link>
          </div>
          {jobs.length > 0 ? (
            <div className="grid-3">{jobs.map(j => <JobCard key={j._id} job={j}/>)}</div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-briefcase"></i>
              <h3>No jobs posted yet</h3>
              <p>Check back soon for new opportunities</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section section">
        <div className="container">
          <div className="text-center mb-32">
            <div className="section-badge" style={{ marginBottom: '16px' }}><i className="fas fa-star"></i> Why Us</div>
            <h2 className="section-title">Why Choose <span className="hl">Job Portal ATS?</span></h2>
            <p className="text-muted" style={{ maxWidth: '560px', margin: '12px auto 0' }}>
              The most efficient multi-branch recruitment and applicant tracking system in Pakistan
            </p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon"><i className={`fas ${f.icon}`}></i></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials section" id="success">
        <div className="container">
          <div className="text-center mb-32">
            <div className="section-badge" style={{ marginBottom: '16px' }}><i className="fas fa-quote-left"></i> Success Stories</div>
            <h2 className="section-title"><span className="hl">Success</span> Stories</h2>
            <p className="text-muted" style={{ maxWidth: '520px', margin: '12px auto 0' }}>
              Hear from those who found their dream jobs through Job Portal ATS
            </p>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-top">
                  <div className="stars">{'★'.repeat(5)}</div>
                  <i className="fas fa-quote-right testi-quote"></i>
                </div>
                <p>&quot;{t.quote}&quot;</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                    <span>{t.dept}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
