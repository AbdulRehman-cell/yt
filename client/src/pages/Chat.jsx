import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch mock recipient data
        const userRes = await axios.get(`/api/users/${id}`);
        setRecipient(userRes.data);
        
        // Fetch message history
        const msgRes = await axios.get(`/api/messages?chatId=${id}`);
        setMessages(msgRes.data || []);
      } catch (err) {
        setError('Unable to load your conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('/api/messages', {
        receiverId: id,
        content: newMessage,
        timestamp: new Date()
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (loading) return <div className="container section">Loading your connection...</div>;
  if (error) return <div className="container section">{error}</div>;

  return (
    <div className="container">
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">Conversations</span>
          <h1>Deepening the <span className="gradient-text">Connection</span></h1>
        </div>
        
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <img src={`https://i.pravatar.cc/300?img=${id}`} alt={recipient?.username} style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
            <div>
              <h3>{recipient?.username || 'Valued Member'}</h3>
              <p className="muted">{recipient?.traits || 'Connecting through shared values.'}</p>
            </div>
          </div>

          <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '4rem' }}>No messages yet. Start by sharing a thought about your day.</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.senderId === 'me' ? 'sent' : 'received'}`} style={{ padding: '1rem', borderRadius: '12px', background: msg.senderId === 'me' ? 'var(--primary)' : 'var(--surface-2)', color: msg.senderId === 'me' ? 'white' : 'inherit', alignSelf: msg.senderId === 'me' ? 'flex-end' : 'flex-start' }}>
                  {msg.content}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a meaningful message..."
              style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid var(--border)' }}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Conversation Guidelines</h2>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Be Intentional</h3>
            <p>Our platform thrives on thoughtful, long-form communication. Focus on shared experiences.</p>
          </div>
          <div className="card">
            <h3>Stay Authentic</h3>
            <p>Transparency builds trust. Be yourself from the first interaction.</p>
          </div>
          <div className="card">
            <h3>Respect Boundaries</h3>
            <p>We prioritize a serene environment. Keep interactions polite and considerate.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card" style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)' }}>
          <h2>Ready to meet in person?</h2>
          <p style={{ marginBottom: '2rem' }}>Once you feel a strong enough connection, suggest a coffee or a walk in the park.</p>
          <button className="btn btn-secondary">Suggest a Meetup</button>
        </div>
      </section>
    </div>
  );
}