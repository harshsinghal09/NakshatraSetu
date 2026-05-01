import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check, Sparkles, Lock } from 'lucide-react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FEATURES_FREE = [
  'Basic kundali generation','Planetary positions chart','Vedic rule-based insights (career, relationship, wealth)','3 AI explanations','Lagna + Mahadasha info'
];
const FEATURES_PREMIUM = [
  'Everything in Free','Unlimited AI explanations','Deep Hinglish AI report','AI Chat with kundali context','Priority support','Future kundali matching'
];

export default function PremiumPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Create Razorpay order
      const orderRes = await paymentAPI.createOrder();
      const { order, key } = orderRes.data;

      // Check if Razorpay is available
      if (!window.Razorpay) {
        // Load Razorpay script dynamically
        await loadRazorpayScript();
      }

      // Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'NakshatraSetu',
        description: 'Premium Lifetime Access',
        order_id: order.id,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            updateUser({ isPremium: true, planType: 'premium' });
            toast.success('Premium unlock ho gaya! Welcome to the stars 🌟');
            navigate('/dashboard');
          } catch {
            toast.error('Payment verification failed. Support se contact karein.');
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#c8902a' },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment initiation failed.';
      if (msg.includes('not configured')) {
        toast.error('Payment gateway not configured. Please add Razorpay credentials to backend .env');
      } else {
        toast.error(msg);
      }
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  if (user?.isPremium) {
    return (
      <div style={{ minHeight:'100vh', position:'relative', zIndex:1, paddingTop:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', padding:40 }}>
          <div style={{ fontSize:'4rem', marginBottom:20 }}>⭐</div>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', color:'var(--gold-bright)', marginBottom:12 }}>
            Aap Pehle Se Premium Member Hain!
          </h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:32 }}>Sabhi features unlock hain. Dashboard pe jaayein.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-gold" style={{ padding:'14px 32px' }}>
            Dashboard Pe Jaayein
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1, paddingTop:100, paddingBottom:80 }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ marginBottom:16 }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background:'linear-gradient(135deg,var(--gold-dim),var(--gold-mid))',
              color:'#fff8e0', fontSize:'0.8rem', fontWeight:700,
              padding:'6px 20px', borderRadius:100, letterSpacing:'0.08em', textTransform:'uppercase'
            }}>
              <Sparkles size={12} /> Premium Membership
            </span>
          </div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.8rem,5vw,3rem)', color:'var(--text-primary)', marginBottom:12, lineHeight:1.2 }}>
            Stars ke Raaz Unlock Karein
          </h1>
          <p style={{ color:'var(--text-secondary)', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            Ek baar ki investment — lifetime premium access. Unlimited AI, deep reports, aur zyada.
          </p>
        </div>

        {/* Comparison */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:48 }}>
          {/* Free */}
          <div className="glass-card" style={{ padding:32 }}>
            <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', color:'var(--text-primary)', marginBottom:6 }}>Free</h3>
            <div style={{ marginBottom:28 }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', color:'var(--text-primary)' }}>₹0</span>
            </div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
              {FEATURES_FREE.map((f, i) => (
                <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, color:'var(--text-secondary)', fontSize:'0.875rem' }}>
                  <Check size={16} color="var(--success)" style={{ flexShrink:0, marginTop:2 }} /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-ghost" style={{ width:'100%' }} onClick={() => navigate('/dashboard')}>
              Current Plan
            </button>
          </div>

          {/* Premium */}
          <div style={{
            background:'linear-gradient(145deg,rgba(124,77,222,0.15),rgba(240,192,96,0.08))',
            border:'2px solid var(--gold-mid)', borderRadius:'var(--radius-lg)',
            padding:32, position:'relative', overflow:'hidden'
          }}>
            <div style={{
              position:'absolute', top:0, right:0, left:0, height:3,
              background:'linear-gradient(90deg,var(--purple-mid),var(--gold-bright),var(--purple-mid))'
            }} />
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', color:'var(--text-primary)' }}>Premium</h3>
              <span className="badge-premium">Best Value</span>
            </div>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', color:'var(--gold-bright)' }}>₹499</span>
              <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}> /lifetime</span>
            </div>
            <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:24 }}>Ek baar pay karein, hamesha access paayein</p>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
              {FEATURES_PREMIUM.map((f, i) => (
                <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, color:'var(--text-secondary)', fontSize:'0.875rem' }}>
                  <Star size={14} color="var(--gold-bright)" fill="var(--gold-bright)" style={{ flexShrink:0, marginTop:2 }} /> {f}
                </li>
              ))}
            </ul>
            <button onClick={handleUpgrade} className="btn-gold" disabled={loading} style={{ width:'100%', padding:'16px', fontSize:'1rem' }}>
              {loading ? <><span className="spinner" style={{ borderTopColor:'#1a0f00' }} /> Processing...</> : <>
                <Sparkles size={16} /> ₹499 Mein Upgrade Karein
              </>}
            </button>
          </div>
        </div>

        {/* Security note */}
        <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Lock size={12} /> Secured by Razorpay · SSL encrypted · Instant activation
        </div>

        {/* FAQ */}
        <div style={{ marginTop:64 }}>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', color:'var(--text-primary)', textAlign:'center', marginBottom:32 }}>
            Aksar Pooche Jaane Wale Sawaal
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:600, margin:'0 auto' }}>
            {FAQ.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card" style={{ padding:'16px 20px', cursor:'pointer' }} onClick={() => setOpen(!open)}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ color:'var(--text-primary)', fontSize:'0.9rem', fontWeight:500 }}>{q}</p>
        <span style={{ color:'var(--gold-mid)', fontSize:'1.2rem', transform: open ? 'rotate(45deg)' : 'none', transition:'transform 0.2s' }}>+</span>
      </div>
      {open && <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', marginTop:12, lineHeight:1.7 }}>{a}</p>}
    </div>
  );
}

const FAQ = [
  { q:'Kya yeh one-time payment hai?', a:'Haan! ₹499 ek baar pay karein aur lifetime access paayein. Koi recurring charges nahi hain.' },
  { q:'AI predictions kaise karta hai?', a:'AI predictions nahi karta. Swiss Ephemeris se exact planetary positions calculate hoti hain, Vedic rules se insights generate hote hain, aur AI sirf unhe Hinglish mein explain karta hai.' },
  { q:'Agar payment fail ho jaaye?', a:'Agar payment deduct ho gayi aur account premium na ho, toh 24 hours mein automatically reflect hoga ya support@nakshatra-setu.com pe contact karein.' },
  { q:'Kundali data safe hai?', a:'Haan. Aapka data MongoDB pe securely stored hai. JWT authentication se aapka account protected hai. Hum data kisi se share nahi karte.' },
];
