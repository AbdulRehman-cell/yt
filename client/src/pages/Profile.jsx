import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    traits: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/api/users/654321'); // Mock ID
      setUser(data);
      setFormData({
        username: data.username || '',
        bio: data.bio || '',
        traits: data.traits || ''
      });
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/users/654321', formData);
      alert('Profile updated successfully.');
    } catch (err) {
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container section">Loading your essence...</div>;

  return (
    <div className="profile-page">
      <section className="hero">
        <img className="hero-bg" src="https://picsum.photos/seed/profile1/1600/600" alt="Serene workspace" />
        <div className="container">
          <span className="eyebrow">Your Digital Sanctuary</span>
          <h1>Cultivate your <span className="gradient-text">presence</span></h1>
          <p className="hero-subtitle">Define the nuances of your personality. Intentionality starts with clarity.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Personal Configuration</h2>
            <p>Your traits act as the compass for finding your perfect match.</p>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3>Refine Profile</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label>Your Essence (Bio)</label>
                  <textarea 
                    className="input-field" 
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label>Core Traits (Comma separated)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.traits}
                    onChange={(e) => setFormData({...formData, traits: e.target.value})}
                    placeholder="e.g. Introverted, Analytical, Creative"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="card">
              <h3>Membership Status</h3>
              <div className="stats">
                <div className="stat-value">{user?.isMatched ? 'Connected' : 'Seeking'}</div>
                <div className="stat-label">Current Compatibility Status</div>
              </div>
              <p style={{ marginTop: '24px' }}>Your account is currently active within the Lovebirds network. We recommend updating your traits every 30 days to ensure maximum compatibility accuracy.</p>
              <button className="btn btn-secondary">Download Data Archive</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-head">
            <h2>Account Preferences</h2>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <span className="feature-icon">🌿</span>
              <h3>Notification Pulse</h3>
              <p>Control how frequently you receive notifications about new compatibility matches.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Privacy Controls</h3>
              <p>Toggle your visibility and control who sees your personality analytics.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✨</span>
              <h3>Theme Settings</h3>
              <p>Customize your reading experience within the platform to suit your aesthetic.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="testimonial-card">
            <p>"Since I started focusing on trait-based matching, the quality of conversations has been transformative. It's not about the photos anymore; it's about the resonance."</p>
            <div style={{ marginTop: '16px', fontWeight: '700' }}>— Sarah, London</div>
          </div>
        </div>
      </section>
    </div>
  );
}