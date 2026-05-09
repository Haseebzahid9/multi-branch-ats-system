import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-content flex-center" style={{
      flexDirection: 'column', gap: '24px',
      minHeight: 'calc(100vh - var(--navbar-h))',
      textAlign: 'center', padding: '60px 24px',
    }}>
      <div style={{
        width: '96px', height: '96px',
        background: 'rgba(74,124,89,.12)',
        border: '1px solid rgba(74,124,89,.3)',
        borderRadius: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.4rem', color: 'var(--green-bright)',
        margin: '0 auto',
      }}>
        <i className="fas fa-search"></i>
      </div>
      <div>
        <h1 style={{ fontSize: '5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-.04em' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '12px', marginBottom: '10px' }}>Page Not Found</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
        <Link to="/" className="btn btn-green btn-lg"><i className="fas fa-home"></i> Back to Home</Link>
        <Link to="/jobs" className="btn btn-outline btn-lg"><i className="fas fa-briefcase"></i> Browse Jobs</Link>
      </div>
    </div>
  );
}
