import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <img className="hero-bg" src="https://picsum.photos/seed/hero1/1600/900" alt="Couple sharing coffee" />
        <div className="container">
          <span className="eyebrow">Intentional Connections</span>
          <h1>Find your <span className="gradient-text">kindred</span> spirit through depth, not algorithms.</h1>
          <p className="hero-subtitle">Lovebirds connects you with individuals who value personality, shared history, and authentic conversation. Step into a space designed for real relationships.</p>
          <div className="hero-actions">
            <Link to="/explore" className="btn btn-primary">Start Your Journey</Link>
            <a href="#how-it-works" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why Lovebirds?</h2>
            <p>We prioritize soul-level resonance over fleeting digital metrics.</p>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon">✦</div>
              <h3>Personality First</h3>
              <p>Our matching engine prioritizes deep-seated character traits and values over superficial preferences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❖</div>
              <h3>Mindful Pacing</h3>
              <p>Features are built to encourage slow, meaningful growth in conversations instead of rapid-fire matching.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❦</div>
              <h3>Verified Identity</h3>
              <p>Enjoy peace of mind with our rigorous verification process for all members on the platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section section-surface" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <h2>The Path to Connection</h2>
          </div>
          <div className="grid-4">
            <div className="step">
              <span className="step-num">01</span>
              <h3>Create Profile</h3>
              <p>Share your authentic self, your passions, and your non-negotiables.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h3>Get Matched</h3>
              <p>Receive curated daily recommendations based on deep personality compatibility.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h3>Start Dialog</h3>
              <p>Engage in focused chat sessions designed to foster organic comfort.</p>
            </div>
            <div className="step">
              <span className="step-num">04</span>
              <h3>Meet Up</h3>
              <p>Move from the digital space to a real-world, meaningful connection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="section">
        <div className="container">
          <div className="stats">
            <div className="stat-card">
              <span className="stat-value">12k+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">84%</span>
              <span className="stat-label">Second Date Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">500+</span>
              <span className="stat-label">Successful Unions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-accent">
        <div className="container">
          <div className="section-head">
            <h2>Voices of Lovebirds</h2>
          </div>
          <div className="grid-2">
            <div className="testimonial-card">
              <img src="https://i.pravatar.cc/300?img=1" alt="Member" className="avatar" />
              <blockquote>"For the first time, I felt like someone was actually listening to my thoughts, not just swiping past my photo. Lovebirds is different."</blockquote>
              <cite>— Elena & Marcus</cite>
            </div>
            <div className="testimonial-card">
              <img src="https://i.pravatar.cc/300?img=2" alt="Member" className="avatar" />
              <blockquote>"I was tired of the apps. The focus here is strictly on personality, and it completely changed my perspective on modern dating."</blockquote>
              <cite>— Julian R.</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            <img src="https://picsum.photos/seed/showcase1/600/400" alt="Natural Linen" className="showcase-img" />
            <img src="https://picsum.photos/seed/showcase2/600/400" alt="Couple" className="showcase-img" />
            <img src="https://picsum.photos/seed/showcase3/600/400" alt="Street Photography" className="showcase-img" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="card-primary-cta">
            <h2>Ready to find your match?</h2>
            <p>Join an community of people who are as serious about depth as you are.</p>
            <Link to="/profile" className="btn btn-primary">Create Your Profile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}