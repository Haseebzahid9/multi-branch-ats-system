import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnic: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error('Please fill all required fields');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
        cnic: form.cnic, phone: form.phone,
      });
      login(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <div className="auth-logo-wrap">
              <div className="auth-emblem"><i className="fas fa-briefcase"></i></div>
              <div>
                <div className="auth-brand-name">Job Portal ATS</div>
                <div className="auth-brand-toggle">
                  <span className="dot green"></span>
                  <span className="dot-line"></span>
                  <span className="dot green"></span>
                  <span className="auth-brand-gov">Multi-Branch Recruitment</span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="auth-tagline">Join the<br/><span>Future of Hiring</span></h2>
          <p className="auth-tagline-sub">Create your account and start your career journey with Job Portal ATS — it's completely free.</p>

          <div className="auth-mini-stats">
            <div className="mstat"><span>50+</span><small>Active Jobs</small></div>
            <div className="mstat"><span>4</span><small>Branches</small></div>
            <div className="mstat"><span>1,200+</span><small>Applicants</small></div>
          </div>

          <div className="auth-features">
            {[
              { icon: 'fa-shield-halved', text: 'Secure JWT Authentication' },
              { icon: 'fa-briefcase', text: 'Access to All Branch Jobs' },
              { icon: 'fa-bolt', text: 'Real-time Application Tracking' },
            ].map((f, i) => (
              <div className="auth-feat" key={i}>
                <div className="auth-feat-icon"><i className={`fas ${f.icon}`}></i></div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div className="auth-form-title-row">
              <div>
                <h2>Create Account</h2>
                <p>Join Job Portal ATS today — it's free</p>
              </div>
              <div className="auth-small-emblem"><i className="fas fa-briefcase"></i></div>
            </div>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input name="name" value={form.name} onChange={handle} placeholder="Your full name"/>
            </div>

            <div className="form-group">
              <label>Email Address <span className="req">*</span></label>
              <div className="input-wrap">
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com"/>
                <span className="input-icon-right"><i className="fas fa-envelope"></i></span>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="03xxxxxxxxx" type="tel"/>
            </div>

            <div className="form-group">
              <label>CNIC <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input name="cnic" value={form.cnic} onChange={handle} placeholder="xxxxx-xxxxxxx-x"/>
            </div>

            <div className="auth-pass-row">
              <div className="form-group">
                <label>Password <span className="req">*</span></label>
                <div className="input-wrap">
                  <input name="password" value={form.password} onChange={handle} type={showPass ? 'text' : 'password'} placeholder="Min 6 chars"/>
                  <button type="button" className="input-icon-right btn-ghost" onClick={() => setShowPass(!showPass)}>
                    <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm <span className="req">*</span></label>
                <div className="input-wrap">
                  <input name="confirmPassword" value={form.confirmPassword} onChange={handle} type={showConfirm ? 'text' : 'password'} placeholder="Repeat"/>
                  <button type="button" className="input-icon-right btn-ghost" onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Creating...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <div className="auth-bottom-links">
            <Link to="/"><i className="fas fa-home"></i><span>Home</span></Link>
            <Link to="/signin"><i className="fas fa-sign-in-alt"></i><span>Sign In</span></Link>
            <a href="mailto:haseeb4998@gmail.com"><i className="fas fa-circle-question"></i><span>Help</span></a>
          </div>

          <div className="auth-help-bar">
            <i className="fas fa-circle-info"></i>
            <div>
              <div>Need Help?</div>
              <div>haseeb4998@gmail.com &nbsp;•&nbsp; 03184006367</div>
            </div>
          </div>

          <div className="auth-copyright">© 2026 Job Portal ATS — Developed by Haseeb Zahid</div>
        </div>
      </div>
    </div>
  );
}
