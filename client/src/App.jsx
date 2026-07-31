import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="container header-container">
          <NavLink to="/" className="brand">yt</NavLink>
          <nav className="main-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="brand">yt</div>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>
            <p className="copyright">&copy; {new Date().getFullYear()} Yt Platforms. Intentional connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}