import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load potential matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page-explore">
      <section className="hero">
        <img className="hero-bg" src="https://picsum.photos/seed/explore1/1600/900" alt="Background" />
        <div className="container">
          <span className="eyebrow">Discovery</span>
          <h1>Find your <span className="gradient-text">aligned</span> companion</h1>
          <p className="hero-subtitle">Browse individuals who share your values, rhythms, and outlook on life.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Recommended Matches</h2>
            <p>Based on your personality profile and compatibility preferences.</p>
          </div>

          {loading ? (
            <div className="loading-state">Loading your potential connections...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <div className="grid-3">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className="card">
                    <img 
                      src={user.avatar || `https://i.pravatar.cc/300?img=${user._id?.slice(-2) || 1}`} 
                      alt={user.username} 
                      style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                    <h3>{user.username || 'Anonymous User'}</h3>
                    <p>{(user.bio || 'Seeking intentional conversations and deep connection.').slice(0, 100)}...</p>
                    <div style={{ marginTop: '16px' }}>
                      <span className="badge">{user.traits || 'Thoughtful'}</span>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => navigate(`/chat/${user._id}`)}
                      style={{ marginTop: '20px', width: '100%' }}
                    >
                      Start Conversation
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">No users currently active. Check back later.</div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-head">
            <h2>Why Compatibility Matters</h2>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Shared Rhythm</h3>
              <p>We prioritize long-term compatibility, focusing on how you navigate life together, not just surface-level interests.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Intention-First</h3>
              <p>Every match is curated to ensure that both parties are looking for the same depth of connection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="testimonial-card">
            <p>"I finally found someone who values quiet evenings as much as I do. The personality-first approach truly works."</p>
            <cite>— Elena, joined 2023</cite>
          </div>
        </div>
      </section>
    </div>
  );
}