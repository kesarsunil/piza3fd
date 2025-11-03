import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function AdminButton() {
  const { userRole } = useContext(AuthContext);

  if (userRole !== 'admin') return null;

  return (
    <Link
      to="/admin"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        background: '#007bff',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
      }}
    >
       Admin Panel
    </Link>
  );
}
