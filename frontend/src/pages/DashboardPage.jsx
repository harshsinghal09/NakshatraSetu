import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Star, Sparkles } from 'lucide-react';
import { kundaliAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SIGN_SYMBOLS = {
  'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋','Leo':'♌','Virgo':'♍',
  'Libra':'♎','Scorpio':'♏','Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kundalis, setKundalis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await kundaliAPI.getAll();
        setKundalis(res.data.kundalis);
      } catch {
        toast.error('Failed to load kundalis.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Yeh kundali delete karein?')) return;
    try {
      await kundaliAPI.delete(id);
      setKundalis(p => p.filter(k => k._id !== id));
      toast.success('Kundali delete ho gayi.');
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1, paddingTop:90, paddingBottom:60 }}>
      <div className="page-container">

        {/* Welcome header */}
        <div style={{ marginBottom:40, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,4vw,2.4rem)', color:'var(--text-primary)', marginBottom:6 }}>
              Namaste, {user?.name} 🙏
            </h1>
            <p style={{ color:'var(--text-secondary)' }}>
              Aapki kundali collection — click karo detailed analysis ke liye
            </p>
          </div>
          <Link to="/generate" className="btn-gold" style={{ textDecoration:'none', whiteSpace:'nowrap' }}>
            <Plus size={18} /> Nayi Kundali
          </Link>
        </div>

        {/* AI usage bar */}
        {!user?.isPremium && (
          <div className="glass-card" style={{ padding:'16px 24px', marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:4 }}>AI Explanations Used</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:160, height:6, background:'var(--bg-elevated)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:3,
                    background:'linear-gradient(90deg,var(--gold-dim),var(--gold-bright))',
                    width:`${Math.min(100, (user?.aiUsageCount / user?.aiLimit) * 100)}%`,
                    transition:'width 0.5s'
                  }} />
                </div>
                <span style={{ color:'var(--gold-bright)', fontSize:'0.875rem' }}>
                  {user?.aiUsageCount}/{user?.aiLimit} used
                </span>
              </div>
            </div>
            <Link to="/premium" className="btn-gold" style={{ textDecoration:'none', fontSize:'0.85rem', padding:'8px 20px' }}>
              <Sparkles size={14} /> Upgrade Premium
            </Link>
          </div>
        )}

        {user?.isPremium && (
          <div style={{
            marginBottom:32, padding:'12px 20px',
            background:'linear-gradient(135deg,rgba(240,192,96,0.08),rgba(124,77,222,0.08))',
            border:'1px solid var(--gold-dim)', borderRadius:'var(--radius-md)',
            display:'flex', alignItems:'center', gap:10
          }}>
            <Star size={16} color="var(--gold-bright)" fill="var(--gold-bright)" />
            <span style={{ color:'var(--gold-bright)', fontSize:'0.875rem', fontWeight:500 }}>Premium Member — Unlimited AI Access</span>
          </div>
        )}

        {/* Kundali grid */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
            <div className="spinner" style={{ width:40, height:40 }} />
          </div>
        ) : kundalis.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {kundalis.map((k, i) => (
              <div key={k._id}
                onClick={() => navigate(`/kundali/${k._id}`)}
                style={{
                  background:'var(--bg-card)', border:'1px solid var(--border-subtle)',
                  borderRadius:'var(--radius-lg)', padding:24, cursor:'pointer',
                  transition:'all 0.3s var(--ease-out)',
                  animationDelay:`${i * 0.08}s`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor='var(--gold-dim)';
                  e.currentTarget.style.transform='translateY(-4px)';
                  e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor='var(--border-subtle)';
                  e.currentTarget.style.transform='translateY(0)';
                  e.currentTarget.style.boxShadow='none';
                }}
              >
                {/* Lagna symbol */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{
                    width:52, height:52, borderRadius:'50%', fontSize:'1.6rem',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:'linear-gradient(135deg,var(--purple-dim),var(--bg-elevated))',
                    border:'1px solid var(--border-mid)'
                  }}>
                    {SIGN_SYMBOLS[k.lagna?.sign] || '🪐'}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/kundali/${k._id}`); }}
                      style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:6 }}
                      title="View"
                    ><Eye size={16} /></button>
                    <button
                      onClick={(e) => handleDelete(k._id, e)}
                      style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:6 }}
                      title="Delete"
                    ><Trash2 size={16} /></button>
                  </div>
                </div>

                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:4 }}>
                  {k.name}
                </h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:8 }}>
                  {new Date(k.dateOfBirth).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{
                    background:'var(--purple-glow)', color:'var(--purple-bright)',
                    fontSize:'0.75rem', padding:'3px 10px', borderRadius:100,
                    border:'1px solid rgba(124,77,222,0.3)'
                  }}>
                    {k.lagna?.sign || 'Calculating'} Lagna
                  </span>
                  {k.aiExplanation && (
                    <span style={{
                      background:'var(--gold-glow)', color:'var(--gold-bright)',
                      fontSize:'0.75rem', padding:'3px 10px', borderRadius:100,
                      border:'1px solid rgba(240,192,96,0.3)'
                    }}>✨ AI Explained</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'80px 24px' }}>
      <div style={{ fontSize:'4rem', marginBottom:16 }}>🪐</div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.6rem', color:'var(--text-primary)', marginBottom:8 }}>
        Abhi Tak Koi Kundali Nahi
      </h2>
      <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>
        Apni pehli kundali generate karein aur cosmic insights paayein!
      </p>
      <Link to="/generate" className="btn-gold" style={{ textDecoration:'none' }}>
        <Plus size={18} /> Pehli Kundali Banayein
      </Link>
    </div>
  );
}
