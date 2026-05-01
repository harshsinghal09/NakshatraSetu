import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Star, Sparkles, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(5,4,15,0.92)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(240,192,96,0.1)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px'
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:'50%',
            background: 'linear-gradient(135deg, var(--purple-mid), var(--gold-mid))',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: '0 0 16px rgba(240,192,96,0.3)'
          }}>
            <Star size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--gold-bright)', letterSpacing:'0.02em' }}>
            NakshatraSetu
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }} className="desktop-nav">
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/generate" active={isActive('/generate')}>Generate</NavLink>
              {!user.isPremium && (
                <Link to="/premium" style={{ textDecoration:'none' }}>
                  <span style={{
                    display:'flex', alignItems:'center', gap:6,
                    background:'linear-gradient(135deg,var(--gold-dim),var(--gold-mid))',
                    color:'#fff8e0', fontSize:'0.8rem', fontWeight:600,
                    padding:'6px 14px', borderRadius:100, letterSpacing:'0.05em'
                  }}>
                    <Sparkles size={12} /> Premium
                  </span>
                </Link>
              )}
              {user.isPremium && (
                <span style={{ display:'flex', alignItems:'center', gap:5, color:'var(--gold-bright)', fontSize:'0.8rem' }}>
                  <Star size={12} fill="currentColor" /> Premium
                </span>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:8 }}>
                <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{user.name}</span>
                <button onClick={handleLogout} className="btn-ghost" style={{ padding:'8px 16px', fontSize:'0.82rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ textDecoration:'none', padding:'8px 20px', fontSize:'0.875rem' }}>Login</Link>
              <Link to="/signup" className="btn-gold" style={{ textDecoration:'none', padding:'8px 20px', fontSize:'0.875rem' }}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} style={{ background:'none', border:'none', color:'var(--text-primary)', cursor:'pointer', display:'none' }} className="mobile-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background:'var(--bg-card)', borderTop:'1px solid var(--border-subtle)',
          padding:'16px 24px', display:'flex', flexDirection:'column', gap:12
        }}>
          {user ? (
            <>
              <MobileLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/generate" onClick={() => setOpen(false)}>Generate Kundali</MobileLink>
              {!user.isPremium && <MobileLink to="/premium" onClick={() => setOpen(false)}>⭐ Upgrade Premium</MobileLink>}
              <button onClick={() => { handleLogout(); setOpen(false); }} style={{ background:'none', border:'none', color:'var(--error)', textAlign:'left', fontSize:'0.9rem', cursor:'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setOpen(false)}>Login</MobileLink>
              <MobileLink to="/signup" onClick={() => setOpen(false)}>Sign Up</MobileLink>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-btn { display:block !important; }
        }
      `}</style>
    </nav>
  );
}

const NavLink = ({ to, active, children }) => (
  <Link to={to} style={{
    textDecoration: 'none',
    color: active ? 'var(--gold-bright)' : 'var(--text-secondary)',
    fontSize: '0.875rem',
    padding: '8px 14px',
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--gold-glow)' : 'transparent',
    transition: 'all 0.2s',
    fontWeight: active ? 500 : 400
  }}>{children}</Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} style={{ textDecoration:'none', color:'var(--text-primary)', fontSize:'0.95rem', padding:'8px 0' }}>{children}</Link>
);
