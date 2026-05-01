import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Star, ArrowLeft } from 'lucide-react';
import { kundaliAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ChatPanel from '../components/chat/ChatPanel';

const SIGN_SYMBOLS = {
  'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋','Leo':'♌','Virgo':'♍',
  'Libra':'♎','Scorpio':'♏','Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓'
};
const PLANET_COLORS = {
  Sun:'#f59e0b', Moon:'#a78bfa', Mars:'#ef4444', Mercury:'#10b981',
  Jupiter:'#f97316', Venus:'#ec4899', Saturn:'#6b7280', Rahu:'#8b5cf6', Ketu:'#78716c'
};
const DOMAIN_ICONS = { career:'💼', relationship:'❤️', personality:'✨', health:'🌿', wealth:'💰' };

export default function KundaliPage() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await kundaliAPI.getById(id);
        setKundali(res.data.kundali);
      } catch {
        toast.error('Kundali not found.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getAIExplanation = async () => {
    if (kundali?.aiExplanation) return; // already fetched
    setAiLoading(true);
    try {
      const res = await kundaliAPI.getAIExplain(id);
      setKundali(p => ({ ...p, aiExplanation: res.data.explanation }));
      if (!user.isPremium) updateUser({ aiUsageCount: res.data.aiUsageCount });
      toast.success('AI explanation ready! 🌟');
    } catch (err) {
      const msg = err.response?.data?.message || 'AI explanation failed.';
      if (err.response?.data?.aiLimitReached) {
        toast.error('AI limit reached! Premium mein upgrade karein.');
      } else {
        toast.error(msg);
      }
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" style={{ width:40, height:40 }} />
    </div>
  );
  if (!kundali) return null;

  const allInsights = Object.entries(kundali.insights || {});

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1, paddingTop:80 }}>
      <div className="page-container" style={{ paddingBottom:80 }}>

        {/* Back button + title */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32, marginTop:16, flexWrap:'wrap' }}>
          <Link to="/dashboard" style={{ color:'var(--text-muted)', textDecoration:'none', display:'flex', alignItems:'center', gap:4, fontSize:'0.875rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div style={{ height:16, width:1, background:'var(--border-subtle)' }} />
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.6rem', color:'var(--text-primary)' }}>
            {SIGN_SYMBOLS[kundali.lagna?.sign]} {kundali.name} ki Kundali
          </h1>
        </div>

        {/* Summary bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:32 }}>
          {[
            { label:'Lagna', value:`${kundali.lagna?.sign || '—'} ${SIGN_SYMBOLS[kundali.lagna?.sign] || ''}` },
            { label:'Janm Tithi', value: new Date(kundali.dateOfBirth).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) },
            { label:'Janm Sthan', value: kundali.placeOfBirth },
            { label:'Mahadasha', value: kundali.currentMahadasha?.planet || '—' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding:'16px 20px' }}>
              <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{item.label}</p>
              <p style={{ color:'var(--gold-bright)', fontWeight:500, fontSize:'0.95rem' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:28, borderBottom:'1px solid var(--border-subtle)', paddingBottom:0, overflowX:'auto' }}>
          {['chart', 'insights', 'ai', ...(user?.isPremium ? ['chat'] : [])].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)',
              fontSize:'0.875rem', padding:'10px 20px',
              color: activeTab === tab ? 'var(--gold-bright)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--gold-bright)' : 'transparent'}`,
              marginBottom:-1, whiteSpace:'nowrap', transition:'all 0.2s'
            }}>
              {tab === 'chart' && '📊 Grahas'}
              {tab === 'insights' && '🔮 Insights'}
              {tab === 'ai' && '✨ AI Report'}
              {tab === 'chat' && '💬 AI Chat'}
            </button>
          ))}
        </div>

        {/* Tab: Planetary Chart */}
        {activeTab === 'chart' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* Kundali visual grid */}
            <KundaliChart planets={kundali.planets} lagna={kundali.lagna} />

            {/* Planet table */}
            <div className="glass-card" style={{ padding:24, overflowX:'auto' }}>
              <h3 style={{ fontFamily:'var(--font-serif)', color:'var(--text-primary)', marginBottom:20, fontSize:'1.2rem' }}>
                Graha Sthiti (Planetary Positions)
              </h3>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                    {['Graha','Rashi','Bhava','Nakshatra','Nakshatra Lord'].map(h => (
                      <th key={h} style={{ padding:'8px 12px', textAlign:'left', color:'var(--text-muted)', fontWeight:500, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kundali.planets?.map((p, i) => (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background: PLANET_COLORS[p.name] || '#888', display:'inline-block' }} />
                          <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{p.name}</span>
                        </span>
                      </td>
                      <td style={{ padding:'10px 12px', color:'var(--text-secondary)' }}>
                        {SIGN_SYMBOLS[p.sign]} {p.sign}
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{
                          background:'var(--bg-elevated)', color:'var(--gold-bright)',
                          padding:'2px 10px', borderRadius:100, fontSize:'0.8rem', fontWeight:600
                        }}>{p.house}</span>
                      </td>
                      <td style={{ padding:'10px 12px', color:'var(--text-secondary)', fontSize:'0.82rem' }}>{p.nakshatra}</td>
                      <td style={{ padding:'10px 12px', color:'var(--text-muted)', fontSize:'0.82rem' }}>{p.nakshatraLord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Insights */}
        {activeTab === 'insights' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {allInsights.map(([domain, items]) => items?.length > 0 && (
              <div key={domain} className="glass-card" style={{ padding:24 }}>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
                  {DOMAIN_ICONS[domain]} {domain.charAt(0).toUpperCase() + domain.slice(1)} Insights
                </h3>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {items.map((insight, j) => (
                    <InsightCard key={j} insight={insight} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: AI Report */}
        {activeTab === 'ai' && (
          <div className="glass-card" style={{ padding:'clamp(24px,4vw,40px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
              <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'var(--text-primary)' }}>
                ✨ AI Explanation (Hinglish)
              </h3>
              {!user?.isPremium && (
                <span style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>
                  {user?.aiUsageCount}/{user?.aiLimit} AI uses
                </span>
              )}
            </div>

            {kundali.aiExplanation ? (
              <div style={{
                color:'var(--text-secondary)', lineHeight:1.9, fontSize:'0.95rem',
                whiteSpace:'pre-wrap', fontFamily:'var(--font-serif)', fontSize:'1.05rem'
              }}>
                {kundali.aiExplanation}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>🤖</div>
                <p style={{ color:'var(--text-secondary)', marginBottom:24, maxWidth:400, margin:'0 auto 24px' }}>
                  AI aapki kundali ki insights ko friendly Hinglish mein explain karega — 
                  career, relationships, personality aur wealth ke baare mein.
                </p>
                {!user?.isPremium && user?.aiUsageCount >= user?.aiLimit ? (
                  <div>
                    <p style={{ color:'var(--warning)', marginBottom:16, fontSize:'0.9rem' }}>
                      AI limit reach ho gayi. Premium upgrade karein unlimited access ke liye.
                    </p>
                    <Link to="/premium" className="btn-gold" style={{ textDecoration:'none' }}>
                      <Star size={16} /> Upgrade to Premium
                    </Link>
                  </div>
                ) : (
                  <button onClick={getAIExplanation} className="btn-gold" disabled={aiLoading} style={{ padding:'14px 36px', fontSize:'1rem' }}>
                    {aiLoading ? <><span className="spinner" style={{ borderTopColor:'#1a0f00' }} /> AI Thinking...</> : '✨ AI Explanation Paayein'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Chat (premium) */}
        {activeTab === 'chat' && user?.isPremium && (
          <ChatPanel kundaliId={id} />
        )}
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const strength = insight.strength || 'medium';
  const color = strength === 'strong' ? 'var(--gold-bright)' : 'var(--teal-bright)';
  return (
    <div style={{
      background:'rgba(255,255,255,0.02)', border:'1px solid var(--border-subtle)',
      borderLeft:`3px solid ${color}`, borderRadius:'var(--radius-md)',
      padding:'16px 20px'
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8, gap:12 }}>
        <p style={{ color:'var(--text-primary)', fontSize:'0.95rem', fontWeight:500, lineHeight:1.5 }}>{insight.prediction}</p>
        <span style={{
          background: strength === 'strong' ? 'var(--gold-glow)' : 'var(--teal-glow)',
          color, fontSize:'0.7rem', padding:'2px 8px', borderRadius:100,
          whiteSpace:'nowrap', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', flexShrink:0
        }}>{strength}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{
          background:'rgba(124,77,222,0.15)', color:'var(--purple-bright)',
          fontSize:'0.75rem', padding:'2px 10px', borderRadius:100,
          border:'1px solid rgba(124,77,222,0.2)'
        }}>{insight.based_on}</span>
      </div>
      <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', lineHeight:1.6 }}>
        <span style={{ color:'var(--text-secondary)' }}>Kyun: </span>{insight.reason}
      </p>
    </div>
  );
}

function KundaliChart({ planets, lagna }) {
  const SIGN_SYMBOLS = {
    'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋','Leo':'♌','Virgo':'♍',
    'Libra':'♎','Scorpio':'♏','Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓'
  };

  // North Indian Kundali: 4×4 grid, center 2×2 = lagna display
  // Houses positioned by grid-column/grid-row
  const HOUSE_CELLS = [
    { house:12, col:1, row:1 }, { house:1,  col:2, row:1 }, { house:2,  col:3, row:1 }, { house:3,  col:4, row:1 },
    { house:11, col:1, row:2 },                                                            { house:4,  col:4, row:2 },
    { house:10, col:1, row:3 },                                                            { house:5,  col:4, row:3 },
    { house:9,  col:1, row:4 }, { house:8,  col:2, row:4 }, { house:7,  col:3, row:4 }, { house:6,  col:4, row:4 },
  ];

  const getHousePlanets = (houseNum) =>
    planets?.filter(p => p.house === houseNum) || [];

  return (
    <div className="glass-card" style={{ padding:24 }}>
      <h3 style={{ fontFamily:'var(--font-serif)', color:'var(--text-primary)', marginBottom:16, fontSize:'1.2rem' }}>
        Kundali Chart (North Indian Style)
      </h3>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(4,1fr)',
        gridTemplateRows:'repeat(4,1fr)',
        gap:2, maxWidth:380, margin:'0 auto',
        aspectRatio:'1/1', position:'relative'
      }}>
        {/* 12 house cells */}
        {HOUSE_CELLS.map(({ house, col, row }) => {
          const housePlanets = getHousePlanets(house);
          return (
            <div key={house} style={{
              gridColumn:`${col}/${col+1}`,
              gridRow:`${row}/${row+1}`,
              background:'rgba(17,14,42,0.8)',
              border:'1px solid var(--border-subtle)',
              padding:'4px 3px',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'flex-start',
              position:'relative', overflow:'hidden', minHeight:0
            }}>
              <span style={{
                color:'var(--text-muted)', fontSize:'0.6rem',
                position:'absolute', top:3, left:5, lineHeight:1
              }}>{house}</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:1, justifyContent:'center', marginTop:14 }}>
                {housePlanets.map((p, i) => (
                  <span key={i} title={`${p.name} in ${p.sign}`} style={{
                    background:(PLANET_COLORS[p.name] || '#888') + '30',
                    color: PLANET_COLORS[p.name] || '#aaa',
                    fontSize:'0.58rem', padding:'1px 4px',
                    borderRadius:3, fontWeight:700,
                    border:`1px solid ${PLANET_COLORS[p.name] || '#888'}44`
                  }}>
                    {p.name.slice(0,2).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* Center 2×2 — Lagna display */}
        <div style={{
          gridColumn:'2/4', gridRow:'2/4',
          background:'linear-gradient(135deg,rgba(124,77,222,0.15),rgba(240,192,96,0.08))',
          border:'1px solid var(--border-mid)',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:4
        }}>
          <span style={{ fontSize:'2rem', lineHeight:1 }}>
            {SIGN_SYMBOLS[lagna?.sign] || '🪐'}
          </span>
          <span style={{ color:'var(--gold-bright)', fontSize:'0.72rem', fontWeight:700, textAlign:'center' }}>
            {lagna?.sign || 'Lagna'}
          </span>
          <span style={{ color:'var(--text-muted)', fontSize:'0.62rem' }}>
            {lagna?.degree ? `${lagna.degree.toFixed(1)}°` : 'Lagna'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:16, justifyContent:'center' }}>
        {Object.entries(PLANET_COLORS).map(([name, color]) => (
          <span key={name} style={{
            display:'flex', alignItems:'center', gap:4,
            fontSize:'0.72rem', color:'var(--text-muted)'
          }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }} />
            {name.slice(0,2)}
          </span>
        ))}
      </div>
    </div>
  );
}
