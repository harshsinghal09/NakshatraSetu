import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowRight, Moon, Sun, Zap, Shield, MessageCircle } from 'lucide-react';

const ZODIAC = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ZODIAC_NAMES = ['Mesh','Vrishabha','Mithun','Kark','Singh','Kanya','Tula','Vrischik','Dhanu','Makar','Kumbha','Meen'];

export default function HomePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.15 + 0.05,
      alpha: Math.random()
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.speed * 0.03;
        const a = (Math.sin(s.alpha) + 1) / 2 * 0.8 + 0.1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,192,96,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.6 }} />

      {/* Hero */}
      <section style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 24px 60px' }}>

        {/* Orb */}
        <div style={{
          position:'absolute', width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(124,77,222,0.18) 0%, rgba(240,192,96,0.06) 50%, transparent 70%)',
          top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          animation:'pulse 6s ease-in-out infinite', pointerEvents:'none'
        }} />

        <div className="fade-up" style={{ marginBottom:20 }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(240,192,96,0.08)', border:'1px solid rgba(240,192,96,0.25)',
            color:'var(--gold-bright)', fontSize:'0.8rem', letterSpacing:'0.1em',
            padding:'6px 18px', borderRadius:100, textTransform:'uppercase', fontWeight:500
          }}>
            <Sparkles size={12} /> AI-Powered Vedic Jyotish
          </span>
        </div>

        <h1 className="fade-up fade-up-1" style={{
          fontFamily:'var(--font-display)', fontSize:'clamp(2rem,6vw,4.5rem)',
          color:'var(--gold-bright)', lineHeight:1.1, marginBottom:16,
          textShadow:'0 0 40px rgba(240,192,96,0.3)', maxWidth:800
        }}>
          NakshatraSetu
        </h1>

        <p className="fade-up fade-up-2" style={{
          fontFamily:'var(--font-serif)', fontSize:'clamp(1.2rem,3vw,2rem)',
          color:'var(--text-secondary)', marginBottom:16, fontStyle:'italic'
        }}>
          Apni Kundali ka Rahasya Jaanein
        </p>

        <p className="fade-up fade-up-3" style={{
          color:'var(--text-secondary)', fontSize:'1rem', maxWidth:560,
          lineHeight:1.8, marginBottom:40
        }}>
          Swiss Ephemeris aur Vedic Rule Engine se precise planetary calculations,
          phir Gemini AI se Hinglish mein friendly explanation — bilkul alag, bilkul accurate.
        </p>

        <div className="fade-up fade-up-4" style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
          <Link to="/signup" className="btn-gold" style={{ textDecoration:'none', fontSize:'1rem', padding:'14px 36px' }}>
            Apni Kundali Banayein <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-ghost" style={{ textDecoration:'none', fontSize:'1rem', padding:'14px 28px' }}>
            Login Karein
          </Link>
        </div>

        {/* Zodiac wheel */}
        <div className="fade-up" style={{ marginTop:64, display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', maxWidth:600 }}>
          {ZODIAC.map((sym, i) => (
            <div key={i} style={{
              width:52, height:52, borderRadius:'50%',
              border:'1px solid var(--border-subtle)',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              background:'rgba(17,14,42,0.6)',
              transition:'all 0.3s', cursor:'default',
              fontSize:'1.3rem', color:'var(--text-secondary)',
              animation:`fadeUp 0.5s ${0.05*i}s both`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor='var(--gold-mid)';
              e.currentTarget.style.color='var(--gold-bright)';
              e.currentTarget.style.boxShadow='0 0 16px rgba(240,192,96,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor='var(--border-subtle)';
              e.currentTarget.style.color='var(--text-secondary)';
              e.currentTarget.style.boxShadow='none';
            }}
            title={ZODIAC_NAMES[i]}>
              {sym}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 24px', background:'rgba(11,9,32,0.6)' }}>
        <div className="page-container">
          <h2 style={{ textAlign:'center', fontFamily:'var(--font-serif)', fontSize:'2.2rem', color:'var(--text-primary)', marginBottom:8 }}>
            Kya Milta Hai Aapko?
          </h2>
          <p style={{ textAlign:'center', color:'var(--text-secondary)', marginBottom:56 }}>
            Simple process, powerful insights
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card" style={{
                padding:28,
                transition:'all 0.3s',
                animationDelay:`${i*0.1}s`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor='var(--gold-dim)';
                e.currentTarget.style.transform='translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor='var(--border-subtle)';
                e.currentTarget.style.transform='translateY(0)';
              }}>
                <div style={{
                  width:48, height:48, borderRadius:12,
                  background:`linear-gradient(135deg, ${f.from}, ${f.to})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:16, fontSize:'1.4rem'
                }}>{f.icon}</div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 24px' }}>
        <div className="page-container">
          <h2 style={{ textAlign:'center', fontFamily:'var(--font-serif)', fontSize:'2.2rem', color:'var(--text-primary)', marginBottom:56 }}>
            Kaise Kaam Karta Hai?
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign:'center', padding:'24px 16px' }}>
                <div style={{
                  width:56, height:56, borderRadius:'50%', margin:'0 auto 16px',
                  border:'2px solid var(--gold-mid)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'var(--gold-bright)', fontSize:'1.4rem',
                  background:'var(--gold-glow)'
                }}>{s.num}</div>
                <h4 style={{ color:'var(--text-primary)', marginBottom:8, fontFamily:'var(--font-serif)', fontSize:'1.1rem' }}>{s.title}</h4>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 24px', background:'rgba(11,9,32,0.6)' }}>
        <div className="page-container">
          <h2 style={{ textAlign:'center', fontFamily:'var(--font-serif)', fontSize:'2.2rem', color:'var(--text-primary)', marginBottom:8 }}>
            Plans & Pricing
          </h2>
          <p style={{ textAlign:'center', color:'var(--text-secondary)', marginBottom:56 }}>Shuruaat free mein!</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, maxWidth:700, margin:'0 auto' }}>
            <PricingCard
              title="Free"
              price="₹0"
              features={['Basic kundali generation','Rule-based insights','3 AI explanations','Lagna + planetary chart']}
              cta="Start Free"
              to="/signup"
            />
            <PricingCard
              title="Premium"
              price="₹499"
              period="/lifetime"
              features={['Everything in Free','Unlimited AI explanations','AI Chat with kundali context','Deep analysis report','Kundali matching']}
              cta="Upgrade Now"
              to="/premium"
              highlighted
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 24px', textAlign:'center' }}>
        <div style={{
          maxWidth:600, margin:'0 auto',
          background:'linear-gradient(135deg,rgba(124,77,222,0.15),rgba(240,192,96,0.08))',
          border:'1px solid var(--border-mid)', borderRadius:'var(--radius-xl)',
          padding:'56px 40px'
        }}>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', color:'var(--text-primary)', marginBottom:12 }}>
            Aaj Hi Shuru Karein
          </h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>
            Apni janm patri se jaanein apna career, relationship aur jeewan ka raasta.
          </p>
          <Link to="/signup" className="btn-gold pulse-gold" style={{ textDecoration:'none', fontSize:'1rem', padding:'16px 40px' }}>
            Free Mein Kundali Banayein <Star size={16} fill="currentColor" />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.8; }
          50% { transform:translate(-50%,-50%) scale(1.1); opacity:1; }
        }
      `}</style>
    </div>
  );
}

const FEATURES = [
  { icon:'🔭', title:'Swiss Ephemeris Engine', desc:'Bilkul accurate planetary positions — same formula jo professional astrologers use karte hain.', from:'#1a0050', to:'#3d1f8a' },
  { icon:'📜', title:'Vedic Rule Engine', desc:'100+ Vedic astrology rules code mein — Saturn in 10th, Mars dosha, Jupiter\'s grace — sab kuch deterministic.', from:'#1a3000', to:'#2a7030' },
  { icon:'🤖', title:'Gemini AI Explanation', desc:'AI sirf explain karta hai, predict nahi. Hinglish mein friendly advice milti hai already computed insights se.', from:'#300020', to:'#7a2050' },
  { icon:'💎', title:'Premium Features', desc:'Deep AI reports, kundali matching aur unlimited AI chat — sab kuch ek lifetime subscription mein.', from:'#301500', to:'#7a4510' },
  { icon:'🔐', title:'Secure & Private', desc:'JWT authentication, bcrypt password hashing — aapka data safe hai.', from:'#001530', to:'#0a4070' },
  { icon:'📱', title:'Responsive Design', desc:'Mobile, tablet, desktop — har device pe beautiful experience milta hai.', from:'#150030', to:'#400080' },
];

const STEPS = [
  { num:'①', title:'Register Karein', desc:'Free account banayein email se. No credit card needed.' },
  { num:'②', title:'Details Bharein', desc:'Janm tithi, samay aur sthan daalein.' },
  { num:'③', title:'Kundali Generate', desc:'Swiss Ephemeris se instant calculation hogi.' },
  { num:'④', title:'Insights Paayein', desc:'Vedic rules aur AI se career, relationship, personality insights.' },
];

function PricingCard({ title, price, period, features, cta, to, highlighted }) {
  return (
    <div style={{
      background: highlighted ? 'linear-gradient(145deg,rgba(124,77,222,0.15),rgba(240,192,96,0.08))' : 'var(--bg-card)',
      border: `1px solid ${highlighted ? 'var(--gold-mid)' : 'var(--border-subtle)'}`,
      borderRadius:'var(--radius-lg)', padding:32,
      position:'relative', overflow:'hidden'
    }}>
      {highlighted && (
        <div style={{
          position:'absolute', top:16, right:-24,
          background:'linear-gradient(135deg,var(--gold-dim),var(--gold-mid))',
          color:'#fff8e0', fontSize:'0.7rem', fontWeight:700,
          padding:'4px 40px', transform:'rotate(45deg)',
          letterSpacing:'0.1em'
        }}>POPULAR</div>
      )}
      <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', color:'var(--text-primary)', marginBottom:8 }}>{title}</h3>
      <div style={{ marginBottom:24 }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color: highlighted ? 'var(--gold-bright)' : 'var(--text-primary)' }}>{price}</span>
        {period && <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{period}</span>}
      </div>
      <ul style={{ listStyle:'none', marginBottom:32, display:'flex', flexDirection:'column', gap:10 }}>
        {features.map((f,i) => (
          <li key={i} style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-secondary)', fontSize:'0.875rem' }}>
            <span style={{ color:'var(--success)', fontSize:'1rem' }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Link to={to} className={highlighted ? 'btn-gold' : 'btn-ghost'} style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>
        {cta}
      </Link>
    </div>
  );
}
