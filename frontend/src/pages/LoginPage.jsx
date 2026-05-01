import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Star, Loader } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'80px 24px 40px', position:'relative', zIndex:1
    }}>
      <div style={{
        background:'var(--bg-glass)', border:'1px solid var(--border-subtle)',
        borderRadius:'var(--radius-xl)', backdropFilter:'blur(24px)',
        padding:'clamp(32px,5vw,48px)', width:'100%', maxWidth:440
      }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:56, height:56, borderRadius:'50%', margin:'0 auto 16px',
            background:'linear-gradient(135deg,var(--purple-mid),var(--gold-mid))',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 24px rgba(240,192,96,0.3)'
          }}>
            <Star size={24} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', color:'var(--text-primary)', marginBottom:6 }}>{title}</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>{subtitle}</p>
        </div>
        {children}
        <div style={{ marginTop:24, textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>{footer}</div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success(`Swagat hai, ${user.name}! 🌟`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Wapas Aayein"
      subtitle="Apne account mein login karein"
      footer={<>Naya account? <Link to="/signup" style={{ color:'var(--gold-bright)', textDecoration:'none' }}>Register karein</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:6 }}>Email</label>
          <input
            className="input-field"
            type="email" required autoComplete="email"
            placeholder="aap@example.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:6 }}>Password</label>
          <div style={{ position:'relative' }}>
            <input
              className="input-field"
              type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              style={{ paddingRight:44 }}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
              position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer'
            }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop:8, width:'100%' }}>
          {loading ? <><span className="spinner" />Logging in...</> : 'Login Karein'}
        </button>
      </form>
    </AuthLayout>
  );
}

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye.'); return; }
    setLoading(true);
    try {
      const res = await authAPI.signup(form);
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success('Account ban gaya! Swagat hai 🪐');
      navigate('/generate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Shuru Karein"
      subtitle="Free account banayein aaj hi"
      footer={<>Already account hai? <Link to="/login" style={{ color:'var(--gold-bright)', textDecoration:'none' }}>Login karein</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {[
          { key:'name',     label:'Aapka Naam',  type:'text',     placeholder:'Ramesh Kumar', auto:'name' },
          { key:'email',    label:'Email',        type:'email',    placeholder:'aap@example.com', auto:'email' },
          { key:'password', label:'Password',     type:'password', placeholder:'Min 6 characters', auto:'new-password' },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:6 }}>{f.label}</label>
            <div style={{ position:'relative' }}>
              <input
                className="input-field"
                type={f.key === 'password' && showPwd ? 'text' : f.type}
                required autoComplete={f.auto}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={f.key === 'password' ? { paddingRight:44 } : {}}
              />
              {f.key === 'password' && (
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer'
                }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop:8, width:'100%' }}>
          {loading ? <><span className="spinner" />Creating account...</> : 'Account Banayein'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
