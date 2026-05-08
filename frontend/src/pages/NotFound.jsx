import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-content flex-center" style={{ flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 70px)', textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: '5rem', opacity: .3 }}>🔍</div>
      <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)' }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-green btn-lg"><i className="fas fa-home"></i> Back to Home</Link>
    </div>
  );
}
