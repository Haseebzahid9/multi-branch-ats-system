import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isHR } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-emblem">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="logo-text">
            <span className="logo-njp">Job Portal ATS</span>
            <span className="logo-gov">Multi-Branch Recruitment</span>
          </div>
        </Link>

        {/* Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/jobs" className={isActive('/jobs') ? 'active' : ''}>Find Jobs</Link></li>
          {!user && <li><a href="/#success" className="">Success Stories</a></li>}
          {user && !isHR && <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>My Applications</Link></li>}
          {isHR && <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Dashboard</Link></li>}
          {isHR && <li><Link to="/admin/jobs" className={isActive('/admin/jobs') ? 'active' : ''}>Manage Jobs</Link></li>}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/signin" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <button className="user-btn">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name hide-mobile">{user.name?.split(' ')[0]}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '.68rem', opacity: .7 }}></i>
              </button>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span className="badge badge-green" style={{ marginTop: '6px' }}>{user.role}</span>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile"><i className="fas fa-user"></i> My Profile</Link>
                {!isHR && <Link to="/dashboard"><i className="fas fa-th-list"></i> My Applications</Link>}
                {isHR && <Link to="/admin"><i className="fas fa-tachometer-alt"></i> Admin Panel</Link>}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Sign Out</button>
              </div>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>
    </nav>
  );
}
