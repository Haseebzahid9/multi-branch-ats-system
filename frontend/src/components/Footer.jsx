import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Footer.css';

export default function Footer() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    setErrMsg('');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => setStatus('idle');

  return (
    <>
      {/* ===== PRE-FOOTER CTA ===== */}
      <section className="prefooter-cta">
        <div className="container">
          <div className="prefooter-inner">
            <div className="prefooter-left">
              <div className="section-badge"><i className="fas fa-rocket"></i> Get Started Today</div>
              <h2>Ready to Simplify Your<br/><span>Hiring Process?</span></h2>
              <p>Job Portal ATS helps companies streamline recruitment, manage candidates efficiently, and accelerate hiring across multiple branches with a modern applicant tracking experience.</p>
              <div className="prefooter-actions">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  <i className="fas fa-user-plus"></i> Get Started
                </Link>
                <Link to="/jobs" className="btn btn-outline btn-lg">
                  <i className="fas fa-search"></i> Explore Jobs
                </Link>
              </div>
            </div>
            <div className="prefooter-right">
              {[
                { icon: 'fa-briefcase', num: '50+', label: 'Active Jobs' },
                { icon: 'fa-building', num: '4', label: 'Branches' },
                { icon: 'fa-users', num: '1,200+', label: 'Applicants' },
                { icon: 'fa-star', num: '98%', label: 'Satisfaction' },
              ].map((s, i) => (
                <div className="prefooter-stat" key={i}>
                  <div className="prefooter-stat-icon"><i className={`fas ${s.icon}`}></i></div>
                  <div className="prefooter-stat-num">{s.num}</div>
                  <div className="prefooter-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="contact-section" id="contact">
        <div className="container">

          {/* Section Header */}
          <div className="contact-header">
            <div className="section-badge"><i className="fas fa-envelope"></i> Get In Touch</div>
            <h2 className="contact-title">We're Here to <span>Help You</span></h2>
            <p className="contact-sub">
              Have questions about your application or need technical support?<br/>
              Our team is ready to assist.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="contact-grid">

            {/* LEFT — Contact Info */}
            <div className="contact-info">
              <p className="contact-info-lead">
                Reach out to us through any of these channels and we'll get back to you as soon as possible.
              </p>

              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-item-body">
                    <span className="contact-item-label">Phone Support</span>
                    <a href="tel:03184006367" className="contact-item-value">03184006367</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-item-body">
                    <span className="contact-item-label">Email Address</span>
                    <a href="mailto:f230644@cfd.nu.edu.pk" className="contact-item-value">f230644@cfd.nu.edu.pk</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div className="contact-item-body">
                    <span className="contact-item-label">Office Address</span>
                    <span className="contact-item-value">Establishment Division,<br/>Islamabad, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Extra note */}
              <div className="contact-note">
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Response Time</strong>
                  <span>We typically respond within 24 hours on working days.</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div className="contact-form-wrap">

              {/* ── SUCCESS STATE ── */}
              {status === 'success' ? (
                <div className="contact-sent-screen">
                  <div className="contact-sent-icon">
                    <i className="fas fa-circle-check"></i>
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for reaching out. We've sent a confirmation to your email and our team will reply within <strong>24 hours</strong>.
                  </p>
                  <div className="contact-sent-meta">
                    <div><i className="fas fa-inbox"></i> Check your inbox for a confirmation email</div>
                    <div><i className="fas fa-clock"></i> Response time: within 24 working hours</div>
                    <div><i className="fas fa-phone"></i> Urgent? Call us at 03184006367</div>
                  </div>
                  <button className="btn btn-outline btn-lg" onClick={reset}>
                    <i className="fas fa-pen"></i> Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="contact-form-title">Send Us a Message</h3>

                  {/* Error banner */}
                  {status === 'error' && (
                    <div className="contact-error">
                      <i className="fas fa-triangle-exclamation"></i>
                      {errMsg}
                    </div>
                  )}

                  <form className="contact-form" onSubmit={submit}>
                    <div className="contact-row-2">
                      <div className="form-group">
                        <label>Full Name <span className="req">*</span></label>
                        <div className="input-wrap">
                          <i className="fas fa-user input-icon"></i>
                          <input
                            name="name"
                            value={form.name}
                            onChange={handle}
                            placeholder="Haseeb Zahid"
                            required
                            disabled={status === 'sending'}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Email Address <span className="req">*</span></label>
                        <div className="input-wrap">
                          <i className="fas fa-envelope input-icon"></i>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handle}
                            placeholder="f230644@cfd.nu.edu.pk"
                            required
                            disabled={status === 'sending'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <div className="input-wrap">
                        <i className="fas fa-tag input-icon"></i>
                        <input
                          name="subject"
                          value={form.subject}
                          onChange={handle}
                          placeholder="How can we help?"
                          disabled={status === 'sending'}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Message <span className="req">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handle}
                        placeholder="Describe your query in detail..."
                        rows="5"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-green btn-lg contact-send-btn"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <><span className="spinner"></span> Sending...</>
                      ) : (
                        <><i className="fas fa-paper-plane"></i> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-emblem"><i className="fas fa-briefcase"></i></div>
              <div>
                <div className="logo-njp">Job Portal ATS</div>
                <div className="logo-gov">Multi-Branch Recruitment System</div>
              </div>
            </div>
            <p>Pakistan's smart multi-branch recruitment and applicant tracking system — connecting talent with opportunity across Islamabad, Lahore, Karachi and Remote.</p>
            <div className="social-links">
              <a href="https://github.com/Haseebzahid9" target="_blank" rel="noreferrer" title="GitHub"><i className="fab fa-github"></i></a>
              <a href="https://linkedin.com/in/haseebzahid9" target="_blank" rel="noreferrer" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="mailto:haseeb4998@gmail.com" title="Email"><i className="fas fa-envelope"></i></a>
              <a href="tel:03184006367" title="Phone"><i className="fas fa-phone"></i></a>
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
              <li><a href="#about">About Job Portal ATS</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul>
              <li><a href="tel:03184006367"><i className="fas fa-phone"></i> 03184006367</a></li>
              <li><a href="mailto:f230644@cfd.nu.edu.pk"><i className="fas fa-envelope"></i> f230644@cfd.nu.edu.pk</a></li>
              <li><span><i className="fas fa-location-dot"></i> Islamabad, Pakistan</span></li>
              <li><a href="https://github.com/Haseebzahid9" target="_blank" rel="noreferrer"><i className="fab fa-github"></i> github.com/Haseebzahid9</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>© 2026 <strong>Job Portal ATS</strong> — Multi-Branch Recruitment System. All rights reserved.</p>
            <p>Developed by <strong>Haseeb Zahid</strong></p>
          </div>
        </div>
      </footer>
    </>
  );
}
