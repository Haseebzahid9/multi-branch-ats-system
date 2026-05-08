import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-emblem"><i className="fas fa-briefcase"></i></div>
            <div>
              <div className="logo-njp">HireTrack ATS</div>
              <div className="logo-gov">Multi-Branch Recruitment System</div>
            </div>
          </div>
          <p>Pakistan's smart multi-branch recruitment and applicant tracking system — connecting talent with opportunity across Islamabad, Lahore, Karachi and Remote.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>For Job Seekers</h4>
          <ul>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/jobs">Browse Categories</Link></li>
            <li><Link to="/jobs">Job Alerts</Link></li>
            <li><Link to="/signup">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About HireTrack</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get In Touch</h4>
          <ul>
            <li><a href="tel:03184006367"><i className="fas fa-phone"></i> 03184006367</a></li>
            <li><a href="mailto:haseebzahid4998@gmail.com"><i className="fas fa-envelope"></i> haseebzahid4998@gmail.com</a></li>
            <li><span><i className="fas fa-location-dot"></i> Islamabad, Pakistan</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 HireTrack ATS — Multi-Branch Recruitment System. All rights reserved.</p>
          <p>Developed by <strong>Haseeb Zahid</strong></p>
        </div>
      </div>
    </footer>
  );
}
