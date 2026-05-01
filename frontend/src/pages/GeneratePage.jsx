import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, MapPin, Calendar, Clock, User } from 'lucide-react';
import { kundaliAPI } from '../services/api';
import toast from 'react-hot-toast';

const INDIAN_CITIES = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
  'Jaipur','Surat','Lucknow','Kanpur','Nagpur','Indore','Bhopal','Patna',
  'Vadodara','Agra','Varanasi','Mathura','Amritsar','Chandigarh','Coimbatore',
  'Kochi','Thiruvananthapuram','Bhubaneswar','Guwahati','Dehradun','Ranchi',
  'New York','London','Dubai','Singapore','Toronto','Sydney'
];

export default function GeneratePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  const handleCityInput = (val) => {
    setForm(p => ({ ...p, placeOfBirth: val }));
    if (val.length > 1) {
      setSuggestions(INDIAN_CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dateOfBirth || !form.timeOfBirth || !form.placeOfBirth) {
      toast.error('Sabhi fields required hain.');
      return;
    }
    setLoading(true);
    try {
      const res = await kundaliAPI.generate(form);
      toast.success('Kundali generate ho gayi! 🪐');
      navigate(`/kundali/${res.data.kundali._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kundali generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1, paddingTop:100, paddingBottom:60 }}>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'0 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{
            width:72, height:72, borderRadius:'50%', margin:'0 auto 20px',
            background:'linear-gradient(135deg,var(--purple-dim),var(--gold-mid))',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem',
            boxShadow:'0 0 32px rgba(240,192,96,0.25)'
          }}>🔭</div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', color:'var(--text-primary)', marginBottom:8 }}>
            Apni Kundali Banayein
          </h1>
          <p style={{ color:'var(--text-secondary)' }}>
            Janm ki details daalein — Swiss Ephemeris se precise calculation hogi
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card" style={{ padding:'clamp(24px,5vw,40px)' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:24 }}>

            <Field icon={<User size={16} />} label="Aapka Naam">
              <input
                className="input-field"
                type="text" required placeholder="Jaise: Ramesh Kumar"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </Field>

            <Field icon={<Calendar size={16} />} label="Janm Tithi (Date of Birth)">
              <input
                className="input-field"
                type="date" required
                max={new Date().toISOString().split('T')[0]}
                value={form.dateOfBirth}
                onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
              />
            </Field>

            <Field icon={<Clock size={16} />} label="Janm Samay (Time of Birth)">
              <input
                className="input-field"
                type="time" required
                value={form.timeOfBirth}
                onChange={e => setForm(p => ({ ...p, timeOfBirth: e.target.value }))}
              />
              <p style={{ color:'var(--text-muted)', fontSize:'0.78rem', marginTop:4 }}>
                💡 Agar exact time nahi pata toh sunrise time (6:00) try karein
              </p>
            </Field>

            <Field icon={<MapPin size={16} />} label="Janm Sthan (Place of Birth)">
              <div style={{ position:'relative' }}>
                <input
                  className="input-field"
                  type="text" required placeholder="Jaise: Mumbai, Delhi, London..."
                  value={form.placeOfBirth}
                  onChange={e => handleCityInput(e.target.value)}
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <div style={{
                    position:'absolute', top:'100%', left:0, right:0,
                    background:'var(--bg-elevated)', border:'1px solid var(--border-mid)',
                    borderRadius:'var(--radius-md)', overflow:'hidden', zIndex:10, marginTop:4
                  }}>
                    {suggestions.map(s => (
                      <div key={s}
                        onClick={() => { setForm(p => ({ ...p, placeOfBirth: s })); setSuggestions([]); }}
                        style={{
                          padding:'10px 16px', cursor:'pointer', fontSize:'0.875rem',
                          color:'var(--text-secondary)', transition:'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--gold-glow)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        📍 {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {/* Info box */}
            <div style={{
              background:'rgba(124,77,222,0.08)', border:'1px solid rgba(124,77,222,0.2)',
              borderRadius:'var(--radius-md)', padding:'16px 20px'
            }}>
              <p style={{ color:'var(--purple-bright)', fontSize:'0.85rem', lineHeight:1.7 }}>
                🌟 <strong>Kaise kaam karta hai:</strong> Aapki details se Swiss Ephemeris planetary positions calculate karega → 
                Vedic Rule Engine insights generate karega → AI Hinglish mein explain karega.
                Puri process deterministic aur accurate hai.
              </p>
            </div>

            <button type="submit" className="btn-gold" disabled={loading} style={{ width:'100%', padding:'16px', fontSize:'1rem' }}>
              {loading ? (
                <><span className="spinner" style={{ borderTopColor:'#1a0f00' }} /> Kundali Generate Ho Rahi Hai...</>
              ) : (
                '🔭 Kundali Generate Karein'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <div>
      <label style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:8, fontWeight:500 }}>
        <span style={{ color:'var(--gold-mid)' }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
