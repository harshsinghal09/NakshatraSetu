import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Bot, User } from 'lucide-react';
import { chatAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ChatPanel({ kundaliId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await chatAPI.getHistory(kundaliId);
        if (res.data.messages.length === 0) {
          setMessages([{
            role: 'assistant',
            content: 'Namaste! 🙏 Main aapka Kundali AI advisor hoon. Aap mujhse apni kundali ke baare mein kuch bhi pooch sakte hain — career, relationship, health, wealth ya kuch bhi. Batayein, kya jaanna chahte hain?'
          }]);
        } else {
          setMessages(res.data.messages);
        }
      } catch {
        toast.error('Chat history load nahi huyi.');
      } finally {
        setFetching(false);
      }
    })();
  }, [kundaliId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages(p => [...p, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.send({ message: text, kundaliId });
      setMessages(p => [...p, { role: 'assistant', content: res.data.message }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Message send nahi hua.');
      setMessages(p => p.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTIONS = ['Mera career kaisa rahega?', 'Vivah kab hoga?', 'Meri personality kaise hai?', 'Financial situation kaisi hai?'];

  if (fetching) return (
    <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="glass-card" style={{ display:'flex', flexDirection:'column', height:600 }}>
      {/* Header */}
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'linear-gradient(135deg,var(--purple-mid),var(--gold-mid))',
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <Bot size={18} color="#fff" />
        </div>
        <div>
          <p style={{ color:'var(--text-primary)', fontWeight:500, fontSize:'0.9rem' }}>Kundali AI Advisor</p>
          <p style={{ color:'var(--success)', fontSize:'0.75rem' }}>● Online — Context-aware</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,var(--purple-mid),var(--gold-mid))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Bot size={14} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth:'80%', padding:'12px 16px', borderRadius:'var(--radius-md)',
              background: msg.role === 'user' ? 'linear-gradient(135deg,var(--purple-dim),var(--purple-mid))' : 'var(--bg-elevated)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(124,77,222,0.4)' : 'var(--border-subtle)'}`,
              color:'var(--text-primary)', fontSize:'0.9rem', lineHeight:1.7
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <User size={14} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,var(--purple-mid),var(--gold-mid))', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bot size={14} color="#fff" />
            </div>
            <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'12px 16px', display:'flex', gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-muted)', animation:'bounce 1s infinite 0s' }} />
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-muted)', animation:'bounce 1s infinite 0.15s' }} />
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-muted)', animation:'bounce 1s infinite 0.3s' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding:'0 16px 12px', display:'flex', gap:8, flexWrap:'wrap' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{
              background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)',
              color:'var(--text-secondary)', fontSize:'0.78rem', padding:'6px 12px',
              borderRadius:100, cursor:'pointer', transition:'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-dim)'; e.currentTarget.style.color='var(--gold-bright)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)'; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding:'12px 16px', borderTop:'1px solid var(--border-subtle)', display:'flex', gap:10 }}>
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Kuch bhi poochein apni kundali ke baare mein..."
          disabled={loading}
          style={{ flex:1 }}
        />
        <button type="submit" className="btn-gold" disabled={loading || !input.trim()} style={{ padding:'10px 16px', flexShrink:0 }}>
          {loading ? <span className="spinner" style={{ borderTopColor:'#1a0f00', width:16, height:16 }} /> : <Send size={16} />}
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
